const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const prisma = require('../utils/prismaClient');
const {
  GSC_SCOPE,
  buildGoogleConnectUrl,
  exchangeGoogleCode,
  ensureGoogleConnector,
  listAccessibleSites,
  verifyPropertyAccess,
  syncGoogleSearchConsole,
  getGscOverview,
  getGscRecordsByGroup,
  normalizeSiteUrl,
  matchWebsiteAnalysisDomain,
} = require('../services/googleSearchConsoleService');
const {
  GA4_SCOPE,
  buildGoogleConnectUrl: buildGa4ConnectUrl,
  exchangeGoogleCode: exchangeGa4Code,
  ensureGoogleConnector: ensureGa4Connector,
  listAccessibleProperties,
  verifyPropertyAccess: verifyGa4PropertyAccess,
  syncGoogleAnalytics,
  getGa4Overview,
  getGa4Acquisition,
  getGa4LandingPages,
  getGa4Events,
} = require('../services/googleAnalyticsService');
const {
  ADS_SCOPE,
  buildGoogleAdsConnectUrl,
  exchangeGoogleCode: exchangeAdsCode,
  ensureGoogleConnector: ensureAdsConnector,
  listAccessibleCustomers,
  verifyCustomerAccess,
  syncGoogleAds,
  getAdsOverview,
  getAdsCampaigns,
  getAdsAdGroups,
  getAdsKeywords,
} = require('../services/googleAdsService');

router.get('/gsc/connect', authMiddleware, async (req, res, next) => {
  try {
    const url = buildGoogleConnectUrl();
    return res.status(200).json({
      success: true,
      data: { authUrl: url, scope: GSC_SCOPE },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/gsc/oauth/callback', authMiddleware, async (req, res, next) => {
  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    const tokenData = await exchangeGoogleCode(code);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authenticated user is required' });
    }

    const connector = await ensureGoogleConnector(userId, {
      accountName: tokenData.googleEmail || 'Google Account',
      config: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiryDate: tokenData.expiryDate,
        scope: tokenData.scope,
        googleAccountId: tokenData.googleAccountId,
      },
    });

    await prisma.googleSearchConsoleIntegration.upsert({
      where: {
        id: connector.id,
      },
      update: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: tokenData.expiryDate ? new Date(Number(tokenData.expiryDate)) : null,
        scope: tokenData.scope,
        status: 'active',
      },
      create: {
        id: connector.id,
        userId,
        connectorId: 'gsc',
        siteUrl: 'https://example.com',
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: tokenData.expiryDate ? new Date(Number(tokenData.expiryDate)) : null,
        scope: tokenData.scope,
        status: 'active',
      },
    });

    return res.status(200).json({ success: true, message: 'Google Search Console connected' });
  } catch (error) {
    return next(error);
  }
});

router.get('/gsc/sites', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sites = await listAccessibleSites(userId);
    return res.status(200).json({ success: true, data: sites });
  } catch (error) {
    return next(error);
  }
});

router.post('/gsc/select', authMiddleware, async (req, res, next) => {
  try {
    const { siteUrl } = req.body || {};
    const userId = req.user.id;
    const normalized = normalizeSiteUrl(siteUrl);

    if (!normalized) {
      return res.status(400).json({ success: false, message: 'siteUrl is required' });
    }

    const canAccess = await verifyPropertyAccess(userId, normalized);
    if (!canAccess) {
      return res.status(403).json({ success: false, message: 'Google account does not have access to this property' });
    }

    const connector = await prisma.userConnector.findFirst({
      where: { userId, connectorId: 'gsc' },
    });

    const integration = await prisma.googleSearchConsoleIntegration.upsert({
      where: {
        id: connector?.id ? connector.config?.integrationId || connector.id : 'placeholder-gsc',
      },
      update: {
        siteUrl: normalized,
        status: 'active',
      },
      create: {
        userId,
        connectorId: 'gsc',
        siteUrl: normalized,
        status: 'active',
      },
    });

    await prisma.userConnector.updateMany({
      where: { userId, connectorId: 'gsc' },
      data: { connected: true, accountName: normalized, status: 'active' },
    });

    return res.status(200).json({ success: true, data: { siteUrl: normalized, integrationId: integration.id } });
  } catch (error) {
    return next(error);
  }
});

