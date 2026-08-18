const prisma = require('../utils/prismaClient');
const marketingOrchestrator = require('../services/marketingOrchestrator');

const marketingController = {
  // Get all marketing runs
  getAllRuns: async (req, res, next) => {
    try {
      const userId = req.user?.id || req.query.userId || req.headers['x-user-id'];
      const where = userId ? { userId } : {};

      const runs = await prisma.marketingRun.findMany({
        where,
        include: {
          agentExecutions: { orderBy: { stepNumber: 'asc' } },
          logs: { orderBy: { timestamp: 'asc' } },
          trendData: true,
          researchData: true,
          competitiveData: true,
          contextMergerData: true,
          strategyData: true,
          planningData: true,
          seoData: true,
          assets: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ success: true, count: runs.length, data: runs });
    } catch (error) {
      return next(error);
    }
  },

  // Get single run by ID
  getRunById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const run = await prisma.marketingRun.findUnique({
        where: { id },
        include: {
          agentExecutions: { orderBy: { stepNumber: 'asc' } },
          logs: { orderBy: { timestamp: 'asc' } },
          trendData: true,
          researchData: true,
          competitiveData: true,
          contextMergerData: true,
          strategyData: true,
          planningData: true,
          seoData: true,
          assets: true,
        },
      });

      if (!run) {
        return res.status(404).json({ success: false, message: 'Marketing run not found' });
      }

      return res.status(200).json({ success: true, data: run });
    } catch (error) {
      return next(error);
    }
  },

  // Create new marketing run
  createRun: async (req, res, next) => {
    try {
      const { topic, industry, targetAudience, triggerMode, userId, rssTriggerUrl, contentTypes } = req.body;

      const runId = `run-${Date.now()}`;
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

      const newRun = await prisma.marketingRun.create({
        data: {
          id: runId,
          userId: defaultUserId,
          topic: topic || 'New AI Marketing Campaign',
          industry: industry || 'Enterprise SaaS',
          targetAudience: targetAudience || 'Decision Makers',
          triggerMode: triggerMode || 'MANUAL',
          rssTriggerUrl,
          status: 'PENDING',
          overallProgress: 0,
          agentExecutions: {
            create: [
              { agentId: 'supervisor', agentName: 'Agent 01: Marketing Supervisor', agentRole: 'Orchestrator', stepNumber: 1, status: 'PENDING' },
              { agentId: 'trend', agentName: 'Agent 02: Trend Identification', agentRole: 'Trend Miner', stepNumber: 2, status: 'PENDING' },
              { agentId: 'research', agentName: 'Agent 03: Research Agent', agentRole: 'Deep Context Synthesizer', stepNumber: 3, status: 'PENDING' },
              { agentId: 'competitive', agentName: 'Agent 04: Competitive Intelligence', agentRole: 'Positioning Evaluator', stepNumber: 4, status: 'PENDING' },
              { agentId: 'context', agentName: 'Agent 05: Context Merger', agentRole: 'Master Brief Synthesizer', stepNumber: 5, status: 'PENDING' },
              { agentId: 'strategy', agentName: 'Agent 06: Content Strategy', agentRole: 'Distribution Architect', stepNumber: 6, status: 'PENDING' },
              { agentId: 'planning', agentName: 'Agent 07: Content Planning', agentRole: 'Editorial Scheduler', stepNumber: 7, status: 'PENDING' },
              { agentId: 'seo', agentName: 'Agent 08: SEO Agent', agentRole: 'SERP & Keyword Architect', stepNumber: 8, status: 'PENDING' },
              { agentId: 'generator', agentName: 'Agent 09: Content Generation', agentRole: 'Multi-Format Asset Generator', stepNumber: 9, status: 'PENDING' },
              { agentId: 'creative', agentName: 'Agent 10: Creative Generation', agentRole: 'Visual & Diagram Producer', stepNumber: 10, status: 'PENDING' },
            ],
          },
          logs: {
            create: [
              {
                logMessage: triggerMode === 'RSS_TRIGGERED'
                  ? `Marketing run created from RSS source ${rssTriggerUrl || 'unknown'}.`
                  : `Marketing run created for topic '${topic}'.`,
                logLevel: 'info'
              },
            ],
          },
        },
        include: {
          agentExecutions: true,
          logs: true,
        },
      });

      // Trigger pipeline asynchronously with DeepSeek and preserve user-selected content types
      marketingOrchestrator.runMarketingPipeline(newRun.id, contentTypes).catch((err) => {
        console.error(`Error in async marketing pipeline for ${newRun.id}:`, err);
      });

      return res.status(201).json({ success: true, data: newRun });
    } catch (error) {
      return next(error);
    }
  },

  // Update asset approval status
  updateAssetStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, revisionNotes } = req.body; // PENDING, APPROVED, CHANGES_REQUESTED, REJECTED, PUBLISHED

      const updatedAsset = await prisma.marketingAsset.update({
        where: { id },
        data: {
          status: status || 'APPROVED',
          revisionNotes,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({ success: true, data: updatedAsset });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = marketingController;