const axios = require('axios');
const { google } = require('googleapis');
const prisma = require('../utils/prismaClient');

const ADS_SCOPE = 'https://www.googleapis.com/auth/adwords';

function safeNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeCustomerId(value) {
  return String(value || '').replace(/[^0-9]/g, '').trim();
}

function getGoogleOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_ADS_CALLBACK_URL || process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/google/ads/oauth/callback';

  if (!clientId || !clientSecret || !redirectUri) {
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function buildGoogleAdsConnectUrl() {
  const oauth2Client = getGoogleOAuthClient();
  if (!oauth2Client) {
    return null;
  }

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: ['profile', 'email', ADS_SCOPE],
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
    scope: tokens.scope || ADS_SCOPE,
    googleAccountId: userInfo.data.id || null,
    googleEmail: userInfo.data.email || null,
  };
}

async function getUserConnector(userId) {
  return prisma.userConnector.findFirst({
    where: { userId, connectorId: 'ads' },
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
      connectorId: 'ads',
      name: 'Google Ads',
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
    throw new Error('Google Ads is not connected');
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

function getGoogleAdsConfig() {
  return {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || null,
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || null,
  };
}

async function queryGoogleAdsApi(userId, customerId, query) {
  const accessToken = await getValidGoogleAccessToken(userId);
  const { developerToken, loginCustomerId } = getGoogleAdsConfig();

  if (!developerToken) {
    throw new Error('Google Ads developer token is not configured');
  }

  const normalizedCustomerId = normalizeCustomerId(customerId);
  if (!normalizedCustomerId) {
    throw new Error('Google Ads customer ID is required');
  }

  const endpoint = `https://googleads.googleapis.com/v18/customers/${normalizedCustomerId}/googleAds:searchStream`;

  const response = await axios.post(
    endpoint,
    { query },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(loginCustomerId ? { 'login-customer-id': normalizeCustomerId(loginCustomerId) } : {}),
      },
      timeout: 60000,
    }
  );

  return response.data.results || response.data || [];
}

async function listAccessibleCustomers(userId) {
  const connector = await getUserConnector(userId);
  if (!connector || !connector.connected) {
    return [];
  }

  try {
    const rows = await queryGoogleAdsApi(userId, process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '0', 'SELECT customer.id, customer.descriptive_name, customer.manager FROM customer');
    return (rows || []).map((row) => ({
      customerId: String(row.customer?.id || row.customerId || '').replace(/[^0-9]/g, ''),
      descriptiveName: row.customer?.descriptiveName || row.customer?.descriptive_name || 'Google Ads Account',
      manager: Boolean(row.customer?.manager || row.customer?.manager_status || false),
    })).filter((row) => row.customerId);
  } catch (error) {
    if (error.response?.status === 401 || error.response?.data?.error?.status === 'UNAUTHENTICATED') {
      throw new Error('Google authorization is invalid or revoked');
    }

    if (error.response?.status === 403 || error.response?.data?.error?.status === 'PERMISSION_DENIED') {
      throw new Error('Google Ads access is not available for the authenticated account');
    }

    throw error;
  }
}

async function verifyCustomerAccess(userId, customerId) {
  const normalized = normalizeCustomerId(customerId);
  if (!normalized) return false;

  const customers = await listAccessibleCustomers(userId);
  return customers.some((customer) => String(customer.customerId) === normalized);
}

function getMetricValue(row, keys) {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }

  return undefined;
}