router.post('/gsc/sync', authMiddleware, async (req, res, next) => {
  try {
    const result = await syncGoogleSearchConsole(req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/gsc/overview', authMiddleware, async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const endDate = req.query.endDate || new Date().toISOString().slice(0, 10);
    const summary = await getGscOverview(req.user.id, startDate, endDate);
    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    return next(error);
  }
});

router.get('/gsc/queries', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getGscRecordsByGroup(req.user.id, 'query', {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      search: req.query.search,
      limit: Number(req.query.limit || 25),
    });
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/gsc/pages', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getGscRecordsByGroup(req.user.id, 'page', {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: Number(req.query.limit || 25),
    });
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/gsc/opportunities', authMiddleware, async (req, res, next) => {
  try {
    const integration = await prisma.googleSearchConsoleIntegration.findFirst({ where: { userId: req.user.id } });
    let rows = [];
    if (integration) {
      rows = await prisma.googleSearchConsoleRecord.findMany({
        where: { integrationId: integration.id },
        orderBy: { createdAt: 'desc' },
        take: 500,
      });
    }

    const summary = require('../services/googleSearchConsoleService').detectOpportunities(rows);
    return res.status(200).json({ success: true, data: summary });
  } catch (error) {
    return next(error);
  }
});

router.get('/gsc/status', authMiddleware, async (req, res) => {
  const integration = await prisma.googleSearchConsoleIntegration.findFirst({ where: { userId: req.user.id } });
  const connector = await prisma.userConnector.findFirst({ where: { userId: req.user.id, connectorId: 'gsc' } });

  return res.status(200).json({
    success: true,
    data: {
      connected: Boolean(integration || connector?.connected),
      siteUrl: integration?.siteUrl || connector?.accountName || null,
      lastSyncAt: integration?.lastSyncAt || connector?.lastSyncedAt || null,
      status: integration?.status || connector?.status || 'inactive',
      scope: GSC_SCOPE,
    },
  });
});

