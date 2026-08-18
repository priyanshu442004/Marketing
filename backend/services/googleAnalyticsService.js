const { google } = require('googleapis');
const prisma = require('../utils/prismaClient');

const GA4_SCOPE = 'https://www.googleapis.com/auth/analytics.readonly';

const DIMENSION_ALIASES = {
  date: 'date',
  sessionSource: 'source',
  sessionMedium: 'medium',
  sessionCampaignName: 'campaign',
  landingPagePlusQueryString: 'landingPage',
  landingPagePath: 'landingPage',
  eventName: 'eventName',
};

const METRIC_ALIASES = {
  sessions: 'sessions',
  users: 'users',
  newUsers: 'newUsers',
  engagedSessions: 'engagedSessions',
  engagementRate: 'engagementRate',
  eventCount: 'eventCount',
  keyEvents: 'keyEvents',
  totalRevenue: 'totalRevenue',
  screenPageViews: 'screenPageViews',
};

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_GA4_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/google/ga4/oauth/callback';

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function buildGoogleConnectUrl() {
  const oauth2Client = getGoogleOAuthClient();
  if (!oauth2Client) return null;

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: ['profile', 'email', GA4_SCOPE],
  });
}

async function exchangeGoogleCode(code) {
  const oauth2Client = getGoogleOAuthClient();
  if (!oauth2Client) {
    throw new Error('Google OAuth is not configured');
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || null,
    expiryDate: tokens.expiry_date || null,
    scope: tokens.scope || GA4_SCOPE,
    googleAccountId: userInfo.data.id || null,
    googleEmail: userInfo.data.email || null,
  };
}

async function getUserConnector(userId) {
  return prisma.userConnector.findFirst({
    where: { userId, connectorId: 'ga4' },
  });
}

async function ensureGoogleConnector(userId, connectorData = {}) {
  const existing = await getUserConnector(userId);

  if (existing) {
    return prisma.userConnector.update({
      where: { id: existing.id },
      data: {
        ...connectorData,
        connected: true,
        status: 'active',
        updatedAt: new Date(),
      },
    });
  }

  return prisma.userConnector.create({
    data: {
      userId,
      connectorId: 'ga4',
      name: 'Google Analytics 4',
      connected: true,
      status: 'active',
      accountName: connectorData.accountName || 'Google Account',
      config: connectorData.config || {},
    },
  });
}

async function getValidGoogleAccessToken(userId) {
  const connector = await getUserConnector(userId);
  if (!connector || !connector.connected) {
    throw new Error('Google Analytics 4 is not connected');
  }

  const config = connector.config || {};
  if (!config.accessToken) {
    throw new Error('No Google access token available');
  }

  const oauth2Client = getGoogleOAuthClient();
  if (!oauth2Client) {
    throw new Error('Google OAuth is not configured');
  }

  if (config.refreshToken) {
    oauth2Client.setCredentials({
      access_token: config.accessToken,
      refresh_token: config.refreshToken,
      expiry_date: config.expiryDate || undefined,
    });

    const expiryDate = Number(config.expiryDate || 0);
    if (!expiryDate || Date.now() >= expiryDate - 60000) {
      const refreshed = await oauth2Client.refreshAccessToken();
      const updatedConfig = {
        ...config,
        accessToken: refreshed.credentials.access_token,
        refreshToken: refreshed.credentials.refresh_token || config.refreshToken,
        expiryDate: refreshed.credentials.expiry_date || null,
        scope: refreshed.credentials.scope || config.scope,
      };

      await prisma.userConnector.update({
        where: { id: connector.id },
        data: { config: updatedConfig },
      });

      return refreshed.credentials.access_token;
    }
  }

  return config.accessToken;
}