function normalizeGoogleAdsRow(result = {}, type = 'campaign') {
  const campaign = result.campaign || {};
  const adGroup = result.adGroup || result.ad_group || {};
  const keyword = result.keyword || {};
  const segments = result.segments || {};
  const metrics = result.metrics || {};

  const date = segments.date || segments.dateRange?.startDate || new Date().toISOString().slice(0, 10);
  const costMicros = safeNumber(
    getMetricValue(metrics, ['costMicros', 'cost_micros', 'cost']) ||
      getMetricValue(result, ['costMicros', 'cost_micros']) ||
      0,
    0
  );

  const conversions = safeNumber(
    getMetricValue(metrics, ['conversions', 'conversionsValue']) ||
      getMetricValue(result, ['conversions', 'conversionsValue']) ||
      0,
    0
  );

  const conversionValue = safeNumber(
    getMetricValue(metrics, ['conversionsValue', 'conversions_value']) ||
      getMetricValue(result, ['conversionsValue', 'conversions_value']) ||
      0,
    0
  );

  const row = {
    date,
    customerId: normalizeCustomerId(getMetricValue(result, ['customerId']) || result.customer?.id || ''),
    campaignId: String(campaign.id || result.campaignId || ''),
    campaignName: campaign.name || result.campaignName || '',
    campaignStatus: campaign.status || result.campaignStatus || '',
    adGroupId: String(adGroup.id || result.adGroupId || ''),
    adGroupName: adGroup.name || result.adGroupName || '',
    keywordId: String(keyword.id || result.keywordId || ''),
    keywordText: keyword.text || keyword.resourceName || result.keywordText || '',
    matchType: keyword.matchType || result.matchType || '',
    impressions: safeNumber(getMetricValue(metrics, ['impressions', 'impression']) || 0, 0),
    clicks: safeNumber(getMetricValue(metrics, ['clicks']) || 0, 0),
    costMicros,
    conversions,
    conversionsValue: conversionValue,
    ctr: safeNumber(getMetricValue(metrics, ['ctr']) || 0, 0),
    averageCpc: safeNumber(getMetricValue(metrics, ['averageCpc', 'average_cpc']) || 0, 0),
  };

  if (type === 'campaign') {
    row.adGroupId = '';
    row.adGroupName = '';
    row.keywordId = '';
    row.keywordText = '';
    row.matchType = '';
  }

  if (type === 'adGroup') {
    row.keywordId = '';
    row.keywordText = '';
    row.matchType = '';
  }

  return row;
}

function buildOverviewSummary(rows = []) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.impressions += safeNumber(row.impressions, 0);
      acc.clicks += safeNumber(row.clicks, 0);
      acc.costMicros += safeNumber(row.costMicros, 0);
      acc.conversions += safeNumber(row.conversions, 0);
      acc.conversionValue += safeNumber(row.conversionsValue, 0);
      return acc;
    },
    { impressions: 0, clicks: 0, costMicros: 0, conversions: 0, conversionValue: 0 }
  );

  const ctr = totals.impressions > 0 ? totals.clicks / totals.impressions : 0;
  const averageCpc = totals.clicks > 0 ? totals.costMicros / 1000000 / totals.clicks : 0;
  const cpa = totals.conversions > 0 ? totals.costMicros / 1000000 / totals.conversions : 0;
  const roas = totals.costMicros > 0 ? totals.conversionValue / (totals.costMicros / 1000000) : 0;

  return {
    spend: totals.costMicros / 1000000,
    impressions: totals.impressions,
    clicks: totals.clicks,
    ctr,
    averageCpc,
    conversions: totals.conversions,
    conversionValue: totals.conversionValue,
    cpa,
    roas,
  };
}

function calculateCpc(costMicros, clicks) {
  if (!clicks) return 0;
  return (safeNumber(costMicros, 0) / 1000000) / safeNumber(clicks, 0);
}

