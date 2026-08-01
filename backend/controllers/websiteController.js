const prisma = require('../utils/prismaClient');
const websiteOrchestrator = require('../services/websiteOrchestrator');

const websiteController = {
  // Get all website analyses
  getAllAnalyses: async (req, res, next) => {
    try {
      const userId = req.user?.id || req.query.userId || req.headers['x-user-id'];
      const where = userId ? { userId } : {};

      const analyses = await prisma.websiteAnalysis.findMany({
        where,
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
      const userIdFromReq = req.user?.id || userId || req.headers['x-user-id'];
      let defaultUserId = userIdFromReq;

      if (!defaultUserId) {
        defaultUserId = (await prisma.user.findFirst())?.id;
      }

      if (!defaultUserId) {
        const newUser = await prisma.user.create({
          data: {
            email: `user_${Date.now()}@brandsutra.ai`,
            name: 'Marketing Lead',
          }
        });
        defaultUserId = newUser.id;
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
          healthScore: null,
        },
        include: {
          technicalOverview: true,
          pageInventory: true,
        },
      });

      // Trigger website audit asynchronously with DeepSeek
      websiteOrchestrator.runWebsiteAuditPipeline(newAnalysis.id).catch((err) => {
        console.error(`Error in async website audit for ${newAnalysis.id}:`, err);
      });

      return res.status(201).json({ success: true, data: newAnalysis });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = websiteController;