router.get('/gsc/website-match', authMiddleware, async (req, res, next) => {
  try {
    const { domain } = req.query;
    const integration = await prisma.googleSearchConsoleIntegration.findFirst({ where: { userId: req.user.id } });
    if (!integration) return res.status(200).json({ success: true, data: { match: false } });

    return res.status(200).json({
      success: true,
      data: { match: matchWebsiteAnalysisDomain(integration.siteUrl, domain) },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/connect', authMiddleware, async (req, res, next) => {
  try {
    const url = buildGa4ConnectUrl();
    return res.status(200).json({
      success: true,
      data: { authUrl: url, scope: GA4_SCOPE },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/ga4/oauth/callback', authMiddleware, async (req, res, next) => {
  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    const tokenData = await exchangeGa4Code(code);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authenticated user is required' });
    }

    const connector = await ensureGa4Connector(userId, {
      accountName: tokenData.googleEmail || 'Google Account',
      config: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiryDate: tokenData.expiryDate,
        scope: tokenData.scope,
        googleAccountId: tokenData.googleAccountId,
      },
    });

    await prisma.googleAnalyticsIntegration.upsert({
      where: { id: connector.id },
      update: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: tokenData.expiryDate ? new Date(Number(tokenData.expiryDate)) : null,
        scope: tokenData.scope,
        status: 'active',
      },
      create: {
        id: connector.id,
        userId,
        connectorId: 'ga4',
        propertyId: 'pending',
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: tokenData.expiryDate ? new Date(Number(tokenData.expiryDate)) : null,
        scope: tokenData.scope,
        status: 'active',
      },
    });

    return res.status(200).json({ success: true, message: 'Google Analytics 4 connected' });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/properties', authMiddleware, async (req, res, next) => {
  try {
    const properties = await listAccessibleProperties(req.user.id);
    return res.status(200).json({ success: true, data: properties });
  } catch (error) {
    return next(error);
  }
});

router.post('/ga4/select', authMiddleware, async (req, res, next) => {
  try {
    const { propertyId } = req.body || {};
    const userId = req.user.id;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'propertyId is required' });
    }

    const connector = await prisma.userConnector.findFirst({ where: { userId, connectorId: 'ga4' } });
    if (!connector || !connector.connected) {
      return res.status(403).json({ success: false, message: 'Google Analytics 4 is not connected for this user' });
    }

    const accessible = await verifyGa4PropertyAccess(userId, propertyId);
    if (!accessible) {
      return res.status(403).json({ success: false, message: 'Property is not accessible to the authenticated Google account' });
    }

    const integration = await prisma.googleAnalyticsIntegration.upsert({
      where: {
        id: connector.id,
      },
      update: {
        propertyId: String(propertyId),
        status: 'active',
      },
      create: {
        id: connector.id,
        userId,
        connectorId: 'ga4',
        propertyId: String(propertyId),
        status: 'active',
      },
    });

    await prisma.userConnector.updateMany({
      where: { userId, connectorId: 'ga4' },
      data: { connected: true, accountName: `GA4:${String(propertyId)}`, status: 'active' },
    });

    return res.status(200).json({ success: true, data: { propertyId: integration.propertyId, integrationId: integration.id } });
  } catch (error) {
    return next(error);
  }
});

router.post('/ga4/sync', authMiddleware, async (req, res, next) => {
  try {
    const result = await syncGoogleAnalytics(req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/overview', authMiddleware, async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const endDate = req.query.endDate || new Date().toISOString().slice(0, 10);
    const data = await getGa4Overview(req.user.id, startDate, endDate);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/acquisition', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getGa4Acquisition(req.user.id, req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), req.query.endDate || new Date().toISOString().slice(0, 10), Number(req.query.limit || 20));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/landing-pages', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getGa4LandingPages(req.user.id, req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), req.query.endDate || new Date().toISOString().slice(0, 10), Number(req.query.limit || 20));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/events', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getGa4Events(req.user.id, req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), req.query.endDate || new Date().toISOString().slice(0, 10), Number(req.query.limit || 20));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/ga4/status', authMiddleware, async (req, res) => {
  const integration = await prisma.googleAnalyticsIntegration.findFirst({ where: { userId: req.user.id } });
  const connector = await prisma.userConnector.findFirst({ where: { userId: req.user.id, connectorId: 'ga4' } });

  return res.status(200).json({
    success: true,
    data: {
      connected: Boolean(integration || connector?.connected),
      propertyId: integration?.propertyId || connector?.accountName?.replace('GA4:', '') || null,
      lastSyncAt: integration?.lastSyncAt || connector?.lastSyncedAt || null,
      status: integration?.status || connector?.status || 'inactive',
      scope: GA4_SCOPE,
    },
  });
});

router.get('/ads/connect', authMiddleware, async (req, res, next) => {
  try {
    const url = buildGoogleAdsConnectUrl();
    return res.status(200).json({
      success: true,
      data: { authUrl: url, scope: ADS_SCOPE },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/ads/oauth/callback', authMiddleware, async (req, res, next) => {
  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required' });
    }

    const tokenData = await exchangeAdsCode(code);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authenticated user is required' });
    }

    const connector = await ensureAdsConnector(userId, {
      accountName: tokenData.googleEmail || 'Google Ads Account',
      config: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiryDate: tokenData.expiryDate,
        scope: tokenData.scope,
        googleAccountId: tokenData.googleAccountId,
      },
    });

    await prisma.googleAdsIntegration.upsert({
      where: { id: connector.id },
      update: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: tokenData.expiryDate ? new Date(Number(tokenData.expiryDate)) : null,
        scope: tokenData.scope,
        status: 'active',
      },
      create: {
        id: connector.id,
        userId,
        connectorId: 'ads',
        customerId: 'pending',
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        tokenExpiresAt: tokenData.expiryDate ? new Date(Number(tokenData.expiryDate)) : null,
        scope: tokenData.scope,
        status: 'active',
      },
    });

    return res.status(200).json({ success: true, message: 'Google Ads connected' });
  } catch (error) {
    return next(error);
  }
});