function buildGoogleAdsContext(rows = []) {
  const campaigns = rows
    .filter((row) => row.campaignName)
    .reduce((acc, row) => {
      const key = row.campaignId || row.campaignName;
      if (!acc[key]) {
        acc[key] = { campaignId: row.campaignId, campaignName: row.campaignName, spend: 0, conversions: 0, impressions: 0, clicks: 0 };
      }
      acc[key].spend += safeNumber(row.costMicros, 0) / 1000000;
      acc[key].conversions += safeNumber(row.conversions, 0);
      acc[key].impressions += safeNumber(row.impressions, 0);
      acc[key].clicks += safeNumber(row.clicks, 0);
      return acc;
    }, {});

  const topCampaigns = Object.values(campaigns)
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 5)
    .map((entry) => ({
      campaign: entry.campaignName || entry.campaignId,
      spend: entry.spend,
      conversions: entry.conversions,
      cpa: entry.conversions > 0 ? entry.spend / entry.conversions : entry.spend,
      roas: entry.spend > 0 ? (entry.conversions > 0 ? (entry.conversions * 100) / entry.spend : 0) : 0,
    }));

  const underperformingCampaigns = Object.values(campaigns)
    .filter((entry) => entry.spend > 0)
    .sort((a, b) => (b.spend / Math.max(b.conversions, 1)) - (a.spend / Math.max(a.conversions, 1)))
    .slice(0, 5)
    .map((entry) => ({
      campaign: entry.campaignName || entry.campaignId,
      spend: entry.spend,
      conversions: entry.conversions,
      cpa: entry.conversions > 0 ? entry.spend / entry.conversions : entry.spend,
    }));

  const keywords = rows
    .filter((row) => row.keywordText)
    .sort((a, b) => safeNumber(b.conversionsValue, 0) - safeNumber(a.conversionsValue, 0))
    .slice(0, 5)
    .map((row) => ({
      keyword: row.keywordText,
      campaign: row.campaignName,
      cost: safeNumber(row.costMicros, 0) / 1000000,
      conversions: safeNumber(row.conversions, 0),
      cpc: calculateCpc(row.costMicros, row.clicks),
    }));

  const expensiveKeywords = rows
    .filter((row) => row.keywordText && row.clicks > 0)
    .sort((a, b) => calculateCpc(b.costMicros, b.clicks) - calculateCpc(a.costMicros, a.clicks))
    .slice(0, 5)
    .map((row) => ({
      keyword: row.keywordText,
      campaign: row.campaignName,
      cpc: calculateCpc(row.costMicros, row.clicks),
      conversions: safeNumber(row.conversions, 0),
    }));

  return {
    topCampaigns,
    underperformingCampaigns,
    topKeywords: keywords,
    expensiveKeywords,
    paidTrafficInsights: [
      topCampaigns.length ? `Campaign ${topCampaigns[0].campaign} is leading paid conversion efficiency.` : 'Paid performance is still being evaluated.',
      underperformingCampaigns.length ? `Campaign ${underperformingCampaigns[0].campaign} is showing the highest spend-to-result pressure.` : 'No high-cost underperformers were detected.',
    ],
    conversionInsights: [
      topCampaigns.length ? `Use the message and landing page pattern from ${topCampaigns[0].campaign} as a paid growth inspiration.` : 'Conversion insights are being collected.',
    ],
  };
}

async function queryGoogleAdsReport(userId, customerId, query) {
  const normalizedCustomerId = normalizeCustomerId(customerId);
  if (!normalizedCustomerId) {
    throw new Error('A selected customer ID is required');
  }

  const rows = await queryGoogleAdsApi(userId, normalizedCustomerId, query);
  return rows;
}