async function listAccessibleProperties(userId) {
  const connector = await getUserConnector(userId);
  if (!connector || !connector.connected) {
    return [];
  }

  const accessToken = await getValidGoogleAccessToken(userId);
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });

  const admin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });
  const accountsResponse = await admin.accounts.list();
  const properties = [];

  for (const account of accountsResponse.data.accounts || []) {
    const accountId = String(account.name || '').split('/').pop();
    const accountName = account.displayName || account.name || 'Google Account';

    if (!accountId) continue;

    try {
      const response = await admin.properties.list({ parent: `accounts/${accountId}` });
      for (const property of response.data.properties || []) {
        const propertyId = String(property.name || '').split('/').pop();
        const propertyType = property.propertyType || 'PROPERTY_TYPE_WEB';
        const isGa4 = ['PROPERTY_TYPE_WEB', 'PROPERTY_TYPE_APP', 'PROPERTY_TYPE_SUBPROPERTY'].includes(propertyType);

        if (!propertyId || !isGa4) continue;

        properties.push({
          accountId,
          accountName,
          propertyId,
          propertyName: property.displayName || property.name || propertyId,
          displayName: property.displayName || property.name || propertyId,
        });
      }
    } catch (error) {
      continue;
    }
  }

  return properties;
}

async function verifyPropertyAccess(userId, propertyId) {
  const normalizedPropertyId = String(propertyId || '').trim();
  if (!normalizedPropertyId) return false;

  const properties = await listAccessibleProperties(userId);
  return properties.some((property) => String(property.propertyId) === normalizedPropertyId);
}

function normalizeDimensionName(dimensionName) {
  const mapped = DIMENSION_ALIASES[dimensionName] || dimensionName;
  return mapped.replace(/^dimension_/, '');
}

function normalizeMetricName(metricName) {
  return METRIC_ALIASES[metricName] || metricName;
}

function normalizeGa4Row(row = {}, config = {}) {
  const dimensions = config.dimensions || [];
  const metrics = config.metrics || [];
  const output = {
    date: null,
    source: null,
    medium: null,
    campaign: null,
    landingPage: null,
    eventName: null,
  };

  const dimensionValues = row.dimensionValues || [];
  dimensionValues.forEach((valueObj, index) => {
    const name = normalizeDimensionName(dimensions[index] || 'dimension');
    output[name] = String(valueObj?.value || '').trim() || null;
  });

  const metricValues = row.metricValues || [];
  metrics.forEach((metricName, index) => {
    const alias = normalizeMetricName(metricName);
    const raw = metricValues[index]?.value;
    const numeric = safeNumber(raw, 0);
    output[alias] = alias === 'engagementRate' ? numeric : numeric;
  });

  const final = {
    date: output.date || null,
    source: output.source || null,
    medium: output.medium || null,
    campaign: output.campaign || null,
    landingPage: output.landingPage || null,
    eventName: output.eventName || null,
    sessions: safeNumber(output.sessions, 0),
    users: safeNumber(output.users, 0),
    newUsers: safeNumber(output.newUsers, 0),
    engagedSessions: safeNumber(output.engagedSessions, 0),
    engagementRate: safeNumber(output.engagementRate, 0),
    eventCount: safeNumber(output.eventCount, 0),
    keyEvents: safeNumber(output.keyEvents, 0),
    totalRevenue: safeNumber(output.totalRevenue, 0),
    totalUsers: safeNumber(output.totalUsers, 0),
  };

  return final;
}

function buildOverviewSummary(rows = []) {
  const total = rows.reduce(
    (acc, row) => {
      acc.sessions += safeNumber(row.sessions, 0);
      acc.users += safeNumber(row.users, 0);
      acc.engagedSessions += safeNumber(row.engagedSessions, 0);
      acc.engagementRate += safeNumber(row.engagementRate, 0);
      acc.keyEvents += safeNumber(row.keyEvents, 0);
      acc.totalRevenue += safeNumber(row.totalRevenue, 0);
      acc.newUsers += safeNumber(row.newUsers, 0);
      return acc;
    },
    { sessions: 0, users: 0, engagedSessions: 0, engagementRate: 0, keyEvents: 0, totalRevenue: 0, newUsers: 0 }
  );

  const count = rows.length || 1;
  return {
    sessions: total.sessions,
    users: total.users,
    engagedSessions: total.engagedSessions,
    engagementRate: rows.length > 0 ? total.engagementRate / count : 0,
    keyEvents: total.keyEvents,
    totalRevenue: total.totalRevenue,
    newUsers: total.newUsers,
  };
}

