export const initialAnalyses = [
  {
    id: "ana-4011",
    domain: "acmecloud.io",
    companyName: "Acme Cloud Technologies",
    industry: "Enterprise SaaS",
    url: "https://acmecloud.io",
    status: "completed",
    createdAt: "2026-07-28T16:00:00Z",
    healthScore: 68,
    agents: [
      { id: "w-agent-1", name: "Website Structure & Inventory", role: "DOM & Sitemap Crawler", status: "completed", progress: 100 },
      { id: "w-agent-2", name: "Business Gap Analysis", role: "Messaging & Content Auditor", status: "completed", progress: 100 },
      { id: "w-agent-3", name: "Recommendation & Scoring Engine", role: "Roadmap & Score Calculator", status: "completed", progress: 100 }
    ],
    technicalOverview: {
      pagesDiscovered: 42,
      maxDepth: 4,
      sitemapFound: "Yes (sitemap.xml)",
      avgLoadTime: "1.42s"
    },
    pageInventory: [
      { path: "/", pageType: "Homepage", title: "Acme Cloud | Next-Gen Cloud Platform", wordCount: 840, internalLinks: 24, status: "200 OK" },
      { path: "/features", pageType: "Product Features", title: "Cloud Features & Automation", wordCount: 1120, internalLinks: 18, status: "200 OK" },
      { path: "/pricing", pageType: "Pricing", title: "Transparent Multi-Cloud Pricing", wordCount: 450, internalLinks: 8, status: "200 OK" },
      { path: "/solutions/enterprise", pageType: "Solutions", title: "Enterprise Cloud Governance", wordCount: 620, internalLinks: 12, status: "200 OK" },
      { path: "/blog", pageType: "Blog Index", title: "Acme Cloud Engineering Insights", wordCount: 310, internalLinks: 15, status: "200 OK" },
      { path: "/contact", pageType: "Contact", title: "Contact Sales & Support", wordCount: 180, internalLinks: 5, status: "200 OK" }
    ],
    navigationHierarchy: [
      { name: "Home (/) ", children: [] },
      { name: "Product (/features)", children: [{ name: "Automated Deployment" }, { name: "Cost Governance" }, { name: "Security Shields" }] },
      { name: "Solutions (/solutions)", children: [{ name: "Enterprise SaaS" }, { name: "FinTech Compliance" }] },
      { name: "Pricing (/pricing)", children: [] },
      { name: "Resources (/blog)", children: [{ name: "Case Studies" }, { name: "Documentation" }] }
    ],
    gapAnalysis: {
      businessAlignment: {
        finding: "Primary homepage headline relies on generic tech buzzwords ('Next-Gen Cloud') rather than stating quantifiable cost or security outcomes.",
        severity: "high",
        whyItMatters: "VP Infrastructure buyers bounce within 5 seconds if category differentiation and specific value metrics are missing."
      },
      contentAnalysis: {
        finding: "Missing dedicated ROI calculator and comparison landing pages against AWS Native or Azure Cost Management.",
        severity: "medium",
        whyItMatters: "High-intent buyers in decision stages require side-by-side comparison tables before initiating demo calls."
      },
      seoAnalysis: {
        finding: "H2 headings lack primary search intent queries ('multi-cloud cost governance', 'automated egress policy').",
        severity: "medium",
        whyItMatters: "Limits organic search visibility for transactional mid-funnel buyer searches."
      },
      conversionAnalysis: {
        finding: "Primary 'Get Started' hero CTA redirects to an unoptimized 6-field registration form with zero trust badges or customer logos.",
        severity: "high",
        whyItMatters: "Excessive initial form friction causes a 34% drop-off rate on high-intent referral traffic."
      },
      userExperience: {
        finding: "Global navigation menu collapses on desktop viewports under 1280px; footer link density is overly crowded.",
        severity: "low",
        whyItMatters: "Creates subtle visual friction for enterprise users reviewing documentation on tablet or laptop screens."
      }
    },
    scoringBreakdown: {
      overall: 68,
      categories: [
        { name: "Business Alignment", score: 62 },
        { name: "Technical Quality", score: 84 },
        { name: "SEO Optimization", score: 71 },
        { name: "Content Quality", score: 65 },
        { name: "User Experience", score: 76 },
        { name: "Conversion Readiness", score: 58 }
      ]
    },
    recommendations: [
      {
        id: "r-101",
        title: "Rewrite Hero Value Proposition for Specificity",
        category: "Business Alignment",
        severity: "high",
        impact: "High (+18% CVR)",
        effort: "Low (1-2 Days)",
        details: "Replace 'Next-Gen Cloud Solutions' with 'Automated Multi-Cloud Cost & Egress Governance for Enterprise Infra Teams'."
      },
      {
        id: "r-102",
        title: "Redesign Hero CTA to 2-Step Micro-Form",
        category: "Conversion Readiness",
        severity: "high",
        impact: "High (+24% CVR)",
        effort: "Medium (3-5 Days)",
        details: "Replace 6-field form wall with email-first input + G2 Crowd / SOC2 compliance badges."
      },
      {
        id: "r-103",
        title: "Publish Competitor Comparison Matrix Pages",
        category: "Content Quality",
        severity: "medium",
        impact: "Medium (+14% Organic Traffic)",
        effort: "Medium (1 Week)",
        details: "Create dedicated /compare/aws-cost-explorer and /compare/datadog-cloud-costs landing pages."
      },
      {
        id: "r-104",
        title: "Inject Transactional Keywords into H2 Tags",
        category: "SEO Optimization",
        severity: "medium",
        impact: "Medium (+12% Organic Traffic)",
        effort: "Low (1-2 Days)",
        details: "Update feature page headings with 'Egress Policy-as-Code' and 'Automated FinOps Remediation'."
      }
    ],
    roadmap: {
      now: [
        { title: "Hero headline & messaging rewrite", category: "Messaging", effort: "Quick Win" },
        { title: "CTA button redesign with SOC2 trust badges", category: "Conversion", effort: "Quick Win" }
      ],
      next: [
        { title: "Deploy competitor comparison landing pages", category: "Content", effort: "1-2 Weeks" },
        { title: "SEO H2 heading keyword optimization", category: "SEO", effort: "1 Week" }
      ],
      later: [
        { title: "Build interactive multi-cloud ROI calculator", category: "UX / Interactive", effort: "3-4 Weeks" },
        { title: "Refactor global navigation layout for desktop viewports", category: "UX", effort: "2 Weeks" }
      ]
    }
  },
  {
    id: "ana-4012",
    domain: "apex-manufacturing.com",
    companyName: "Apex Smart Manufacturing Systems",
    industry: "Manufacturing",
    url: "https://apex-manufacturing.com",
    status: "completed",
    createdAt: "2026-07-27T10:15:00Z",
    healthScore: 84,
    agents: [
      { id: "w-agent-1", name: "Website Structure & Inventory", role: "DOM & Sitemap Crawler", status: "completed", progress: 100 },
      { id: "w-agent-2", name: "Business Gap Analysis", role: "Messaging & Content Auditor", status: "completed", progress: 100 },
      { id: "w-agent-3", name: "Recommendation & Scoring Engine", role: "Roadmap & Score Calculator", status: "completed", progress: 100 }
    ],
    technicalOverview: {
      pagesDiscovered: 68,
      maxDepth: 3,
      sitemapFound: "Yes (sitemap.xml)",
      avgLoadTime: "1.15s"
    },
    pageInventory: [
      { path: "/", pageType: "Homepage", title: "Apex Smart Manufacturing | SCADA AI", wordCount: 1240, internalLinks: 32, status: "200 OK" },
      { path: "/solutions/predictive-maintenance", pageType: "Solution", title: "Predictive Maintenance AI Telemetry", wordCount: 1450, internalLinks: 22, status: "200 OK" }
    ],
    navigationHierarchy: [
      { name: "Home (/) ", children: [] },
      { name: "Solutions (/solutions)", children: [{ name: "Predictive Maintenance" }, { name: "Quality Control" }] }
    ],
    gapAnalysis: {
      businessAlignment: {
        finding: "Strong messaging clarity around Industry 4.0; minor gap in explicit ROI guarantees.",
        severity: "low",
        whyItMatters: "Adding guaranteed downtime reduction percentages boosts enterprise buyer trust."
      },
      contentAnalysis: {
        finding: "Missing video walk-throughs of physical sensor hardware setup on PLC cabinets.",
        severity: "medium",
        whyItMatters: "Plant managers want to see hardware setup simplicity before booking on-site pilots."
      },
      seoAnalysis: {
        finding: "Excellent keyword coverage across SCADA and industrial IoT terms.",
        severity: "low",
        whyItMatters: "Site ranks on Page 1 for 'industrial anomaly detection'."
      },
      conversionAnalysis: {
        finding: "Clear demo request forms backed by automotive client logos.",
        severity: "low",
        whyItMatters: "High conversion efficiency."
      },
      userExperience: {
        finding: "Fast page speeds and clear visual hierarchy across desktop and mobile.",
        severity: "low",
        whyItMatters: "Minimal UX friction."
      }
    },
    scoringBreakdown: {
      overall: 84,
      categories: [
        { name: "Business Alignment", score: 86 },
        { name: "Technical Quality", score: 92 },
        { name: "SEO Optimization", score: 88 },
        { name: "Content Quality", score: 81 },
        { name: "User Experience", score: 85 },
        { name: "Conversion Readiness", score: 79 }
      ]
    },
    recommendations: [
      {
        id: "r-201",
        title: "Embed 90-Second PLC Hardware Installation Video",
        category: "Content Quality",
        severity: "medium",
        impact: "Medium (+15% Engagement)",
        effort: "Low (3-4 Days)",
        details: "Add video modal showing non-invasive sensor attachment to Allen-Bradley control cabinet."
      }
    ],
    roadmap: {
      now: [{ title: "Hardware video embedding on solution page", category: "Content", effort: "3 Days" }],
      next: [{ title: "Interactive plant ROI calculator deployment", category: "Interactive", effort: "2 Weeks" }],
      later: [{ title: "Expand multilingual support for EU factories", category: "Localization", effort: "4 Weeks" }]
    }
  },
  {
    id: "ana-4013",
    domain: "medvantage-health.io",
    companyName: "MedVantage Health IT Solutions",
    industry: "Healthcare IT",
    url: "https://medvantage-health.io",
    status: "completed",
    createdAt: "2026-07-24T14:30:00Z",
    healthScore: 42,
    agents: [
      { id: "w-agent-1", name: "Website Structure & Inventory", role: "DOM & Sitemap Crawler", status: "completed", progress: 100 },
      { id: "w-agent-2", name: "Business Gap Analysis", role: "Messaging & Content Auditor", status: "completed", progress: 100 },
      { id: "w-agent-3", name: "Recommendation & Scoring Engine", role: "Roadmap & Score Calculator", status: "completed", progress: 100 }
    ],
    technicalOverview: {
      pagesDiscovered: 19,
      maxDepth: 5,
      sitemapFound: "No (Missing)",
      avgLoadTime: "3.10s"
    },
    pageInventory: [
      { path: "/", pageType: "Homepage", title: "MedVantage Healthcare Systems", wordCount: 320, internalLinks: 8, status: "200 OK" }
    ],
    navigationHierarchy: [
      { name: "Home (/) ", children: [] },
      { name: "About Us (/about)", children: [] }
    ],
    gapAnalysis: {
      businessAlignment: {
        finding: "Vague positioning; fails to clarify HIPAA compliance or EHR integration capabilities.",
        severity: "high",
        whyItMatters: "Healthcare executives immediately exit sites without explicit compliance validation."
      },
      contentAnalysis: {
        finding: "Extremely thin content across all pages (under 400 words avg); missing blog and case studies.",
        severity: "high",
        whyItMatters: "Zero organic authority or educational value for prospective clinic buyers."
      },
      seoAnalysis: {
        finding: "Missing meta descriptions, missing sitemap.xml, and duplicate H1 tags.",
        severity: "high",
        whyItMatters: "Search engines fail to index key product subpages."
      },
      conversionAnalysis: {
        finding: "Broken contact form; no clear CTA above the fold on homepage.",
        severity: "high",
        whyItMatters: "100% lead leakage on visitors attempting to reach sales."
      },
      userExperience: {
        finding: "Slow page load (3.1s), unoptimized heavy PNG images, mobile layout breaking.",
        severity: "medium",
        whyItMatters: "Frustrating user experience for hospital IT buyers."
      }
    },
    scoringBreakdown: {
      overall: 42,
      categories: [
        { name: "Business Alignment", score: 38 },
        { name: "Technical Quality", score: 45 },
        { name: "SEO Optimization", score: 32 },
        { name: "Content Quality", score: 35 },
        { name: "User Experience", score: 50 },
        { name: "Conversion Readiness", score: 28 }
      ]
    },
    recommendations: [
      {
        id: "r-301",
        title: "Fix Broken Contact Form & Add Lead Gateway",
        category: "Conversion Readiness",
        severity: "high",
        impact: "Critical (+100% Form Submissions)",
        effort: "Immediate (1 Day)",
        details: "Repair broken mail script and implement HubSpot CRM form endpoint."
      },
      {
        id: "r-302",
        title: "Generate XML Sitemap & Add Meta Tags",
        category: "SEO Optimization",
        severity: "high",
        impact: "High (+40% Indexed Pages)",
        effort: "Low (1-2 Days)",
        details: "Create sitemap.xml and add unique title/meta descriptions to all 19 pages."
      }
    ],
    roadmap: {
      now: [{ title: "Emergency fix for contact form script", category: "Conversion", effort: "1 Day" }],
      next: [{ title: "Publish XML sitemap & fix SEO meta tags", category: "SEO", effort: "3 Days" }],
      later: [{ title: "Complete website redesign with HIPAA proof points", category: "Redesign", effort: "4 Weeks" }]
    }
  },
  {
    id: "ana-4014",
    domain: "secureflow-cyber.com",
    companyName: "SecureFlow Cyber Defense",
    industry: "Cybersecurity",
    url: "https://secureflow-cyber.com",
    status: "completed",
    createdAt: "2026-07-21T18:20:00Z",
    healthScore: 79,
    agents: [
      { id: "w-agent-1", name: "Website Structure & Inventory", role: "DOM & Sitemap Crawler", status: "completed", progress: 100 },
      { id: "w-agent-2", name: "Business Gap Analysis", role: "Messaging & Content Auditor", status: "completed", progress: 100 },
      { id: "w-agent-3", name: "Recommendation & Scoring Engine", role: "Roadmap & Score Calculator", status: "completed", progress: 100 }
    ],
    technicalOverview: {
      pagesDiscovered: 54,
      maxDepth: 3,
      sitemapFound: "Yes (sitemap.xml)",
      avgLoadTime: "1.28s"
    },
    pageInventory: [
      { path: "/", pageType: "Homepage", title: "SecureFlow | Continuous SOC Threat Telemetry", wordCount: 1100, internalLinks: 28, status: "200 OK" }
    ],
    navigationHierarchy: [
      { name: "Home (/) ", children: [] },
      { name: "Platform (/platform)", children: [] }
    ],
    gapAnalysis: {
      businessAlignment: { finding: "Clear CISO messaging; high trust factor.", severity: "low", whyItMatters: "Establishes immediate credibility." },
      contentAnalysis: { finding: "Missing whitepapers on zero-trust cloud architecture.", severity: "medium", whyItMatters: "Needed for technical enterprise evaluation." },
      seoAnalysis: { finding: "Strong keyword coverage for SOC automation.", severity: "low", whyItMatters: "Good organic positioning." },
      conversionAnalysis: { finding: "Demo button is clear but requires too many mandatory fields.", severity: "medium", whyItMatters: "Slight friction." },
      userExperience: { finding: "Clean dark mode styling with high readability.", severity: "low", whyItMatters: "High visual polish." }
    },
    scoringBreakdown: {
      overall: 79,
      categories: [
        { name: "Business Alignment", score: 82 },
        { name: "Technical Quality", score: 88 },
        { name: "SEO Optimization", score: 80 },
        { name: "Content Quality", score: 74 },
        { name: "User Experience", score: 83 },
        { name: "Conversion Readiness", score: 68 }
      ]
    },
    recommendations: [
      {
        id: "r-401",
        title: "Shorten Demo Form from 8 to 3 Fields",
        category: "Conversion Readiness",
        severity: "medium",
        impact: "Medium (+16% CVR)",
        effort: "Low (1 Day)",
        details: "Remove phone number and company address fields from initial demo request modal."
      }
    ],
    roadmap: {
      now: [{ title: "Form field reduction for demo CTA", category: "Conversion", effort: "1 Day" }],
      next: [{ title: "Publish Zero-Trust Architecture Whitepaper", category: "Content", effort: "1 Week" }],
      later: [{ title: "Interactive Threat Matrix Sandbox", category: "Interactive", effort: "3 Weeks" }]
    }
  },
  {
    id: "ana-4015",
    domain: "finverse-pay.com",
    companyName: "FinVerse Autonomous Payment Gateway",
    industry: "FinTech",
    url: "https://finverse-pay.com",
    status: "analyzing",
    createdAt: "2026-07-29T10:00:00Z",
    healthScore: null,
    agents: [
      { id: "w-agent-1", name: "Website Structure & Inventory", role: "DOM & Sitemap Crawler", status: "completed", progress: 100 },
      { id: "w-agent-2", name: "Business Gap Analysis", role: "Messaging & Content Auditor", status: "running", progress: 45 },
      { id: "w-agent-3", name: "Recommendation & Scoring Engine", role: "Roadmap & Score Calculator", status: "queued", progress: 0 }
    ],
    technicalOverview: {
      pagesDiscovered: 31,
      maxDepth: 3,
      sitemapFound: "Yes (sitemap.xml)",
      avgLoadTime: "1.35s"
    },
    pageInventory: [
      { path: "/", pageType: "Homepage", title: "FinVerse Payment Infrastructure", wordCount: 950, internalLinks: 20, status: "200 OK" }
    ],
    navigationHierarchy: [{ name: "Home (/) ", children: [] }],
    gapAnalysis: null,
    scoringBreakdown: null,
    recommendations: [],
    roadmap: null
  }
];