async function syncGoogleAds(userId) {
  const integration = await prisma.googleAdsIntegration.findFirst({ where: { userId } });
  if (!integration) {
    throw new Error('No Google Ads customer selected');
  }

  const customerId = integration.customerId;
  const accessible = await verifyCustomerAccess(userId, customerId);
  if (!accessible) {
    throw new Error('Selected Google Ads customer is not accessible to the authenticated account');
  }

  const { developerToken } = getGoogleAdsConfig();
  if (!developerToken) {
    throw new Error('Google Ads developer token is not configured');
  }

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 90);

  const queries = [
    `SELECT campaign.id, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.ctr, metrics.average_cpc, metrics.cost_micros, metrics.conversions, metrics.conversions_value, segments.date FROM campaign WHERE segments.date BETWEEN '${startDate.toISOString().slice(0, 10)}' AND '${endDate.toISOString().slice(0, 10)}' ORDER BY metrics.clicks DESC LIMIT 500`,
    `SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, metrics.impressions, metrics.clicks, metrics.ctr, metrics.average_cpc, metrics.cost_micros, metrics.conversions, metrics.conversions_value, segments.date FROM ad_group WHERE segments.date BETWEEN '${startDate.toISOString().slice(0, 10)}' AND '${endDate.toISOString().slice(0, 10)}' ORDER BY metrics.clicks DESC LIMIT 500`,
    `SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, keyword.id, keyword.text, keyword.match_type, metrics.impressions, metrics.clicks, metrics.ctr, metrics.average_cpc, metrics.cost_micros, metrics.conversions, metrics.conversions_value, segments.date FROM keyword WHERE segments.date BETWEEN '${startDate.toISOString().slice(0, 10)}' AND '${endDate.toISOString().slice(0, 10)}' ORDER BY metrics.clicks DESC LIMIT 500`,
  ];

  const records = [];
  for (const query of queries) {
    const rows = await queryGoogleAdsReport(userId, customerId, query);
    for (const row of rows) {
      const normalized = normalizeGoogleAdsRow(row, query.includes('ad_group') ? 'adGroup' : query.includes('keyword') ? 'keyword' : 'campaign');
      if (!normalized.customerId) {
        normalized.customerId = normalizeCustomerId(customerId);
      }
      records.push(normalized);
    }
  }

  const unique = new Map();
  for (const record of records) {
    const key = [
      integration.id,
      record.date,
      record.customerId,
      record.campaignId,
      record.campaignName,
      record.adGroupId,
      record.adGroupName,
      record.keywordId,
      record.keywordText,
      record.matchType,
    ].join('::');

    if (!unique.has(key)) {
      unique.set(key, record);
    }
  }

  for (const record of unique.values()) {
    await prisma.googleAdsPerformance.upsert({
      where: {
        integrationId_date_customerId_campaignId_adGroupId_keywordId_keywordText_matchType: {
          integrationId: integration.id,
          date: record.date,
          customerId: record.customerId,
          campaignId: record.campaignId || '',
          adGroupId: record.adGroupId || '',
          keywordId: record.keywordId || '',
          keywordText: record.keywordText || '',
          matchType: record.matchType || '',
        },
      },
      update: {
        campaignName: record.campaignName || '',
        campaignStatus: record.campaignStatus || '',
        adGroupName: record.adGroupName || '',
        impressions: safeNumber(record.impressions, 0),
        clicks: safeNumber(record.clicks, 0),
        costMicros: safeNumber(record.costMicros, 0),
        conversions: safeNumber(record.conversions, 0),
        conversionsValue: safeNumber(record.conversionsValue, 0),
        ctr: safeNumber(record.ctr, 0),
        averageCpc: safeNumber(record.averageCpc, 0),
        updatedAt: new Date(),
      },
      create: {
        integrationId: integration.id,
        customerId: record.customerId,
        date: record.date,
        campaignId: record.campaignId || '',
        campaignName: record.campaignName || '',
        campaignStatus: record.campaignStatus || '',
        adGroupId: record.adGroupId || '',
        adGroupName: record.adGroupName || '',
        keywordId: record.keywordId || '',
        keywordText: record.keywordText || '',
        matchType: record.matchType || '',
        impressions: safeNumber(record.impressions, 0),
        clicks: safeNumber(record.clicks, 0),
        costMicros: safeNumber(record.costMicros, 0),
        conversions: safeNumber(record.conversions, 0),
        conversionsValue: safeNumber(record.conversionsValue, 0),
        ctr: safeNumber(record.ctr, 0),
        averageCpc: safeNumber(record.averageCpc, 0),
      },
    });
  }

  await prisma.googleAdsIntegration.update({
    where: { id: integration.id },
    data: { lastSyncAt: new Date(), status: 'active' },
  });

  await prisma.userConnector.updateMany({
    where: { userId, connectorId: 'ads' },
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

async function getAdsOverview(userId, startDate, endDate) {
  const integration = await prisma.googleAdsIntegration.findFirst({ where: { userId } });
  if (!integration) {
    return { spend: 0, impressions: 0, clicks: 0, ctr: 0, averageCpc: 0, conversions: 0, conversionValue: 0, cpa: 0, roas: 0, previousPeriod: { spend: 0, impressions: 0, clicks: 0, ctr: 0, averageCpc: 0, conversions: 0, conversionValue: 0, cpa: 0, roas: 0 }, changes: { spend: 0, impressions: 0, clicks: 0, ctr: 0, averageCpc: 0, conversions: 0, conversionValue: 0, cpa: 0, roas: 0 } };
  }

  const rows = await prisma.googleAdsPerformance.findMany({
    where: { integrationId: integration.id, date: { gte: startDate, lte: endDate } },
  });
  const current = buildOverviewSummary(rows);

  const previousStart = new Date(startDate);
  previousStart.setDate(previousStart.getDate() - 90);
  const previousEnd = new Date(endDate);
  previousEnd.setDate(previousEnd.getDate() - 90);

  const previousRows = await prisma.googleAdsPerformance.findMany({
    where: {
      integrationId: integration.id,
      date: {
        gte: previousStart.toISOString().slice(0, 10),
        lte: previousEnd.toISOString().slice(0, 10),
      },
    },
  });
  const previous = buildOverviewSummary(previousRows);

  const changes = {
    spend: previous.spend === 0 ? (current.spend > 0 ? 100 : 0) : ((current.spend - previous.spend) / previous.spend) * 100,
    impressions: previous.impressions === 0 ? (current.impressions > 0 ? 100 : 0) : ((current.impressions - previous.impressions) / previous.impressions) * 100,
    clicks: previous.clicks === 0 ? (current.clicks > 0 ? 100 : 0) : ((current.clicks - previous.clicks) / previous.clicks) * 100,
    ctr: previous.ctr === 0 ? (current.ctr > 0 ? 100 : 0) : ((current.ctr - previous.ctr) / previous.ctr) * 100,
    averageCpc: previous.averageCpc === 0 ? (current.averageCpc > 0 ? 100 : 0) : ((current.averageCpc - previous.averageCpc) / previous.averageCpc) * 100,
    conversions: previous.conversions === 0 ? (current.conversions > 0 ? 100 : 0) : ((current.conversions - previous.conversions) / previous.conversions) * 100,
    conversionValue: previous.conversionValue === 0 ? (current.conversionValue > 0 ? 100 : 0) : ((current.conversionValue - previous.conversionValue) / previous.conversionValue) * 100,
    cpa: previous.cpa === 0 ? (current.cpa > 0 ? 100 : 0) : ((current.cpa - previous.cpa) / previous.cpa) * 100,
    roas: previous.roas === 0 ? (current.roas > 0 ? 100 : 0) : ((current.roas - previous.roas) / previous.roas) * 100,
  };

  return {
    ...current,
    previousPeriod: previous,
    changes,
  };
}

async function getAdsCampaigns(userId, startDate, endDate, search = '', limit = 20, page = 1) {
  const integration = await prisma.googleAdsIntegration.findFirst({ where: { userId } });
  if (!integration) return [];

  const rows = await prisma.googleAdsPerformance.findMany({
    where: {
      integrationId: integration.id,
      date: { gte: startDate, lte: endDate },
      campaignName: search ? { contains: search, mode: 'insensitive' } : undefined,
      campaignId: { not: '' },
    },
    orderBy: { costMicros: 'desc' },
  });

  const grouped = rows.reduce((acc, row) => {
    const key = row.campaignId || row.campaignName;
    if (!acc[key]) {
      acc[key] = {
        campaignId: row.campaignId,
        campaignName: row.campaignName,
        campaignStatus: row.campaignStatus,
        impressions: 0,
        clicks: 0,
        costMicros: 0,
        conversions: 0,
        conversionsValue: 0,
      };
    }

    acc[key].impressions += safeNumber(row.impressions, 0);
    acc[key].clicks += safeNumber(row.clicks, 0);
    acc[key].costMicros += safeNumber(row.costMicros, 0);
    acc[key].conversions += safeNumber(row.conversions, 0);
    acc[key].conversionsValue += safeNumber(row.conversionsValue, 0);
    return acc;
  }, {});

  return Object.values(grouped)
    .map((row) => ({
      campaignId: row.campaignId,
      campaignName: row.campaignName,
      campaignStatus: row.campaignStatus,
      impressions: row.impressions,
      clicks: row.clicks,
      cost: row.costMicros / 1000000,
      ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
      averageCpc: row.clicks > 0 ? (row.costMicros / 1000000) / row.clicks : 0,
      conversions: row.conversions,
      conversionValue: row.conversionsValue,
      cpa: row.conversions > 0 ? (row.costMicros / 1000000) / row.conversions : 0,
      roas: row.costMicros > 0 ? row.conversionsValue / (row.costMicros / 1000000) : 0,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice((page - 1) * limit, page * limit);
}

async function getAdsAdGroups(userId, startDate, endDate, search = '', limit = 20, page = 1) {
  const integration = await prisma.googleAdsIntegration.findFirst({ where: { userId } });
  if (!integration) return [];

  const rows = await prisma.googleAdsPerformance.findMany({
    where: {
      integrationId: integration.id,
      date: { gte: startDate, lte: endDate },
      adGroupName: search ? { contains: search, mode: 'insensitive' } : undefined,
      adGroupId: { not: '' },
    },
    orderBy: { costMicros: 'desc' },
  });

  const grouped = rows.reduce((acc, row) => {
    const key = row.adGroupId || row.adGroupName;
    if (!acc[key]) {
      acc[key] = {
        campaignName: row.campaignName,
        adGroupName: row.adGroupName,
        impressions: 0,
        clicks: 0,
        costMicros: 0,
        conversions: 0,
        conversionsValue: 0,
      };
    }

    acc[key].impressions += safeNumber(row.impressions, 0);
    acc[key].clicks += safeNumber(row.clicks, 0);
    acc[key].costMicros += safeNumber(row.costMicros, 0);
    acc[key].conversions += safeNumber(row.conversions, 0);
    acc[key].conversionsValue += safeNumber(row.conversionsValue, 0);
    return acc;
  }, {});

  return Object.values(grouped)
    .map((row) => ({
      campaign: row.campaignName,
      adGroup: row.adGroupName,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
      cost: row.costMicros / 1000000,
      cpc: row.clicks > 0 ? (row.costMicros / 1000000) / row.clicks : 0,
      conversions: row.conversions,
      conversionValue: row.conversionsValue,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice((page - 1) * limit, page * limit);
}

async function getAdsKeywords(userId, startDate, endDate, search = '', limit = 20, page = 1) {
  const integration = await prisma.googleAdsIntegration.findFirst({ where: { userId } });
  if (!integration) return [];

  const rows = await prisma.googleAdsPerformance.findMany({
    where: {
      integrationId: integration.id,
      date: { gte: startDate, lte: endDate },
      keywordText: search ? { contains: search, mode: 'insensitive' } : undefined,
      keywordId: { not: '' },
    },
    orderBy: { costMicros: 'desc' },
  });

  const grouped = rows.reduce((acc, row) => {
    const key = `${row.keywordText}-${row.matchType}-${row.campaignName}`;
    if (!acc[key]) {
      acc[key] = {
        campaign: row.campaignName,
        adGroup: row.adGroupName,
        keyword: row.keywordText,
        matchType: row.matchType,
        impressions: 0,
        clicks: 0,
        costMicros: 0,
        conversions: 0,
        conversionsValue: 0,
      };
    }

    acc[key].impressions += safeNumber(row.impressions, 0);
    acc[key].clicks += safeNumber(row.clicks, 0);
    acc[key].costMicros += safeNumber(row.costMicros, 0);
    acc[key].conversions += safeNumber(row.conversions, 0);
    acc[key].conversionsValue += safeNumber(row.conversionsValue, 0);
    return acc;
  }, {});

  return Object.values(grouped)
    .map((row) => ({
      campaign: row.campaign,
      adGroup: row.adGroup,
      keyword: row.keyword,
      matchType: row.matchType,
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
      cost: row.costMicros / 1000000,
      cpc: row.clicks > 0 ? (row.costMicros / 1000000) / row.clicks : 0,
      conversions: row.conversions,
      conversionValue: row.conversionsValue,
    }))
    .sort((a, b) => b.cost - a.cost)
    .slice((page - 1) * limit, page * limit);
}

module.exports = {
  ADS_SCOPE,
  normalizeCustomerId,
  buildGoogleAdsConnectUrl,
  exchangeGoogleCode,
  ensureGoogleConnector,
  getValidGoogleAccessToken,
  getUserConnector,
  listAccessibleCustomers,
  verifyCustomerAccess,
  normalizeGoogleAdsRow,
  buildOverviewSummary,
  buildGoogleAdsContext,
  queryGoogleAdsReport,
  syncGoogleAds,
  getAdsOverview,
  getAdsCampaigns,
  getAdsAdGroups,
  getAdsKeywords,
};