function calculatePeriodChange(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(2));
}

function buildMarketingInsightSummary(ga4Context = {}, gscContext = {}) {
  const topLandingPages = ga4Context.topLandingPages || [];
  const topTrafficSources = ga4Context.topTrafficSources || [];
  const highConversionPages = ga4Context.highConversionPages || [];
  const lowConversionPages = ga4Context.lowConversionPages || [];
  const lowCtr = gscContext.lowCtr || [];
  const highPerformers = gscContext.highPerformers || [];

  const summary = [
    lowCtr.length > 0 || highPerformers.length > 0 ? 'SEO visibility is strong but landing-page conversion needs improvement.' : 'Traffic quality is stable and conversion opportunities are being monitored.',
    topTrafficSources.length ? `Top source ${topTrafficSources[0].source || 'organic'} is driving the strongest demand.` : 'Traffic mix is still being monitored.',
    topLandingPages.length ? `The best-performing landing page is ${topLandingPages[0].landingPage || 'your top page'}.` : 'Landing pages need additional conversion testing.',
  ].join(' ');

  return {
    summary,
    topLandingPages,
    topTrafficSources,
    highConversionPages,
    lowConversionPages,
    trafficTrends: ga4Context.trafficTrends || [],
    conversionTrends: ga4Context.conversionTrends || [],
    lowCtr,
    highPerformers,
  };
}

async function queryGa4Report(userId, { startDate, endDate, dimensions = [], metrics = [], limit = 1000, orderBy = null }) {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId } });
  if (!integration) {
    throw new Error('No Google Analytics 4 property selected');
  }

  const propertyAccess = await verifyPropertyAccess(userId, integration.propertyId);
  if (!propertyAccess) {
    throw new Error('Selected GA4 property is not accessible to the connected Google account');
  }

  const accessToken = await getValidGoogleAccessToken(userId);
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });

  const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: oauth2Client });
  const response = await analyticsdata.properties.runReport({
    property: `properties/${integration.propertyId}`,
    request: {
      dateRanges: [{ startDate, endDate }],
      dimensions: dimensions.map((dimension) => ({ name: dimension })),
      metrics: metrics.map((metric) => ({ name: metric })),
      limit,
      orderBys: orderBy ? [{ desc: true, metric: { metricName: orderBy } }] : undefined,
    },
  });

  return (response.data.rows || []).map((row) => normalizeGa4Row(row, { dimensions, metrics }));
}