router.get('/ads/customers', authMiddleware, async (req, res, next) => {
  try {
    const customers = await listAccessibleCustomers(req.user.id);
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    return next(error);
  }
});

router.post('/ads/select', authMiddleware, async (req, res, next) => {
  try {
    const { customerId } = req.body || {};
    const userId = req.user.id;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'customerId is required' });
    }

    const connector = await prisma.userConnector.findFirst({ where: { userId, connectorId: 'ads' } });
    if (!connector || !connector.connected) {
      return res.status(403).json({ success: false, message: 'Google Ads is not connected for this user' });
    }

    const normalized = String(customerId).replace(/[^0-9]/g, '');
    const accessible = await verifyCustomerAccess(userId, normalized);
    if (!accessible) {
      return res.status(403).json({ success: false, message: 'Customer is not accessible to the authenticated Google account' });
    }

    const integration = await prisma.googleAdsIntegration.upsert({
      where: { id: connector.id },
      update: {
        customerId: normalized,
        status: 'active',
      },
      create: {
        id: connector.id,
        userId,
        connectorId: 'ads',
        customerId: normalized,
        status: 'active',
      },
    });

    await prisma.userConnector.updateMany({
      where: { userId, connectorId: 'ads' },
      data: { connected: true, accountName: `Ads:${normalized}`, status: 'active' },
    });

    return res.status(200).json({ success: true, data: { customerId: integration.customerId, integrationId: integration.id } });
  } catch (error) {
    return next(error);
  }
});

router.post('/ads/sync', authMiddleware, async (req, res, next) => {
  try {
    const result = await syncGoogleAds(req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
});

router.get('/ads/overview', authMiddleware, async (req, res, next) => {
  try {
    const startDate = req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const endDate = req.query.endDate || new Date().toISOString().slice(0, 10);
    const data = await getAdsOverview(req.user.id, startDate, endDate);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return next(error);
  }
});

router.get('/ads/campaigns', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getAdsCampaigns(req.user.id, req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), req.query.endDate || new Date().toISOString().slice(0, 10), req.query.search || '', Number(req.query.limit || 20), Number(req.query.page || 1));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/ads/ad-groups', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getAdsAdGroups(req.user.id, req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), req.query.endDate || new Date().toISOString().slice(0, 10), req.query.search || '', Number(req.query.limit || 20), Number(req.query.page || 1));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/ads/keywords', authMiddleware, async (req, res, next) => {
  try {
    const rows = await getAdsKeywords(req.user.id, req.query.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), req.query.endDate || new Date().toISOString().slice(0, 10), req.query.search || '', Number(req.query.limit || 20), Number(req.query.page || 1));
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
});

router.get('/ads/status', authMiddleware, async (req, res) => {
  const integration = await prisma.googleAdsIntegration.findFirst({ where: { userId: req.user.id } });
  const connector = await prisma.userConnector.findFirst({ where: { userId: req.user.id, connectorId: 'ads' } });

  return res.status(200).json({
    success: true,
    data: {
      connected: Boolean(integration || connector?.connected),
      customerId: integration?.customerId || connector?.accountName?.replace('Ads:', '') || null,
      lastSyncAt: integration?.lastSyncAt || connector?.lastSyncedAt || null,
      status: integration?.status || connector?.status || 'inactive',
      scope: ADS_SCOPE,
    },
  });
});

module.exports = router;
