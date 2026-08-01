const prisma = require('../utils/prismaClient');
const aiProvider = require('./aiProvider');
const SYSTEM_PROMPTS = {
  supervisor: `You are the Marketing Supervisor Agent — the orchestrator and quality gate of the AI Marketing pipeline. Analyze the topic, industry, and inputs to create the run execution strategy. Return JSON: {"summary": "string"}`,
  trendIdentification: `You are the Trend Identification Agent. Analyze current search trends, keywords, hashtags, and questions. Return JSON with: {"totalKeywords": 25, "avgVolume": "14.2K", "topRising": "AI Workflows", "seasonalCallout": "string", "keywords": [{"keyword": "string", "volume": "string", "trend": "up", "difficulty": "Medium", "intent": "Informational"}], "hashtags": ["#marketing"], "questions": ["string"]}`,
  research: `You are the Research Agent. Conduct market research on the topic/industry. Return JSON: {"brief": "string", "painPoints": [{"title": "string", "description": "string"}], "technologies": [{"name": "string", "desc": "string"}], "news": [{"headline": "string", "source": "string", "date": "2026-08-01", "url": "https://example.com"}]}`,
  competitiveIntelligence: `You are the Competitive Intelligence Agent. Analyze competitors and positioning gaps. Return JSON: {"competitors": [{"name": "string", "positioning": "string", "strengths": "string", "cadence": "string", "seoFocus": "string"}], "gaps": ["string"], "angles": [{"title": "string", "desc": "string"}]}`,
  contextMerger: `You are the Context Merger Agent. Consolidate research into a unified brief. Return JSON: {"masterTitle": "string", "takeaways": ["string"], "thesis": "string"}`,
  contentStrategy: `You are the Content Strategy Agent. Formulate content strategy for formats (Blog, LinkedIn, Newsletter, Email, Ads, Visuals). Return JSON: {"selectedTypes": ["Blog Post", "LinkedIn Post", "Email Sequence", "Ad Variants", "Architecture Diagram"], "objective": "string", "targetAudience": "string", "communicationStyle": "string", "channels": [{"channel": "LinkedIn", "format": "Post", "frequency": "Daily"}]}`,
  contentPlanning: `You are the Content Planning Agent. Create a publishing timeline. Return JSON: {"schedule": [{"title": "string", "channel": "string", "scheduledDate": "2026-08-05", "scheduledTime": "10:00 AM"}]}`,
  seo: `You are the SEO Agent. Formulate SEO plan and SERP preview. Return JSON: {"keywords": [{"keyword": "string", "intent": "Commercial", "volume": "10K", "difficulty": "30/100"}], "serpPreview": {"title": "string", "url": "https://example.com", "description": "string"}, "internalLinks": [{"from": "/a", "to": "/b"}], "faqs": ["string"]}`,
  contentGeneration: `You are the Content Generation Agent. Write publish-ready marketing content. Return JSON: {"blogPost": {"title": "string", "readTime": "5 min read", "content": "Markdown content string"}, "linkedinPosts": [{"type": "Insight", "content": "string"}], "emailSequence": [{"step": 1, "subject": "string", "preview": "string", "body": "string"}], "adVariants": [{"headline": "string", "body": "string"}]}`,
  creativeGeneration: `You are the Creative & Visual Prompt Agent. Generate image and video prompts. Return JSON: {"imagePrompts": [{"purpose": "Blog Hero", "prompt": "string", "negativePrompt": "string", "aspectRatio": "16:9", "style": "Photorealistic"}], "videoPrompts": [{"concept": "string", "duration": "30s", "aspectRatio": "9:16", "style": "Motion Graphics", "scenes": [{"scene": 1, "visualPrompt": "string", "camera": "Pan right", "voiceover": "string"}], "negativePrompt": "string"}], "creativeAssets": [{"title": "Architecture Diagram", "type": "Diagram", "dimensions": "1920x1080 SVG"}]}`
};