async function syncGoogleAnalytics(userId) {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId } });
  if (!integration) {
    throw new Error('No GA4 property selected');
  }

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90);

  const reportSets = [
    {
      dimensions: ['date'],
      metrics: ['sessions', 'users', 'newUsers', 'engagedSessions', 'engagementRate', 'eventCount', 'keyEvents', 'totalRevenue'],
    },
    {
      dimensions: ['sessionSource', 'sessionMedium', 'sessionCampaignName'],
      metrics: ['sessions', 'users', 'engagedSessions', 'engagementRate', 'keyEvents', 'totalRevenue'],
    },
    {
      dimensions: ['landingPagePlusQueryString'],
      metrics: ['sessions', 'users', 'engagedSessions', 'engagementRate', 'keyEvents', 'totalRevenue'],
    },
    {
      dimensions: ['eventName'],
      metrics: ['eventCount', 'totalUsers', 'keyEvents'],
    },
  ];

  const records = [];
  for (const report of reportSets) {
    const rows = await queryGa4Report(userId, {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      dimensions: report.dimensions,
      metrics: report.metrics,
      limit: 500,
    });

    for (const row of rows) {
      const normalized = {
        integrationId: integration.id,
        propertyId: integration.propertyId,
        date: row.date || startDate.toISOString().slice(0, 10),
        source: row.source || '',
        medium: row.medium || '',
        campaign: row.campaign || '',
        landingPage: row.landingPage || '',
        users: safeNumber(row.users, 0),
        sessions: safeNumber(row.sessions, 0),
        engagedSessions: safeNumber(row.engagedSessions, 0),
        engagementRate: safeNumber(row.engagementRate, 0),
        keyEvents: safeNumber(row.keyEvents, 0),
        totalRevenue: safeNumber(row.totalRevenue, 0),
        eventCount: safeNumber(row.eventCount, 0),
      };

      records.push(normalized);
    }
  }

  const unique = new Map();
  for (const record of records) {
    const key = [
      record.integrationId,
      record.date,
      record.source || '',
      record.medium || '',
      record.campaign || '',
      record.landingPage || '',
    ].join('::');

    if (!unique.has(key)) {
      unique.set(key, record);
    }
  }

  for (const record of unique.values()) {
    await prisma.googleAnalyticsRecord.upsert({
      where: {
        integrationId_date_source_medium_campaign_landingPage: {
          integrationId: record.integrationId,
          date: record.date,
          source: record.source || '',
          medium: record.medium || '',
          campaign: record.campaign || '',
          landingPage: record.landingPage || '',
        },
      },
      update: {
        propertyId: record.propertyId,
        users: record.users,
        sessions: record.sessions,
        engagedSessions: record.engagedSessions,
        engagementRate: record.engagementRate,
        keyEvents: record.keyEvents,
        totalRevenue: record.totalRevenue,
        updatedAt: new Date(),
      },
      create: {
        integrationId: record.integrationId,
        propertyId: record.propertyId,
        date: record.date,
        source: record.source || '',
        medium: record.medium || '',
        campaign: record.campaign || '',
        landingPage: record.landingPage || '',
        users: record.users,
        sessions: record.sessions,
        engagedSessions: record.engagedSessions,
        engagementRate: record.engagementRate,
        keyEvents: record.keyEvents,
        totalRevenue: record.totalRevenue,
      },
    });
  }

  await prisma.googleAnalyticsIntegration.update({
    where: { id: integration.id },
    data: { lastSyncAt: new Date(), status: 'active' },
  });

  await prisma.userConnector.updateMany({
    where: { userId, connectorId: 'ga4' },
    data: { lastSyncedAt: new Date(), connected: true, status: 'active' },
  });

  return {
    success: true,
    recordsProcessed: unique.size,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    lastSyncAt: new Date().toISOString(),
  };
}

