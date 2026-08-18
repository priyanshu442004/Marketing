const { google } = require('googleapis');
const prisma = require('../utils/prismaClient');

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const DEFAULT_REPORTS = [
  { dimensions: ['date', 'query'], label: 'queryPerformance' },
  { dimensions: ['date', 'page'], label: 'pagePerformance' },
  { dimensions: ['query', 'page'], label: 'queryPagePerformance' },
  { dimensions: ['country'], label: 'countryPerformance' },
  { dimensions: ['device'], label: 'devicePerformance' },
];

function normalizeSiteUrl(rawValue) {
  if (!rawValue) return '';
  const value = String(rawValue).trim();
  if (!value) return '';

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return `${url.origin}`.replace(/\/$/, '');
  } catch (error) {
    return value.replace(/\/$/, '').replace(/\/.*$/, '');
  }
}

function normalizePageUrl(rawValue) {
  if (!rawValue) return '';
  const value = String(rawValue).trim();
  if (!value) return '';

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return `${url.origin}${url.pathname || '/'}`.replace(/\/$/, '');
  } catch (error) {
    return value.replace(/[?#].*$/, '').replace(/\/$/, '');
  }
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeSearchAnalyticsResponse(rows = [], fallbackSiteUrl = '') {
  return rows.map((row) => {
    const clicks = safeNumber(row.clicks, 0);
    const impressions = safeNumber(row.impressions, 0);
    const ctr = safeNumber(row.ctr, 0);
    const position = safeNumber(row.position, 0);
    const page = normalizePageUrl(row.page || row.url || '');
    const siteUrl = normalizeSiteUrl(fallbackSiteUrl || row.siteUrl || row.page || '');

    return {
      siteUrl,
      date: row.date || null,
      query: String(row.query || '').trim() || '(not provided)',
      page,
      country: String(row.country || 'all').trim() || 'all',
      device: String(row.device || 'DESKTOP').trim().toUpperCase() || 'DESKTOP',
      searchType: String(row.searchType || 'Web').trim() || 'Web',
      clicks,
      impressions,
      ctr: impressions > 0 && ctr === 0 && clicks > 0 ? clicks / impressions : ctr,
      averagePosition: position,
      position,
      createdAt: new Date().toISOString(),
    };
  });
}

function buildOverviewSummary(rows = []) {
  const totalClicks = rows.reduce((sum, row) => sum + safeNumber(row.clicks, 0), 0);
  const totalImpressions = rows.reduce((sum, row) => sum + safeNumber(row.impressions, 0), 0);
  const totalCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgPosition = rows.length > 0
    ? rows.reduce((sum, row) => sum + safeNumber(row.position, 0), 0) / rows.length
    : 0;

  return {
    clicks: totalClicks,
    impressions: totalImpressions,
    ctr: totalCtr,
    avgPosition,
    averagePosition: avgPosition,
  };
}

function computeComparison(currentValue, previousValue) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

function detectOpportunities(rows = []) {
  const normalized = normalizeSearchAnalyticsResponse(rows);

  const lowCtr = normalized
    .filter((row) => safeNumber(row.impressions, 0) >= 2500 && safeNumber(row.position, 0) >= 3 && safeNumber(row.position, 0) <= 20 && safeNumber(row.ctr, 0) < 0.025)
    .sort((a, b) => safeNumber(b.impressions) - safeNumber(a.impressions))
    .slice(0, 10)
    .map((row) => ({
      query: row.query,
      page: row.page,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      recommendation: 'Review the title and meta description to improve click-through rate.',
    }));

  const ranking = normalized
    .filter((row) => safeNumber(row.impressions, 0) >= 500 && safeNumber(row.position, 0) >= 4 && safeNumber(row.position, 0) <= 20)
    .sort((a, b) => safeNumber(b.impressions) - safeNumber(a.impressions))
    .slice(0, 10)
    .map((row) => ({
      query: row.query,
      page: row.page,
      impressions: row.impressions,
      position: row.position,
      recommendation: 'Refresh content and improve on-page SEO to better match search intent.',
    }));

  const byQuery = new Map();
  for (const row of normalized) {
    const key = row.query;
    const current = byQuery.get(key) || { clicks: 0, impressions: 0, positionTotal: 0, count: 0 };
    const next = {
      query: key,
      clicks: current.clicks + safeNumber(row.clicks, 0),
      impressions: current.impressions + safeNumber(row.impressions, 0),
      positionTotal: current.positionTotal + safeNumber(row.position, 0),
      count: current.count + 1,
    };
    byQuery.set(key, next);
  }

  const highPerformers = Array.from(byQuery.values())
    .map((entry) => ({
      query: entry.query,
      clicks: entry.clicks,
      impressions: entry.impressions,
      ctr: entry.impressions > 0 ? entry.clicks / entry.impressions : 0,
      avgPosition: entry.count > 0 ? entry.positionTotal / entry.count : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const declining = normalized
    .filter((row) => safeNumber(row.position, 0) > 0)
    .map((row) => ({ ...row, trend: 'stable' }))
    .slice(0, 5);

  return {
    lowCtr,
    ranking,
    highPerformers,
    declining,
    decliningQueries: declining,
    decliningPages: declining,
  };
}

function buildGoogleSearchConsoleContext(rows = []) {
  const opportunities = detectOpportunities(rows);

  return {
    topQueries: opportunities.highPerformers.slice(0, 5),
    topPages: [...new Map(rows
      .map((row) => [row.page, { page: row.page, clicks: safeNumber(row.clicks, 0), impressions: safeNumber(row.impressions, 0) }]))
      .values()].sort((a, b) => b.clicks - a.clicks).slice(0, 5),
    decliningQueries: opportunities.decliningQueries.slice(0, 5),
    decliningPages: opportunities.decliningPages.slice(0, 5),
    rankingOpportunities: opportunities.ranking.slice(0, 5),
    lowCtrOpportunities: opportunities.lowCtr.slice(0, 5),
  };
}

function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_GSC_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/google/gsc/oauth/callback';

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function buildGoogleConnectUrl() {
  const oauth2Client = getGoogleOAuthClient();

  if (!oauth2Client) {
    return null;
  }

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: ['profile', 'email', GSC_SCOPE],
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
    scope: tokens.scope || GSC_SCOPE,
    googleAccountId: userInfo.data.id || null,
    googleEmail: userInfo.data.email || null,
  };
}

async function getUserConnector(userId) {
  return prisma.userConnector.findFirst({
    where: { userId, connectorId: 'gsc' },
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
      connectorId: 'gsc',
      name: 'Google Search Console',
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
    throw new Error('Google Search Console is not connected');
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

async function listAccessibleSites(userId) {
  const connector = await getUserConnector(userId);
  if (!connector || !connector.connected) {
    return [];
  }

  const accessToken = await getValidGoogleAccessToken(userId);
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });
  const webmasters = google.webmasters({ version: 'v3', auth: oauth2Client });
  const response = await webmasters.sites.list();

  return (response.data.siteEntry || []).map((entry) => ({
    siteUrl: normalizeSiteUrl(entry.siteUrl || entry.url || ''),
    permissionLevel: entry.permissionLevel || 'siteOwner',
  })).filter((site) => site.siteUrl);
}

async function verifyPropertyAccess(userId, siteUrl) {
  const normalized = normalizeSiteUrl(siteUrl);
  const sites = await listAccessibleSites(userId);
  return sites.some((site) => normalizeSiteUrl(site.siteUrl) === normalized);
}

async function querySearchConsoleReport(userId, reportConfig) {
  const connector = await getUserConnector(userId);
  if (!connector || !connector.connected) {
    throw new Error('Google Search Console is not connected');
  }

  const accessToken = await getValidGoogleAccessToken(userId);
  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });

  const webmasters = google.webmasters({ version: 'v3', auth: oauth2Client });
  const integration = await prisma.googleSearchConsoleIntegration.findFirst({
    where: { userId },
  });

  if (!integration) {
    throw new Error('No Search Console property selected');
  }

  const response = await webmasters.searchanalytics.query({
    siteUrl: integration.siteUrl,
    requestBody: {
      startDate: reportConfig.startDate,
      endDate: reportConfig.endDate,
      dimensions: reportConfig.dimensions || [],
      rowLimit: reportConfig.rowLimit || 2500,
      type: reportConfig.type || 'web',
    },
  });

  return normalizeSearchAnalyticsResponse(response.data.rows || [], integration.siteUrl);
}

async function syncGoogleSearchConsole(userId) {
  const integration = await prisma.googleSearchConsoleIntegration.findFirst({
    where: { userId },
  });

  if (!integration) {
    throw new Error('No Search Console property selected');
  }

  const propertyAccess = await verifyPropertyAccess(userId, integration.siteUrl);
  if (!propertyAccess) {
    throw new Error('Selected property is not accessible to the connected Google account');
  }

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90);

  const rows = [];
  for (const report of DEFAULT_REPORTS) {
    const response = await querySearchConsoleReport(userId, {
      dimensions: report.dimensions,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      rowLimit: 2500,
    });
    rows.push(...response);
  }

  const uniqueSet = new Set();
  const finalRows = [];

  for (const row of rows) {
    const signature = [
      integration.id,
      row.date || 'unknown',
      String(row.query || '').trim(),
      String(row.page || '').trim(),
      String(row.country || 'all').trim(),
      String(row.device || 'DESKTOP').trim().toUpperCase(),
      String(row.searchType || 'Web').trim(),
    ].join('::');

    if (uniqueSet.has(signature)) continue;
    uniqueSet.add(signature);
    finalRows.push(row);
  }

  for (const row of finalRows) {
    await prisma.googleSearchConsoleRecord.upsert({
      where: {
        integrationId_date_query_page_country_device_searchType: {
          integrationId: integration.id,
          date: row.date || 'unknown',
          query: String(row.query || '').trim(),
          page: row.page || '',
          country: String(row.country || 'all').trim(),
          device: String(row.device || 'DESKTOP').trim().toUpperCase(),
          searchType: String(row.searchType || 'Web').trim(),
        },
      },
      update: {
        siteUrl: integration.siteUrl,
        clicks: safeNumber(row.clicks, 0),
        impressions: safeNumber(row.impressions, 0),
        ctr: safeNumber(row.ctr, 0),
        averagePosition: safeNumber(row.averagePosition, 0),
        updatedAt: new Date(),
      },
      create: {
        integrationId: integration.id,
        siteUrl: integration.siteUrl,
        date: row.date || 'unknown',
        query: String(row.query || '').trim(),
        page: row.page || '',
        country: String(row.country || 'all').trim(),
        device: String(row.device || 'DESKTOP').trim().toUpperCase(),
        searchType: String(row.searchType || 'Web').trim(),
        clicks: safeNumber(row.clicks, 0),
        impressions: safeNumber(row.impressions, 0),
        ctr: safeNumber(row.ctr, 0),
        averagePosition: safeNumber(row.averagePosition, 0),
      },
    });
  }

  await prisma.googleSearchConsoleIntegration.update({
    where: { id: integration.id },
    data: { lastSyncAt: new Date() },
  });

  await prisma.userConnector.updateMany({
    where: { userId, connectorId: 'gsc' },
    data: { lastSyncedAt: new Date(), connected: true, status: 'active' },
  });

  return {
    success: true,
    recordsProcessed: finalRows.length,
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    lastSyncAt: new Date().toISOString(),
  };
}

async function getGscOverview(userId, startDate, endDate) {
  const integration = await prisma.googleSearchConsoleIntegration.findFirst({ where: { userId } });
  if (!integration) {
    return { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0, previousPeriod: { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 } };
  }

  const where = {
    integrationId: integration.id,
    date: {
      gte: startDate,
      lte: endDate,
    },
  };

  const rows = await prisma.googleSearchConsoleRecord.findMany({ where });
  const summary = buildOverviewSummary(rows.map((row) => ({
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.averagePosition,
  })));

  const previousStart = new Date(startDate);
  previousStart.setDate(previousStart.getDate() - 30);
  const previousEnd = new Date(endDate);
  previousEnd.setDate(previousEnd.getDate() - 30);

  const previous = await prisma.googleSearchConsoleRecord.findMany({
    where: {
      integrationId: integration.id,
      date: {
        gte: previousStart.toISOString().slice(0, 10),
        lte: previousEnd.toISOString().slice(0, 10),
      },
    },
  });

  const prevSummary = buildOverviewSummary(previous.map((row) => ({
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.averagePosition,
  })));

  return {
    clicks: summary.clicks,
    impressions: summary.impressions,
    ctr: summary.ctr,
    avgPosition: summary.avgPosition,
    averagePosition: summary.avgPosition,
    previousPeriod: {
      clicks: prevSummary.clicks,
      impressions: prevSummary.impressions,
      ctr: prevSummary.ctr,
      avgPosition: prevSummary.avgPosition,
    },
    changes: {
      clicks: computeComparison(summary.clicks, prevSummary.clicks),
      impressions: computeComparison(summary.impressions, prevSummary.impressions),
      ctr: computeComparison(summary.ctr, prevSummary.ctr),
      avgPosition: computeComparison(summary.avgPosition, prevSummary.avgPosition),
    },
  };
}

async function getGscRecordsByGroup(userId, groupField, options = {}) {
  const integration = await prisma.googleSearchConsoleIntegration.findFirst({ where: { userId } });
  if (!integration) {
    return [];
  }

  const where = {
    integrationId: integration.id,
  };

  if (options.startDate && options.endDate) {
    where.date = {
      gte: options.startDate,
      lte: options.endDate,
    };
  }

  if (options.search) {
    where.query = { contains: options.search, mode: 'insensitive' };
  }

  const rows = await prisma.googleSearchConsoleRecord.findMany({
    where,
    orderBy: options.orderBy || { createdAt: 'desc' },
    take: options.limit || 20,
  });

  if (!groupField) return rows;

  const groupedMap = new Map();
  for (const row of rows) {
    const key = String(row[groupField] || 'unknown');
    if (!groupedMap.has(key)) {
      groupedMap.set(key, { [groupField]: key, clicks: 0, impressions: 0, ctr: 0, position: 0, count: 0 });
    }
    const current = groupedMap.get(key);
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.ctr += row.ctr;
    current.position += row.averagePosition;
    current.count += 1;
  }

  return Array.from(groupedMap.values()).map((item) => ({
    ...item,
    ctr: item.impressions > 0 ? item.clicks / item.impressions : 0,
    avgPosition: item.count > 0 ? item.position / item.count : 0,
  })).sort((a, b) => b.clicks - a.clicks);
}

module.exports = {
  DEFAULT_REPORTS,
  GSC_SCOPE,
  normalizeSiteUrl,
  normalizePageUrl,
  normalizeSearchAnalyticsResponse,
  buildOverviewSummary,
  detectOpportunities,
  buildGoogleSearchConsoleContext,
  getGoogleOAuthClient,
  buildGoogleConnectUrl,
  exchangeGoogleCode,
  ensureGoogleConnector,
  getValidGoogleAccessToken,
  listAccessibleSites,
  verifyPropertyAccess,
  querySearchConsoleReport,
  syncGoogleSearchConsole,
  getGscOverview,
  getGscRecordsByGroup,
  getUserConnector,
  matchWebsiteAnalysisDomain: (siteUrl, domain) => {
    const normalizedSiteUrl = normalizeSiteUrl(siteUrl || '');
    const normalizedDomain = normalizeSiteUrl(domain || '');
    if (!normalizedSiteUrl || !normalizedDomain) return false;
    return normalizedSiteUrl.includes(normalizedDomain) || normalizedDomain.includes(normalizedSiteUrl);
  },
};