async function executeAgent(runId, stepNumber, agentId, agentName, prompt, systemPrompt) {
  try {
    console.log(`[Run ${runId}] Step ${stepNumber}: Executing ${agentName}...`);

    await prisma.marketingRunAgentExecution.updateMany({
      where: { runId, agentId },
      data: { status: 'RUNNING', startedAt: new Date() }
    });

    await prisma.marketingRunLog.create({
      data: {
        runId,
        logMessage: `Agent [${agentName}] started execution.`,
        logLevel: 'info'
      }
    });

    const responseText = await aiProvider.generate(prompt, {
      systemPrompt,
      json: true,
      temperature: 0.7
    });

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.warn(`Failed to parse JSON response for ${agentName}:`, responseText.substring(0, 100));
      data = { rawText: responseText };
    }

    await prisma.marketingRunAgentExecution.updateMany({
      where: { runId, agentId },
      data: {
        status: 'COMPLETED',
        outputSummary: typeof data === 'object' ? JSON.stringify(data).substring(0, 500) : String(data).substring(0, 500),
        completedAt: new Date()
      }
    });

    await prisma.marketingRunLog.create({
      data: {
        runId,
        logMessage: `Agent [${agentName}] completed successfully.`,
        logLevel: 'success'
      }
    });

    return data;
  } catch (error) {
    console.error(`Error executing agent ${agentName}:`, error.message);
    await prisma.marketingRunAgentExecution.updateMany({
      where: { runId, agentId },
      data: { status: 'FAILED', completedAt: new Date() }
    });
    await prisma.marketingRunLog.create({
      data: {
        runId,
        logMessage: `Agent [${agentName}] failed: ${error.message}`,
        logLevel: 'error'
      }
    });
    throw error;
  }
}