async function getGa4Overview(userId, startDate, endDate) {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId } });
  if (!integration) {
    return { sessions: 0, users: 0, engagedSessions: 0, engagementRate: 0, keyEvents: 0, totalRevenue: 0, previousPeriod: { sessions: 0, users: 0, engagedSessions: 0, engagementRate: 0, keyEvents: 0, totalRevenue: 0 }, changes: { sessions: 0, users: 0, engagedSessions: 0, engagementRate: 0, keyEvents: 0, totalRevenue: 0 } };
  }

  const currentRows = await prisma.googleAnalyticsRecord.findMany({
    where: { integrationId: integration.id, date: { gte: startDate, lte: endDate } },
  });

  const current = buildOverviewSummary(currentRows.map((row) => ({
    sessions: row.sessions,
    users: row.users,
    engagedSessions: row.engagedSessions,
    engagementRate: row.engagementRate,
    keyEvents: row.keyEvents,
    totalRevenue: row.totalRevenue,
  })));

  const previousStart = new Date(startDate);
  previousStart.setDate(previousStart.getDate() - 90);
  const previousEnd = new Date(endDate);
  previousEnd.setDate(previousEnd.getDate() - 90);

  const previousRows = await prisma.googleAnalyticsRecord.findMany({
    where: {
      integrationId: integration.id,
      date: {
        gte: previousStart.toISOString().slice(0, 10),
        lte: previousEnd.toISOString().slice(0, 10),
      },
    },
  });

  const previous = buildOverviewSummary(previousRows.map((row) => ({
    sessions: row.sessions,
    users: row.users,
    engagedSessions: row.engagedSessions,
    engagementRate: row.engagementRate,
    keyEvents: row.keyEvents,
    totalRevenue: row.totalRevenue,
  })));

  return {
    ...current,
    previousPeriod: previous,
    changes: {
      sessions: calculatePeriodChange(current.sessions, previous.sessions),
      users: calculatePeriodChange(current.users, previous.users),
      engagedSessions: calculatePeriodChange(current.engagedSessions, previous.engagedSessions),
      engagementRate: calculatePeriodChange(current.engagementRate, previous.engagementRate),
      keyEvents: calculatePeriodChange(current.keyEvents, previous.keyEvents),
      totalRevenue: calculatePeriodChange(current.totalRevenue, previous.totalRevenue),
    },
  };
}

async function getGa4Acquisition(userId, startDate, endDate, limit = 20) {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId } });
  if (!integration) return [];

  const rows = await prisma.googleAnalyticsRecord.findMany({
    where: {
      integrationId: integration.id,
      date: { gte: startDate, lte: endDate },
      source: { not: '' },
    },
    take: limit,
    orderBy: { sessions: 'desc' },
  });

  return rows.map((row) => ({
    source: row.source,
    medium: row.medium,
    campaign: row.campaign,
    sessions: row.sessions,
    users: row.users,
    engagedSessions: row.engagedSessions,
    engagementRate: row.engagementRate,
    keyEvents: row.keyEvents,
    totalRevenue: row.totalRevenue,
  }));
}

async function getGa4LandingPages(userId, startDate, endDate, limit = 20) {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId } });
  if (!integration) return [];

  const rows = await prisma.googleAnalyticsRecord.findMany({
    where: {
      integrationId: integration.id,
      date: { gte: startDate, lte: endDate },
      landingPage: { not: '' },
    },
    take: limit,
    orderBy: { sessions: 'desc' },
  });

  return rows.map((row) => ({
    landingPage: row.landingPage,
    sessions: row.sessions,
    users: row.users,
    engagedSessions: row.engagedSessions,
    engagementRate: row.engagementRate,
    keyEvents: row.keyEvents,
    totalRevenue: row.totalRevenue,
  }));
}

async function getGa4Events(userId, startDate, endDate, limit = 20) {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId } });
  if (!integration) return [];

  const rows = await prisma.googleAnalyticsRecord.findMany({
    where: {
      integrationId: integration.id,
      date: { gte: startDate, lte: endDate },
      eventName: { not: '' },
    },
    take: limit,
    orderBy: { eventCount: 'desc' },
  });

  return rows.map((row) => ({
    eventName: row.eventName,
    eventCount: row.eventCount,
    totalUsers: row.users,
    keyEvents: row.keyEvents,
  }));
}

module.exports = {
  GA4_SCOPE,
  buildGoogleConnectUrl,
  exchangeGoogleCode,
  ensureGoogleConnector,
  getValidGoogleAccessToken,
  getUserConnector,
  listAccessibleProperties,
  verifyPropertyAccess,
  normalizeGa4Row,
  buildOverviewSummary,
  calculatePeriodChange,
  buildMarketingInsightSummary,
  queryGa4Report,
  syncGoogleAnalytics,
  getGa4Overview,
  getGa4Acquisition,
  getGa4LandingPages,
  getGa4Events,
};
