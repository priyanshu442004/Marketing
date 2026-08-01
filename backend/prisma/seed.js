const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding for BrandSutra AI Marketing Platform...");

  // Clean existing demo data for clean re-runs
  await prisma.marketingRun.deleteMany({ where: { id: { in: ["run-101"] } } });
  await prisma.websiteAnalysis.deleteMany({ where: { id: { in: ["analysis-201"] } } });

  // 1. Seed Demo Operator User
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "alex.vance@brandsutra.ai" },
    update: {
      company: "Acme Cloud Technologies",
      title: "VP of Enterprise Growth & Marketing",
      plan: "Enterprise Pro",
    },
    create: {
      email: "alex.vance@brandsutra.ai",
      name: "Alex Vance",
      passwordHash,
      company: "Acme Cloud Technologies",
      role: "ADMIN",
      title: "VP of Enterprise Growth & Marketing",
      plan: "Enterprise Pro",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`✅ Seeded User: ${demoUser.email} (ID: ${demoUser.id})`);

  // Seed RSS Sources
  await prisma.userRssSource.createMany({
    data: [
      { userId: demoUser.id, url: "https://industryweek.com/rss/technology", title: "Industry Week Tech" },
      { userId: demoUser.id, url: "https://techcrunch.com/category/enterprise/feed", title: "TechCrunch Enterprise" },
      { userId: demoUser.id, url: "https://finops.org/feed.xml", title: "FinOps Foundation" },
    ],
    skipDuplicates: true,
  });

  // Seed User Connectors
  await prisma.userConnector.createMany({
    data: [
      { userId: demoUser.id, connectorId: "linkedin", name: "LinkedIn Organization Page", connected: true, accountName: "BrandSutra Marketing Corp" },
      { userId: demoUser.id, connectorId: "gsc", name: "Google Search Console", connected: true, accountName: "acmecloud.io" },
      { userId: demoUser.id, connectorId: "hubspot", name: "HubSpot CRM & CMS", connected: false, accountName: "Not Connected" },
      { userId: demoUser.id, connectorId: "wordpress", name: "WordPress Publishing Engine", connected: false, accountName: "Not Connected" },
    ],
    skipDuplicates: true,
  });

  // 2. Seed Marketing Run 1 (Completed Run with Full 10-Agent Artifacts)
  const run1 = await prisma.marketingRun.create({
    data: {
      id: "run-101",
      userId: demoUser.id,
      topic: "Autonomous Multi-Cloud Cost Optimization & Egress Policy-as-Code",
      industry: "Enterprise SaaS",
      targetAudience: "VP Infrastructure, CISOs, FinOps Leads",
      status: "COMPLETED",
      overallProgress: 100,
      triggerMode: "MANUAL",
      summary: "Comprehensive 10-agent campaign execution identifying rising FinOps search intent, competitor positioning gaps, and generating high-converting blog, email, and LinkedIn collateral.",
      totalTokensUsed: 18450,
      estimatedCost: 0.12,
      modelVersion: "gpt-4.1-mini",
      agentExecutions: {
        create: [
          { agentId: "supervisor", agentName: "Agent 01: Supervisor Agent", agentRole: "DAG Orchestrator & Quality Control", status: "COMPLETED", stepNumber: 1, outputSummary: "DAG compiled with 9 downstream dependencies. Execution verified with 100% completion.", tokensUsed: 1200 },
          { agentId: "trend", agentName: "Agent 02: Trend Identification Agent", agentRole: "Live RSS & Search Intent Miner", status: "COMPLETED", stepNumber: 2, outputSummary: "Identified 48 high-intent keywords with 14.2K avg volume. Rising focus on 'Egress Policy-as-Code'.", tokensUsed: 2100 },
          { agentId: "research", agentName: "Agent 03: Audience & Research Agent", agentRole: "Deep Technical Context Synthesizer", status: "COMPLETED", stepNumber: 3, outputSummary: "Synthesized technical whitepapers and CISO surveys around unpredictable egress bandwidth surcharges.", tokensUsed: 2800 },
          { agentId: "competitive", agentName: "Agent 04: Competitive Intelligence Agent", agentRole: "Positioning Matrix Evaluator", status: "COMPLETED", stepNumber: 4, outputSummary: "Analyzed CloudHealth and Datadog positioning gaps; highlighted lack of egress-first governance.", tokensUsed: 1900 },
          { agentId: "context", agentName: "Agent 05: Context Merger Agent", agentRole: "Strategic Thesis & Master Brief Synthesizer", status: "COMPLETED", stepNumber: 5, outputSummary: "Created Master Brief: 'Shifting from Reactive Cost Tracking to Automated Policy Enforcement'.", tokensUsed: 1500 },
          { agentId: "strategy", agentName: "Agent 06: Content Strategy Agent", agentRole: "Multi-Channel Distribution Architect", status: "COMPLETED", stepNumber: 6, outputSummary: "Mapped 4 distribution vectors across LinkedIn Thought Leadership, Technical Blog, and Nurture Emails.", tokensUsed: 1400 },
          { agentId: "planning", agentName: "Agent 07: Content Planning Agent", agentRole: "Editorial Calendar Scheduler", status: "COMPLETED", stepNumber: 7, outputSummary: "Scheduled 4 collateral releases starting Monday at 09:00 AM EST.", tokensUsed: 950 },
          { agentId: "seo", agentName: "Agent 08: SEO & Discoverability Agent", agentRole: "Keyword Clustering & SERP Architect", status: "COMPLETED", stepNumber: 8, outputSummary: "Generated SERP preview title: 'Egress Policy-as-Code: Stopping Unplanned Cloud Data Charges'.", tokensUsed: 1600 },
          { agentId: "generator", agentName: "Agent 09: Multi-Format Content Generator", agentRole: "High-Fidelity Copywriter & Asset Engine", status: "COMPLETED", stepNumber: 9, outputSummary: "Produced 1 Long-form Blog, 2 LinkedIn Posts, 1 Email Nurture, and 2 Ad Copy Variants.", tokensUsed: 3500 },
          { agentId: "creative", agentName: "Agent 10: Visual & Creative Asset Generator", agentRole: "Diagram & Visual Asset Producer", status: "COMPLETED", stepNumber: 10, outputSummary: "Generated 1 SVG Architectural Topology Flow and 1 High-Density Infographic.", tokensUsed: 1500 },
        ]
      },
      logs: {
        create: [
          { logMessage: "Initializing Marketing Run run-101 [Topic: Autonomous Multi-Cloud Cost Optimization]", logLevel: "info" },
          { logMessage: "Trend Identification Agent: Scanning RSS feeds & Google Search Trends...", logLevel: "info" },
          { logMessage: "Research Agent: Extracted 3 core CISO pain points from latest Gartner FinOps benchmarks.", logLevel: "info" },
          { logMessage: "Competitive Agent: Discovered competitor positioning gap in automated egress budget enforcement.", logLevel: "info" },
          { logMessage: "Multi-Format Generator: Generated Long-Form Blog Post (1,450 words) and 2 LinkedIn Posts.", logLevel: "success" },
          { logMessage: "Run run-101 completed successfully. Assets pushed to Human Approval Queue.", logLevel: "success" },
        ]
      },
      trendData: {
        create: {
          totalKeywords: 48,
          avgVolume: "14.2K",
          topRising: "Egress Policy-as-Code",
          seasonalCallout: "Q3 Enterprise Budget Audits increase cloud governance search traffic by 34%.",
          keywords: [
            { keyword: "cloud egress cost optimization", volume: "18.4K", difficulty: "Medium", trend: "Rising" },
            { keyword: "multi-cloud policy as code", volume: "12.1K", difficulty: "High", trend: "Rising" },
            { keyword: "finops automated governance", volume: "9.8K", difficulty: "Low", trend: "Stable" }
          ],
          hashtags: ["#FinOps", "#CloudGovernance", "#DevOps", "#AWS", "#Azure"],
          questions: ["How to stop unexpected AWS egress fees?", "What is egress policy-as-code?", "Best FinOps tools for Kubernetes?"]
        }
      },
      researchData: {
        create: {
          brief: "Enterprise IT organizations are experiencing 25-40% budget overruns due to unexpected egress bandwidth charges and unmonitored shadow cloud infrastructure.",
          painPoints: [
            { title: "Unpredictable Egress Surcharges", description: "Multi-region data transfers result in massive surprise invoices at end-of-month billing cycles." },
            { title: "Manual Policy Enforcement", description: "DevOps engineers manually inspect Terraform templates, leading to human error and compliance gaps." },
            { title: "Lack of Real-Time Remediation", description: "Traditional monitoring tools flag overspending days after the budget has already been exceeded." }
          ],
          technologies: [
            { name: "eBPF Packet Monitoring", desc: "Real-time kernel-level egress network flow inspection." },
            { name: "OPA Policy Gatekeepers", desc: "Open Policy Agent validation integrated directly into CI/CD pipelines." }
          ],
          news: [
            { headline: "Gartner 2026 Report: 70% of Enterprises Will Adopt Automated FinOps Guardrails", source: "Gartner Research", date: "2026-06-15", url: "https://gartner.com" }
          ]
        }
      },
      competitiveData: {
        create: {
          competitors: [
            { name: "CloudHealth by VMware", positioning: "Legacy Enterprise Reporting", strengths: "Deep executive dashboards", cadence: "Bi-weekly", seoFocus: "Cloud Cost Tracking" },
            { name: "Datadog Cloud Cost", positioning: "Observability Add-on", strengths: "Metrics integration", cadence: "Weekly", seoFocus: "Infrastructure APM" }
          ],
          gaps: ["No automated policy enforcement before resources deploy", "Lack of specialized egress network bandwidth cost isolation"],
          angles: [
            { title: "Policy-as-Code First", desc: "Position Acme Cloud as the active guardrail rather than passive expense reporting." }
          ]
        }
      },
      contextMergerData: {
        create: {
          masterTitle: "Active Cloud Governance: Moving Beyond Passive Cost Dashboards",
          takeaways: [
            "DevOps teams need automated guardrails in CI/CD, not retro-active billing reports.",
            "Egress data transfers represent the fastest-growing component of unbudgeted cloud expenditure.",
            "Combining OPA policies with live network telemetry delivers immediate ROI within 14 days."
          ],
          thesis: "By embedding automated cost policies directly into CI/CD build pipelines, enterprise infrastructure teams can prevent 100% of unbudgeted cloud egress spikes before code touches production."
        }
      },
      strategyData: {
        create: {
          selectedTypes: ["Blog Post", "LinkedIn Post", "Email Sequence", "Ad Copy Variant"],
          objective: "Generate High-Intent Enterprise Demo Requests",
          targetAudience: "VP Infrastructure & FinOps Directors",
          communicationStyle: "Authoritative, Engineering-Grade, Metric-Driven",
          channels: [
            { channel: "LinkedIn Organic", format: "Carousel & Short Essay", frequency: "3x Weekly" },
            { channel: "Engineering Blog", format: "Deep Dive Architecture Guide", frequency: "1x Bi-Weekly" },
            { channel: "Direct Outbound Email", format: "Problem-Agitate-Solve 3-Touch Sequence", frequency: "Automated Cadence" }
          ]
        }
      },
      seoData: {
        create: {
          serpUrl: "https://acmecloud.io/blog/egress-policy-as-code-guide",
          serpTitle: "Egress Policy-as-Code: Stopping Unplanned Cloud Data Charges | Acme Cloud",
          serpDescription: "Learn how enterprise infrastructure teams use automated policy enforcement in CI/CD to eliminate surprise AWS and Azure egress charges.",
          keywords: [
            { keyword: "egress policy as code", intent: "Commercial Intent", volume: "12.4K", difficulty: "Medium" },
            { keyword: "stop aws egress costs", intent: "Transactional Intent", volume: "8.1K", difficulty: "Low" }
          ],
          internalLinks: [
            { from: "/blog/egress-policy-as-code-guide", to: "/products/cost-explorer" },
            { from: "/blog/egress-policy-as-code-guide", to: "/docs/terraform-provider" }
          ],
          faqs: [
            "How does egress policy-as-code integrate with Terraform?",
            "Can Acme Cloud block rogue data transfers automatically?",
            "What is the setup time for enterprise Kubernetes clusters?"
          ]
        }
      },
      assets: {
        create: [
          {
            id: "asset-b1",
            assetType: "Blog Post",
            channel: "Blog",
            title: "Why Passive Cloud Dashboards Fail: The Case for Egress Policy-as-Code",
            content: "# Why Passive Cloud Dashboards Fail: The Case for Egress Policy-as-Code\n\nEvery month, enterprise infrastructure leaders open their cloud provider invoices only to be greeted by the same unpleasant surprise: egress charges that exceeded forecast models by 30% or more...\n\n### The Anatomy of an Egress Surge\nWhen workloads scale across multi-region VPCs, microservice telemetry and inter-cluster replication quietly consume gigabytes of bandwidth...",
            status: "APPROVED",
            version: 1,
            revisionNotes: "Reviewed and approved by VP Marketing."
          },
          {
            id: "asset-l1",
            assetType: "LinkedIn Post",
            channel: "LinkedIn",
            title: "Executive Insight: Stop Paying Egress Penalties",
            content: "Are surprise cloud egress fees eating into your engineering budget?\n\nMost FinOps tools show you where you lost money LAST month.\n\nActive Egress Policy-as-Code stops unbudgeted data transfers BEFORE your Terraform code deploys.\n\nHere is how 500+ DevOps teams cut multi-cloud transfer fees by 42%: [Link]",
            status: "APPROVED",
            version: 1
          },
          {
            id: "asset-e1",
            assetType: "Email Content",
            channel: "Email",
            title: "FinOps Email Nurture - Touch 1",
            content: "Subject: Eliminating AWS egress surprises in CI/CD\n\nHi {{firstName}},\n\nIf your team is managing multi-region Kubernetes clusters, you already know how fast cloud egress fees escalate.\n\nWe built Acme Cloud Egress Shield to inject automated policy checks directly into your CI/CD pipeline...\n\nBest,\nAlex Vance",
            status: "PENDING",
            version: 1
          },
          {
            id: "asset-c1",
            assetType: "Creative Asset",
            channel: "Visual Diagrams",
            title: "Multi-Cloud Egress Flow Architecture",
            content: "<svg>Architectural Flow Topology Diagram</svg>",
            dimensions: "1920x1080 SVG",
            status: "APPROVED",
            version: 1
          }
        ]
      }
    }
  });

  console.log(`✅ Seeded Marketing Run: ${run1.topic} (ID: ${run1.id})`);

  // 3. Seed Website Analysis (Module 2 Website Intelligence Audit)
  const analysis1 = await prisma.websiteAnalysis.create({
    data: {
      id: "analysis-201",
      userId: demoUser.id,
      url: "https://acmecloud.io",
      domain: "acmecloud.io",
      companyName: "Acme Cloud Technologies",
      overview: "Acme Cloud provides automated multi-cloud cost governance and egress policy-as-code for enterprise DevOps teams.",
      industry: "Enterprise SaaS",
      targetAudience: "VP Infrastructure, Chief Information Security Officers, FinOps Leads",
      products: ["Cost Explorer Engine", "Egress Shield Policy"],
      services: ["Cloud Architecture Audit", "FinOps Onboarding"],
      goals: ["Increase Conversion", "Organic SEO Growth", "Generate Enterprise Leads"],
      status: "COMPLETED",
      healthScore: 84,
      totalPagesCrawled: 42,
      lastCrawledAt: new Date(),
      technicalOverview: {
        create: {
          pagesDiscovered: 42,
          maxDepth: 4,
          sitemapFound: "Found (valid XML)",
          avgLoadTime: "1.42s"
        }
      },
      pageInventory: {
        create: [
          { path: "/", pageType: "Homepage", title: "Acme Cloud — Automated Cloud Cost Governance", wordCount: 1450, internalLinks: 34, status: "OK" },
          { path: "/products/cost-explorer", pageType: "Product Page", title: "Cost Explorer Engine — Real-time FinOps", wordCount: 980, internalLinks: 18, status: "OK" },
          { path: "/products/egress-shield", pageType: "Product Page", title: "Egress Shield Policy as Code", wordCount: 1120, internalLinks: 22, status: "OK" },
          { path: "/pricing", pageType: "Pricing Page", title: "Transparent Enterprise Pricing", wordCount: 620, internalLinks: 12, status: "OK" },
          { path: "/blog/egress-guide", pageType: "Blog Article", title: "Complete Guide to AWS Egress Optimization", wordCount: 2400, internalLinks: 14, status: "OK" }
        ]
      },
      navigationHierarchy: {
        create: [
          { name: "Home", parentId: null, order: 1 },
          { name: "Products", parentId: null, order: 2 },
          { name: "Solutions", parentId: null, order: 3 },
          { name: "Pricing", parentId: null, order: 4 },
          { name: "Resources", parentId: null, order: 5 }
        ]
      },
      gapAnalysis: {
        create: [
          {
            category: "businessAlignment",
            title: "1. Business & Messaging Alignment",
            finding: "Homepage hero section emphasizes 'Cloud Cost Visibility' rather than your key differentiator: 'Automated Egress Policy Enforcement'.",
            whyItMatters: "Prospects mistake your product for a generic dashboard like CloudHealth rather than an active governance platform.",
            severity: "high"
          },
          {
            category: "contentAnalysis",
            title: "2. Content Depth & Coverage",
            finding: "Missing dedicated landing page for Kubernetes Egress & Multi-Region VPC topology.",
            whyItMatters: "High-volume search traffic searching for 'K8s egress cost optimization' bounces without finding tailored solution architecture.",
            severity: "medium"
          },
          {
            category: "conversionAnalysis",
            title: "4. Conversion Readiness & CTAs",
            finding: "Pricing page lacks interactive ROI calculator for bandwidth savings.",
            whyItMatters: "Enterprise CISOs and VPs leave without calculating their estimated monthly savings.",
            severity: "high"
          }
        ]
      },
      scoreCategories: {
        create: [
          { name: "Value Prop Clarity", score: 82 },
          { name: "Content Depth & Coverage", score: 78 },
          { name: "SEO & Discoverability", score: 88 },
          { name: "Conversion Architecture", score: 75 },
          { name: "UX & Navigation", score: 90 },
          { name: "Technical Performance", score: 92 }
        ]
      },
      recommendations: {
        create: [
          {
            id: "rec-1",
            category: "Positioning & Messaging",
            title: "Reposition Above-The-Fold Hero Headline",
            impact: "High Impact",
            effort: "Low Effort",
            severity: "high",
            details: "Change H1 from 'See Your Cloud Costs' to 'Prevent Unbudgeted Cloud Egress Charges Before Deployment'. Add interactive terminal preview.",
            status: "TODO"
          },
          {
            id: "rec-2",
            category: "Conversion Funnel",
            title: "Add Interactive Egress ROI Savings Calculator",
            impact: "High Impact",
            effort: "Medium Effort",
            severity: "high",
            details: "Build a 3-slider widget on the pricing page allowing DevOps leads to select monthly cloud spend and receive instant projected savings.",
            status: "TODO"
          }
        ]
      },
      roadmapItems: {
        create: [
          { phase: "now", title: "Update Hero Headline & Value Proposition", category: "Messaging", effort: "Low Effort", status: "TODO" },
          { phase: "now", title: "Add Terraform Code Snippet Preview to Product Page", category: "UX", effort: "Low Effort", status: "TODO" },
          { phase: "next", title: "Deploy Kubernetes Egress Optimization Landing Page", category: "SEO Content", effort: "Medium Effort", status: "TODO" },
          { phase: "next", title: "Build Interactive Egress ROI Savings Calculator", category: "Conversion", effort: "Medium Effort", status: "TODO" },
          { phase: "later", title: "Publish Enterprise FinOps Benchmark Whitepaper", category: "Thought Leadership", effort: "High Effort", status: "TODO" }
        ]
      }
    }
  });

  console.log(`✅ Seeded Website Analysis: ${analysis1.companyName} (${analysis1.domain}) (ID: ${analysis1.id})`);

  // Seed Initial Audit Activity Log & Notification
  await prisma.activityLog.create({
    data: {
      userId: demoUser.id,
      action: "RUN_COMPLETED",
      resourceType: "MarketingRun",
      resourceId: run1.id,
      details: { topic: run1.topic, assetsGenerated: 4 },
      ipAddress: "127.0.0.1",
      userAgent: "BrandSutra Engine Agent",
    },
  });

  await prisma.notification.create({
    data: {
      userId: demoUser.id,
      title: "Marketing Run Completed",
      message: "Run 'run-101' finished. 4 new assets are ready for human approval.",
      type: "success",
      link: "/app/runs/run-101",
    },
  });

  console.log("🚀 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
