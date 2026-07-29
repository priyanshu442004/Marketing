import { MARKETING_AGENTS_DEFINITION } from "./agents";

export const initialRuns = [
  {
    id: "RUN-2481",
    title: "Autonomous Manufacturing & Smart Factory IoT Campaign",
    topic: "Agentic AI & Predictive Maintenance in Smart Factories",
    source: "Automated",
    industry: "Manufacturing",
    objective: "Generate Leads",
    targetAudience: "VP Operations, Plant Managers, Chief Technology Officers",
    status: "running",
    overallProgress: 65,
    createdAt: "2026-07-29T08:30:00Z",
    completedAt: null,
    agents: [
      { id: "agent-1", name: "Marketing Supervisor", role: "Orchestration & Workflow DAG", status: "completed", progress: 100 },
      { id: "agent-2", name: "Trend Identification", role: "SERP & Social Trend Analysis", status: "completed", progress: 100 },
      { id: "agent-3", name: "Research", role: "Audience & Market Research", status: "completed", progress: 100 },
      { id: "agent-4", name: "Competitive Intelligence", role: "Competitor Benchmarking", status: "completed", progress: 100 },
      { id: "agent-5", name: "Context Merger", role: "Strategic Context Synthesis", status: "completed", progress: 100 },
      { id: "agent-6", name: "Content Strategy", role: "Channel & Messaging Matrix", status: "completed", progress: 100 },
      { id: "agent-7", name: "Content Planning", role: "Editorial Calendar & Schedule", status: "running", progress: 50 },
      { id: "agent-8", name: "SEO", role: "Keyword Intent & SERP Optimization", status: "queued", progress: 0 },
      { id: "agent-9", name: "Content Generation", role: "Multi-Format Copywriting", status: "queued", progress: 0 },
      { id: "agent-10", name: "Creative Generation", role: "Visual Asset Design & Specs", status: "queued", progress: 0 }
    ],
    logs: [
      "08:30:01 [Supervisor] Initialized multi-agent execution pipeline.",
      "08:30:03 [Trend Identification] Scraped 42 industry search clusters. Identified top query: 'predictive maintenance AI'.",
      "08:30:07 [Research] Processed 18 news sources and 4 industry whitepapers.",
      "08:30:12 [Competitive Intelligence] Mapped positioning matrix against 4 primary manufacturing software rivals.",
      "08:30:18 [Context Merger] Synthesized master strategy brief. 3 core pillars established.",
      "08:30:24 [Content Strategy] Defined channel mix (LinkedIn, Whitepaper, Tech Blog, Webinar).",
      "08:30:30 [Content Planning] Building 30-day editorial schedule..."
    ],
    summary: {
      keyFindings: [
        "Unplanned equipment downtime costs automotive plants up to $22,000 per minute.",
        "78% of operational heads express concern over legacy SCADA system integration friction.",
        "Keyword cluster 'edge AI anomaly detection' experienced a +142% volume spike over the last 90 days."
      ],
      recommendedAngle: "Highlight plug-and-play SCADA connector capability and guaranteed zero-downtime deployment."
    },
    agentData: {
      trendIdentification: {
        kpis: { totalKeywords: 48, avgVolume: "14.2K", topRising: "Edge AI Maintenance" },
        keywords: [
          { keyword: "predictive maintenance AI", volume: "18,400", trend: "up", difficulty: "Medium (42/100)", sparkline: [20, 35, 45, 60, 85, 95] },
          { keyword: "smart factory sensor telemetry", volume: "9,200", trend: "up", difficulty: "Low (28/100)", sparkline: [15, 20, 30, 45, 55, 70] },
          { keyword: "SCADA anomaly detection", volume: "12,100", trend: "up", difficulty: "High (64/100)", sparkline: [40, 42, 50, 68, 75, 90] }
        ],
        hashtags: ["#SmartManufacturing", "#IndustrialAI", "#PredictiveMaintenance", "#Industry40"],
        questions: ["How does edge AI reduce unplanned downtime?", "Can predictive analytics integrate with legacy Siemens PLCs?"],
        seasonalCallout: "Q3 Plant Modernization Budget Cycles: 64% of procurement decisions finalized by October."
      },
      research: {
        brief: "Modern manufacturing enterprises face unprecedented pressure to reduce operational expenditure while maintaining strict safety standards. Unplanned downtime remains the single largest margin erosion factor.",
        painPoints: [
          { title: "Legacy System Lock-in", description: "Inability to extract high-frequency vibration & thermal data from older PLCs." },
          { title: "False Alarm Fatigue", description: "Rule-based threshold alerts generate hundreds of non-critical daily warnings." }
        ],
        technologies: [{ name: "Sub-millisecond Edge Inference", desc: "Running lightweight ML models directly on factory floor gateways." }],
        news: [{ headline: "Global Supply Chain Summit Highlights AI Operations", source: "Manufacturing Tech Review", date: "2026-07-26" }]
      },
      competitiveIntelligence: {
        competitors: [
          { name: "NorthByte Automation", positioning: "Legacy SCADA visualization", strengths: "Deep automotive base", cadence: "Weekly news", seoFocus: "PLCs & SCADA" },
          { name: "Meridian Labs", positioning: "Cloud-only predictive maintenance", strengths: "Modern SaaS UI", cadence: "Bi-weekly webinars", seoFocus: "Cloud IoT" }
        ],
        gaps: ["No competitor offers offline-first edge AI inference with automatic SCADA synchronization."],
        angles: [{ title: "The Offline-First Edge Advantage", desc: "Position Everline as the only operational AI platform that functions continuously during network disruptions." }]
      },
      contextMerger: {
        title: "Master Marketing Context Brief: Smart Factory Reliability 2026",
        takeaways: ["Focus core narrative on zero-downtime setup and offline-first edge capabilities."],
        thesis: "Everline bridges the Industry 4.0 gap by delivering zero-friction edge AI telemetry that connects directly to legacy hardware."
      },
      contentStrategy: {
        types: ["Blog Post", "LinkedIn Executive Brief", "Technical Whitepaper", "Email Nurture Sequence"],
        objective: "Generate Enterprise Demo Requests",
        audience: "VP of Operations & Plant Reliability Directors",
        communicationStyle: "Engineering-grade, precise, non-hype",
        channels: [{ channel: "LinkedIn", format: "Thought Leadership", frequency: "3x / week" }]
      },
      contentPlanning: [
        { id: "cp-1", title: "Why Cloud-Only Predictive Maintenance Fails on Factory Floors", channel: "Blog", date: "2026-08-04", time: "09:00 AM", status: "scheduled" }
      ],
      seo: {
        keywords: [{ keyword: "predictive maintenance software", intent: "Transactional", volume: "18,400", difficulty: "48/100" }],
        serpPreview: {
          title: "Predictive Maintenance AI for Smart Manufacturing | Everline",
          url: "https://everline.ai/solutions/manufacturing-predictive-maintenance",
          description: "Eliminate unplanned factory downtime with Everline's offline-first edge AI. Connect legacy PLCs in under 48 hours."
        },
        searchIntentSummary: "High commercial intent buyers searching for hardware-agnostic telemetry integrations.",
        internalLinks: [{ from: "/blog/cloud-only-maintenance-fails", to: "/solutions/edge-ai-telemetry" }],
        faqs: ["Does Everline require replacing our existing Siemens or Allen-Bradley PLCs?"]
      }
    },
    outputs: {
      blogPost: {
        id: "asset-801",
        title: "Why Cloud-Only Predictive Maintenance Fails on the Factory Floor",
        readTime: "6 min read",
        status: "pending",
        content: `### The High Cost of Network Latency in Industrial Operations\nWhen an assembly line bearing reaches catastrophic thermal breakdown, seconds matter. Relying on cloud server round-trips to detect vibration spikes introduces critical delays that lead to forced equipment shutdowns.`
      },
      linkedinPosts: [
        {
          id: "asset-802",
          type: "Executive Insight",
          status: "pending",
          content: "Unplanned downtime costs automotive manufacturing plants an estimated $22,000 per minute.\n\nYet 68% of reliability teams still rely on static threshold alerts that trigger after damage has already started."
        }
      ],
      emailSequence: [
        {
          id: "asset-803",
          step: 1,
          subject: "Eliminating SCADA false alarms for plant operations",
          preview: "How plant managers are cutting maintenance downtime by 34%...",
          status: "pending",
          body: "Hi {{firstName}},\n\nManaging plant reliability across legacy assembly lines often comes down to balancing false alarm fatigue with risk of unexpected bearing breakdown."
        }
      ],
      adVariants: [
        { id: "asset-804", headline: "Zero-Downtime Smart Manufacturing", body: "Deploy edge AI telemetry across legacy PLCs in under 48 hours.", status: "pending" }
      ],
      creativeAssets: [
        { id: "asset-806", title: "Edge Telemetry Architecture Diagram", type: "Architecture Diagram", dimensions: "1920x1080 SVG", status: "pending" }
      ]
    }
  },
  {
    id: "RUN-2480",
    title: "Enterprise Multi-Cloud Cost Optimization & Egress Campaign",
    topic: "Multi-Cloud Egress Cost Governance & Policy-as-Code",
    source: "Manual",
    industry: "Enterprise SaaS",
    objective: "Build Awareness",
    targetAudience: "VP Infrastructure, Chief Information Security Officers, FinOps Lead",
    status: "completed",
    overallProgress: 100,
    createdAt: "2026-07-28T14:20:00Z",
    completedAt: "2026-07-28T14:28:40Z",
    agents: MARKETING_AGENTS_DEFINITION.map((a) => ({ ...a, status: "completed", progress: 100 })),
    outputs: {
      blogPost: {
        id: "asset-901",
        title: "The Silent Multi-Cloud Budget Leaks (And How Enterprise CTOs Stop Them)",
        readTime: "5 min read",
        status: "approved",
        content: `### Executive Overview\nAs enterprise workloads scale across hybrid clouds, infrastructure engineering leaders face an expanding financial blindspot. Egress fees now constitute over 20% of unbudgeted spending drift.`
      },
      linkedinPosts: [
        { id: "asset-902", type: "FinOps Breakdown", status: "approved", content: "Most multi-cloud budgets don't break because of compute rates—they bleed silently through unmonitored egress traffic." }
      ],
      emailSequence: [],
      adVariants: [],
      creativeAssets: []
    }
  }
];
