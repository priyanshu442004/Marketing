const prisma = require('../utils/prismaClient');

const websiteController = {
  // Get all website analyses
  getAllAnalyses: async (req, res, next) => {
    try {
      const analyses = await prisma.websiteAnalysis.findMany({
        include: {
          technicalOverview: true,
          pageInventory: true,
          navigationHierarchy: true,
          gapAnalysis: true,
          scoreCategories: true,
          recommendations: true,
          roadmapItems: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ success: true, count: analyses.length, data: analyses });
    } catch (error) {
      return next(error);
    }
  },

  // Get single analysis by ID
  getAnalysisById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const analysis = await prisma.websiteAnalysis.findUnique({
        where: { id },
        include: {
          technicalOverview: true,
          pageInventory: true,
          navigationHierarchy: true,
          gapAnalysis: true,
          scoreCategories: true,
          recommendations: true,
          roadmapItems: true,
        },
      });

      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Website analysis not found' });
      }

      return res.status(200).json({ success: true, data: analysis });
    } catch (error) {
      return next(error);
    }
  },

  // Create new website analysis
  createAnalysis: async (req, res, next) => {
    try {
      const { url, companyName, overview, industry, targetAudience, products, services, goals, userId } = req.body;

      const analysisId = `ana-${Date.now()}`;
      const defaultUserId = userId || (await prisma.user.findFirst())?.id;

      if (!defaultUserId) {
        return res.status(400).json({ success: false, message: 'No user ID available for analysis creation' });
      }

      const domain = url ? url.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : 'example.com';

      const newAnalysis = await prisma.websiteAnalysis.create({
        data: {
          id: analysisId,
          userId: defaultUserId,
          url: url || 'https://example.com',
          domain,
          companyName: companyName || domain.split('.')[0].toUpperCase(),
          overview: overview || '',
          industry: industry || 'Enterprise SaaS',
          targetAudience: targetAudience || 'Decision Makers',
          products: products || [],
          services: services || [],
          goals: goals || ['Increase Conversion', 'SEO Growth'],
          status: 'ANALYZING',
          healthScore: 0,
          technicalOverview: {
            create: {
              pagesDiscovered: 12,
              maxDepth: 3,
              sitemapFound: 'Yes (sitemap.xml)',
              avgLoadTime: '1.2s',
            },
          },
          pageInventory: {
            create: [
              { path: '/', pageType: 'Homepage', title: `${companyName || domain} | Home`, wordCount: 850, internalLinks: 24, status: '200 OK' },
              { path: '/pricing', pageType: 'Pricing', title: `Pricing & Plans`, wordCount: 520, internalLinks: 12, status: '200 OK' },
            ],
          },
        },
        include: {
          technicalOverview: true,
          pageInventory: true,
        },
      });

      return res.status(201).json({ success: true, data: newAnalysis });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = websiteController;