async function runMarketingPipeline(runId) {
  try {
    const run = await prisma.marketingRun.findUnique({ where: { id: runId } });
    if (!run) return;

    await prisma.marketingRun.update({
      where: { id: runId },
      data: { status: 'RUNNING', startedAt: new Date(), overallProgress: 5 }
    });

    const contextInput = `Topic: ${run.topic}\nIndustry: ${run.industry}\nTarget Audience: ${run.targetAudience || 'Decision Makers'}\nTrigger Mode: ${run.triggerMode}`;

    // Agent 1: Supervisor
    const supervisorData = await executeAgent(runId, 1, 'supervisor', 'Agent 01: Marketing Supervisor', `Plan marketing run for:\n${contextInput}`, SYSTEM_PROMPTS.supervisor);
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 10, summary: supervisorData.summary || `Multi-agent strategy generated for ${run.topic}` } });

    // Agent 2: Trend Identification
    const trendResult = await executeAgent(runId, 2, 'trend', 'Agent 02: Trend Identification', `Identify trending keywords, hashtags, and questions for:\n${contextInput}`, SYSTEM_PROMPTS.trendIdentification);
    await prisma.trendData.create({
      data: {
        runId,
        totalKeywords: trendResult.totalKeywords || 20,
        avgVolume: trendResult.avgVolume || '15K',
        topRising: trendResult.topRising || `${run.topic} Trends`,
        seasonalCallout: trendResult.seasonalCallout || 'Q3 Focus',
        keywords: trendResult.keywords || [],
        hashtags: trendResult.hashtags || [],
        questions: trendResult.questions || []
      }
    });
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 20 } });

    // Agent 3 & 4 in parallel: Research & Competitive
    const [researchResult, competitiveResult] = await Promise.all([
      executeAgent(runId, 3, 'research', 'Agent 03: Research Agent', `Research pain points, tech, and news for:\n${contextInput}`, SYSTEM_PROMPTS.research),
      executeAgent(runId, 4, 'competitive', 'Agent 04: Competitive Intelligence', `Analyze competitors for:\n${contextInput}`, SYSTEM_PROMPTS.competitiveIntelligence)
    ]);

    await prisma.researchData.create({
      data: {
        runId,
        brief: researchResult.brief || `Deep research brief on ${run.topic}`,
        painPoints: researchResult.painPoints || [],
        technologies: researchResult.technologies || [],
        news: researchResult.news || []
      }
    });

    await prisma.competitiveData.create({
      data: {
        runId,
        competitors: competitiveResult.competitors || [],
        gaps: competitiveResult.gaps || [],
        angles: competitiveResult.angles || []
      }
    });
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 40 } });

    // Agent 5: Context Merger
    const contextMergerResult = await executeAgent(runId, 5, 'context', 'Agent 05: Context Merger', `Consolidate trends, research, and competitive intelligence for ${run.topic}`, SYSTEM_PROMPTS.contextMerger);
    await prisma.contextMergerData.create({
      data: {
        runId,
        masterTitle: contextMergerResult.masterTitle || `Master Brief: ${run.topic}`,
        takeaways: contextMergerResult.takeaways || [],
        thesis: contextMergerResult.thesis || `Autonomous strategy for ${run.topic}`
      }
    });
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 50 } });

    // Agent 6: Content Strategy
    const strategyResult = await executeAgent(runId, 6, 'strategy', 'Agent 06: Content Strategy', `Formulate content strategy for ${run.topic}`, SYSTEM_PROMPTS.contentStrategy);
    await prisma.strategyData.create({
      data: {
        runId,
        selectedTypes: strategyResult.selectedTypes || ["Blog Post", "LinkedIn Post"],
        objective: strategyResult.objective || "Generate Leads",
        targetAudience: run.targetAudience || "Decision Makers",
        communicationStyle: strategyResult.communicationStyle || "Authoritative & Data-Backed",
        channels: strategyResult.channels || []
      }
    });
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 60 } });

    // Agent 7: Content Planning
    const planningResult = await executeAgent(runId, 7, 'planning', 'Agent 07: Content Planning', `Create editorial schedule for ${run.topic}`, SYSTEM_PROMPTS.contentPlanning);
    if (planningResult.schedule && Array.isArray(planningResult.schedule)) {
      for (const item of planningResult.schedule) {
        await prisma.planningData.create({
          data: {
            runId,
            title: item.title || `Content piece for ${run.topic}`,
            channel: item.channel || 'Blog',
            scheduledDate: new Date(item.scheduledDate || Date.now() + 86400000),
            scheduledTime: item.scheduledTime || '10:00 AM'
          }
        });
      }
    }
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 70 } });

    // Agent 8: SEO Agent
    const seoResult = await executeAgent(runId, 8, 'seo', 'Agent 08: SEO Agent', `Formulate SEO keyword and SERP strategy for ${run.topic}`, SYSTEM_PROMPTS.seo);
    await prisma.seoData.create({
      data: {
        runId,
        serpUrl: seoResult.serpPreview?.url || `https://example.com/blog/${run.topic.toLowerCase().replace(/\s+/g, '-')}`,
        serpTitle: seoResult.serpPreview?.title || `${run.topic} | Deep Insights`,
        serpDescription: seoResult.serpPreview?.description || `Explore ${run.topic} strategies.`,
        keywords: seoResult.keywords || [],
        internalLinks: seoResult.internalLinks || [],
        faqs: seoResult.faqs || []
      }
    });
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 80 } });

    // Agent 9: Content Generation
    const genResult = await executeAgent(runId, 9, 'generator', 'Agent 09: Content Generation', `Generate full publish-ready content for ${run.topic}`, SYSTEM_PROMPTS.contentGeneration);
    
    // Save generated content to MarketingAsset DB table
    if (genResult.blogPost) {
      await prisma.marketingAsset.create({
        data: {
          runId,
          assetType: 'Blog Post',
          channel: 'Blog',
          title: genResult.blogPost.title || `Executive Playbook: ${run.topic}`,
          content: genResult.blogPost.content || '',
          status: 'PENDING'
        }
      });
    }
    if (genResult.linkedinPosts && Array.isArray(genResult.linkedinPosts)) {
      for (const item of genResult.linkedinPosts) {
        await prisma.marketingAsset.create({
          data: {
            runId,
            assetType: 'LinkedIn Post',
            channel: 'LinkedIn',
            title: item.type || 'LinkedIn Post',
            content: item.content || '',
            status: 'PENDING'
          }
        });
      }
    }
    if (genResult.emailSequence && Array.isArray(genResult.emailSequence)) {
      for (const item of genResult.emailSequence) {
        await prisma.marketingAsset.create({
          data: {
            runId,
            assetType: 'Email Content',
            channel: 'Email',
            title: item.subject || `Email Step ${item.step}`,
            content: `Subject: ${item.subject}\nPreview: ${item.preview}\n\n${item.body}`,
            status: 'PENDING'
          }
        });
      }
    }
    if (genResult.adVariants && Array.isArray(genResult.adVariants)) {
      for (const item of genResult.adVariants) {
        await prisma.marketingAsset.create({
          data: {
            runId,
            assetType: 'Ad Copy Variant',
            channel: 'Google Ads',
            title: item.headline || 'Ad Variant',
            content: item.body || '',
            status: 'PENDING'
          }
        });
      }
    }
    await prisma.marketingRun.update({ where: { id: runId }, data: { overallProgress: 90 } });

    // Agent 10: Creative Generation
    const creativeResult = await executeAgent(runId, 10, 'creative', 'Agent 10: Creative Generation', `Generate image and video prompts for ${run.topic}`, SYSTEM_PROMPTS.creativeGeneration);
    
    if (creativeResult.imagePrompts && Array.isArray(creativeResult.imagePrompts)) {
      for (const item of creativeResult.imagePrompts) {
        await prisma.marketingAsset.create({
          data: {
            runId,
            assetType: 'Image Prompt',
            channel: 'AI Image Generator',
            title: `Image Prompt: ${item.purpose || 'Hero Image'}`,
            content: `Prompt: ${item.prompt}\nNegative Prompt: ${item.negativePrompt}\nAspect Ratio: ${item.aspectRatio}\nStyle: ${item.style}`,
            dimensions: item.aspectRatio,
            status: 'PENDING'
          }
        });
      }
    }
    if (creativeResult.videoPrompts && Array.isArray(creativeResult.videoPrompts)) {
      for (const item of creativeResult.videoPrompts) {
        await prisma.marketingAsset.create({
          data: {
            runId,
            assetType: 'Video Prompt',
            channel: 'AI Video Generator',
            title: `Video Concept: ${item.concept || 'Video Brief'}`,
            content: `Concept: ${item.concept}\nDuration: ${item.duration}\nAspect Ratio: ${item.aspectRatio}\nStyle: ${item.style}\nScenes:\n${JSON.stringify(item.scenes, null, 2)}`,
            dimensions: item.aspectRatio,
            status: 'PENDING'
          }
        });
      }
    }

    // Mark run COMPLETED
    await prisma.marketingRun.update({
      where: { id: runId },
      data: {
        status: 'COMPLETED',
        overallProgress: 100,
        completedAt: new Date()
      }
    });

    await prisma.marketingRunLog.create({
      data: {
        runId,
        logMessage: 'All 10 agents completed successfully.',
        logLevel: 'success'
      }
    });

    // Create DB Notification for User
    await prisma.notification.create({
      data: {
        userId: run.userId,
        title: 'Marketing Campaign Completed',
        message: `Your campaign "${run.topic}" finished running all 10 agents successfully!`,
        type: 'success',
        link: `/app/marketing/runs/${runId}`
      }
    }).catch(e => console.warn('Failed to create notification:', e.message));

    console.log(`[Run ${runId}] Pipeline completed successfully.`);
  } catch (error) {
    console.error(`[Run ${runId}] Pipeline failed:`, error);
    await prisma.marketingRun.update({
      where: { id: runId },
      data: { status: 'FAILED' }
    });

    const failedRun = await prisma.marketingRun.findUnique({ where: { id: runId } });
    if (failedRun) {
      await prisma.notification.create({
        data: {
          userId: failedRun.userId,
          title: 'Marketing Campaign Failed',
          message: `Campaign "${failedRun.topic}" encountered an error during execution.`,
          type: 'error',
          link: `/app/marketing/runs/${runId}`
        }
      }).catch(e => console.warn('Failed to create notification:', e.message));
    }
  }
}

module.exports = {
  runMarketingPipeline
};
