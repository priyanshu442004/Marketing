import React, { createContext, useContext, useState, useEffect } from "react";
import { initialRuns, initialAnalyses, initialNotifications, MARKETING_AGENTS_DEFINITION, WEBSITE_AGENTS_DEFINITION } from "../mock/initialData";

const AppContext = createContext(null);

const STORAGE_KEY_RUNS = "everline_demo_runs_v3";
const STORAGE_KEY_ANALYSES = "everline_demo_analyses_v3";

export function AppProvider({ children }) {
  const [runs, setRuns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RUNS);
    return saved ? JSON.parse(saved) : initialRuns;
  });

  const [analyses, setAnalyses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ANALYSES);
    return saved ? JSON.parse(saved) : initialAnalyses;
  });

  const [notifications, setNotifications] = useState(initialNotifications);

  const [user, setUser] = useState({
    name: "Alex Vance",
    email: "alex.vance@everline.ai",
    role: "Head of Marketing Operations",
    avatar: null,
    company: "Everline Marketing Inc.",
    plan: "Enterprise Suite",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RUNS, JSON.stringify(runs));
  }, [runs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ANALYSES, JSON.stringify(analyses));
  }, [analyses]);

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY_RUNS);
    localStorage.removeItem(STORAGE_KEY_ANALYSES);
    setRuns(initialRuns);
    setAnalyses(initialAnalyses);
    setNotifications(initialNotifications);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const updateAssetStatus = (runId, assetId, status) => {
    setRuns((prevRuns) =>
      prevRuns.map((run) => {
        if (run.id !== runId) return run;

        const updatedOutputs = { ...run.outputs };

        if (updatedOutputs.blogPost && updatedOutputs.blogPost.id === assetId) {
          updatedOutputs.blogPost = { ...updatedOutputs.blogPost, status };
        }

        if (updatedOutputs.landingPage && updatedOutputs.landingPage.id === assetId) {
          updatedOutputs.landingPage = { ...updatedOutputs.landingPage, status };
        }

        if (updatedOutputs.whitepaper && updatedOutputs.whitepaper.id === assetId) {
          updatedOutputs.whitepaper = { ...updatedOutputs.whitepaper, status };
        }

        if (updatedOutputs.newsletter && updatedOutputs.newsletter.id === assetId) {
          updatedOutputs.newsletter = { ...updatedOutputs.newsletter, status };
        }

        if (updatedOutputs.caseStudy && updatedOutputs.caseStudy.id === assetId) {
          updatedOutputs.caseStudy = { ...updatedOutputs.caseStudy, status };
        }

        if (updatedOutputs.linkedinPosts) {
          updatedOutputs.linkedinPosts = updatedOutputs.linkedinPosts.map((item) =>
            item.id === assetId ? { ...item, status } : item
          );
        }

        if (updatedOutputs.emailSequence) {
          updatedOutputs.emailSequence = updatedOutputs.emailSequence.map((item) =>
            item.id === assetId ? { ...item, status } : item
          );
        }

        if (updatedOutputs.adVariants) {
          updatedOutputs.adVariants = updatedOutputs.adVariants.map((item) =>
            item.id === assetId ? { ...item, status } : item
          );
        }

        if (updatedOutputs.creativeAssets) {
          updatedOutputs.creativeAssets = updatedOutputs.creativeAssets.map((item) =>
            item.id === assetId ? { ...item, status } : item
          );
        }

        return { ...run, outputs: updatedOutputs };
      })
    );
  };

  const createRun = (formData) => {
    const runId = `RUN-${Math.floor(2500 + Math.random() * 5000)}`;
    const topicTitle = formData.topic || `${formData.industry} Strategic Intelligence Run`;
    
    const newAgents = MARKETING_AGENTS_DEFINITION.map((def, idx) => ({
      ...def,
      status: idx === 0 ? "running" : "queued",
      progress: idx === 0 ? 25 : 0
    }));

    const newRun = {
      id: runId,
      title: topicTitle,
      topic: formData.topic || `Market Analysis in ${formData.industry}`,
      source: formData.source || "Manual",
      industry: formData.industry || "Enterprise SaaS",
      objective: formData.objective || "Generate Leads",
      targetAudience: formData.targetAudience || "VP Engineering & Operations",
      status: "running",
      overallProgress: 10,
      createdAt: new Date().toISOString(),
      completedAt: null,
      agents: newAgents,
      logs: [
        `${new Date().toLocaleTimeString()} [Supervisor] Initialized 10-agent autonomous marketing pipeline.`
      ],
      summary: null,
      agentData: {
        trendIdentification: {
          kpis: { totalKeywords: 32, avgVolume: "18.5K", topRising: `${formData.topic || formData.industry} AI` },
          keywords: [
            { keyword: `${formData.topic || formData.industry} optimization`, volume: "16,400", trend: "up", difficulty: "Medium (41/100)", sparkline: [10, 25, 45, 60, 75, 90] },
            { keyword: `autonomous ${formData.industry.toLowerCase()} workflows`, volume: "9,800", trend: "up", difficulty: "Low (29/100)", sparkline: [15, 30, 42, 58, 70, 85] }
          ],
          hashtags: [`#${formData.industry.replace(/\s+/g, '')}`, "#AIOperations", "#EnterpriseAutomation"],
          questions: [
            `What is the primary ROI driver for ${formData.topic || formData.industry}?`,
            `How do leading teams mitigate implementation risk?`
          ],
          seasonalCallout: "Q3 Fiscal Planning Window: Strategic decision-makers reviewing automation budgets."
        },
        research: {
          brief: `Comprehensive market analysis for ${formData.industry}. Buyer intent remains focused on measurable efficiency and compliance guardrails.`,
          painPoints: [
            { title: "Operational Overhead", description: "Manual processes slowing down campaign execution." },
            { title: "Compliance Drift", description: "Difficulty maintaining policy consistency across channels." }
          ],
          technologies: [
            { name: "Autonomous Telemetry", desc: "Real-time performance tracking and alert triggers." }
          ],
          news: [
            { headline: `${formData.industry} Sector Embraces Autonomous Agentic Workflows`, source: "Industry Tech Insights", date: "2026-07-28" }
          ]
        },
        competitiveIntelligence: {
          competitors: [
            { name: "Apex Solutions", positioning: "Traditional static dashboard", strengths: "Established user base", cadence: "Monthly blog", seoFocus: "General SaaS" },
            { name: "Vanguard Tech", positioning: "Manual consultancy model", strengths: "High touch support", cadence: "Quarterly reports", seoFocus: "Consulting" }
          ],
          gaps: ["Rivals lack continuous real-time multi-agent execution capabilities."],
          angles: [{ title: "Autonomous Speed & Precision", desc: "Deliver end-to-end strategy in minutes rather than weeks." }]
        },
        contextMerger: {
          title: `Master Context Brief: ${topicTitle}`,
          takeaways: ["Focus messaging on speed, governance, and measurable ROI."],
          thesis: `By leveraging autonomous multi-agent pipelines, ${formData.industry} organizations outperform traditional manual marketing workflows.`
        },
        contentStrategy: {
          types: ["Blog Post", "LinkedIn Post", "Email Sequence", "Ad Variants", "Architecture Diagram"],
          objective: formData.objective || "Generate Leads",
          audience: formData.targetAudience || "Enterprise Decision Makers",
          communicationStyle: "Authoritative, data-backed, concise",
          channels: [{ channel: "LinkedIn", format: "Executive Insights", frequency: "3x / week" }]
        },
        contentPlanning: [
          { id: `cp-${Math.floor(100+Math.random()*900)}`, title: `Navigating ${formData.topic || formData.industry} in 2026`, channel: "Blog", date: "2026-08-05", time: "10:00 AM", status: "scheduled" }
        ],
        seo: {
          keywords: [{ keyword: `${formData.topic || formData.industry} guide`, intent: "Transactional", volume: "14,200", difficulty: "38/100" }],
          serpPreview: {
            title: `${topicTitle} | Everline Platform`,
            url: `https://everline.ai/solutions/${formData.industry.toLowerCase().replace(/\s+/g, '-')}`,
            description: `Accelerate enterprise growth with Everline's autonomous agent pipeline. Request an operational demo today.`
          },
          searchIntentSummary: "High commercial intent with focus on automated execution.",
          internalLinks: [{ from: "/blog/overview", to: "/solutions/main" }],
          faqs: ["How quickly can we deploy Everline agent pipelines?"]
        }
      },
      outputs: {
        blogPost: {
          id: `asset-${Math.floor(100 + Math.random() * 900)}`,
          title: `Executive Playbook: ${topicTitle}`,
          readTime: "5 min read",
          status: "pending",
          content: `### Industry Overview\nIn today's fast-moving environment, scaling ${formData.industry} operations demands continuous real-time intelligence.\n\n### Core Execution Strategy\n1. Deploy autonomous agent pipelines for market telemetry.\n2. Streamline multi-channel asset review and approval.`
        },
        linkedinPosts: [
          {
            id: `asset-${Math.floor(100 + Math.random() * 900)}`,
            type: "Executive Insight",
            status: "pending",
            content: `How are leading ${formData.industry} teams approaching ${formData.topic || 'growth'} this year?\n\nKey takeaways:\n• Move from static planning to continuous multi-agent execution.\n• Reduce review cycles by 60% with unified approvals.\n\nRead our complete analysis 👇`
          }
        ],
        emailSequence: [
          {
            id: `asset-${Math.floor(100 + Math.random() * 900)}`,
            step: 1,
            subject: `Optimizing ${formData.industry} strategy for enterprise teams`,
            preview: "Autonomous multi-agent execution framework...",
            status: "pending",
            body: `Hi {{firstName}},\n\nReaching out because leadership in ${formData.industry} frequently faces bottlenecks in strategy execution.\n\nEverline automates market research, strategy, and asset generation in one unified pipeline.\n\nWould 10 minutes next Tuesday be worth a quick look?`
          }
        ],
        adVariants: [
          {
            id: `asset-${Math.floor(100 + Math.random() * 900)}`,
            headline: `Autonomous ${formData.industry} Growth`,
            body: `Deploy 10 specialized AI agents to generate market strategy and ready-to-publish assets.`,
            status: "pending"
          }
        ],
        creativeAssets: [
          {
            id: `asset-${Math.floor(100 + Math.random() * 900)}`,
            title: `${formData.industry} Multi-Agent Architecture`,
            type: "Architecture Diagram",
            dimensions: "1920x1080 SVG",
            status: "pending"
          }
        ]
      }
    };

    setRuns((prev) => [newRun, ...prev]);

    let currentAgentIdx = 0;
    const interval = setInterval(() => {
      setRuns((prevRuns) =>
        prevRuns.map((r) => {
          if (r.id !== runId) return r;

          const agents = [...r.agents];
          const logs = [...r.logs];

          if (currentAgentIdx < 10) {
            agents[currentAgentIdx].progress += 50;

            if (agents[currentAgentIdx].progress >= 100) {
              agents[currentAgentIdx].progress = 100;
              agents[currentAgentIdx].status = "completed";
              
              logs.push(
                `${new Date().toLocaleTimeString()} [${agents[currentAgentIdx].name}] Step completed successfully.`
              );

              currentAgentIdx++;
              if (currentAgentIdx < 10) {
                agents[currentAgentIdx].status = "running";
                agents[currentAgentIdx].progress = 25;
              }
            }
          }

          const overallProgress = Math.min(100, Math.round((currentAgentIdx / 10) * 100));

          if (currentAgentIdx >= 10 && r.status === "running") {
            clearInterval(interval);
            logs.push(`${new Date().toLocaleTimeString()} [Supervisor] All 10 agents completed execution successfully.`);
            return {
              ...r,
              status: "completed",
              overallProgress: 100,
              completedAt: new Date().toISOString(),
              agents,
              logs
            };
          }

          return { ...r, agents, overallProgress, logs };
        })
      );
    }, 1000);

    return runId;
  };

  const createAnalysis = (formData) => {
    const analysisId = `ana-${Math.floor(4000 + Math.random() * 5000)}`;
    let domainStr = formData.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!domainStr) domainStr = "example.com";

    const company = formData.companyName || domainStr.split('.')[0].toUpperCase() + " Corp";

    const newAnalysis = {
      id: analysisId,
      url: formData.url,
      domain: domainStr,
      companyName: company,
      industry: formData.industry || "Enterprise SaaS",
      status: "analyzing",
      createdAt: new Date().toISOString(),
      healthScore: null,
      agents: WEBSITE_AGENTS_DEFINITION.map((a, idx) => ({
        ...a,
        status: idx === 0 ? "running" : "queued",
        progress: idx === 0 ? 30 : 0
      })),
      technicalOverview: {
        pagesDiscovered: 48,
        maxDepth: 4,
        sitemapFound: "Yes (sitemap.xml)",
        avgLoadTime: "1.25s"
      },
      pageInventory: [
        { path: "/", pageType: "Homepage", title: `${company} | Homepage`, wordCount: 920, internalLinks: 24, status: "200 OK" },
        { path: "/products", pageType: "Products", title: `${company} Solutions`, wordCount: 1100, internalLinks: 18, status: "200 OK" },
        { path: "/pricing", pageType: "Pricing", title: `Pricing & Plans`, wordCount: 540, internalLinks: 10, status: "200 OK" },
        { path: "/about", pageType: "About", title: `About ${company}`, wordCount: 420, internalLinks: 8, status: "200 OK" },
        { path: "/contact", pageType: "Contact", title: `Contact Us`, wordCount: 210, internalLinks: 4, status: "200 OK" }
      ],
      navigationHierarchy: [
        { name: "Home (/) ", children: [] },
        { name: "Products (/products)", children: [{ name: "Core Suite" }, { name: "Analytics" }] },
        { name: "Pricing (/pricing)", children: [] }
      ],
      gapAnalysis: null,
      scoringBreakdown: null,
      recommendations: [],
      roadmap: null
    };

    setAnalyses((prev) => [newAnalysis, ...prev]);

    // Simulate 3-agent progression over 6s
    let agentStep = 0;
    const interval = setInterval(() => {
      setAnalyses((prevAnalyses) =>
        prevAnalyses.map((item) => {
          if (item.id !== analysisId) return item;

          const agents = [...item.agents];

          if (agentStep < 3) {
            agents[agentStep].progress += 50;

            if (agents[agentStep].progress >= 100) {
              agents[agentStep].progress = 100;
              agents[agentStep].status = "completed";

              agentStep++;
              if (agentStep < 3) {
                agents[agentStep].status = "running";
                agents[agentStep].progress = 30;
              }
            }
          }

          if (agentStep >= 3) {
            clearInterval(interval);
            return {
              ...item,
              status: "completed",
              healthScore: 74,
              agents: agents.map((a) => ({ ...a, status: "completed", progress: 100 })),
              gapAnalysis: {
                businessAlignment: {
                  finding: `Homepage headline lacks specific category differentiation for target ${formData.industry} buyers.`,
                  severity: "high",
                  whyItMatters: "High bounce rate within the first 5 seconds of visitor landing."
                },
                contentAnalysis: {
                  finding: "Missing dedicated customer case studies and interactive product walk-through.",
                  severity: "medium",
                  whyItMatters: "Buyers require proof of ROI before requesting sales meetings."
                },
                seoAnalysis: {
                  finding: "H2 headings miss primary transactional search terms.",
                  severity: "medium",
                  whyItMatters: "Limits organic search rankings on intent-driven queries."
                },
                conversionAnalysis: {
                  finding: "Hero CTA button leads directly to lengthy form without social proof badges.",
                  severity: "high",
                  whyItMatters: "Causes conversion drop-off on paid and referral traffic."
                },
                userExperience: {
                  finding: "Mobile navigation menu takes over 2 seconds to render smoothly.",
                  severity: "low",
                  whyItMatters: "Slight visual friction for mobile decision makers."
                }
              },
              scoringBreakdown: {
                overall: 74,
                categories: [
                  { name: "Business Alignment", score: 70 },
                  { name: "Technical Quality", score: 86 },
                  { name: "SEO Optimization", score: 72 },
                  { name: "Content Quality", score: 68 },
                  { name: "User Experience", score: 80 },
                  { name: "Conversion Readiness", score: 65 }
                ]
              },
              recommendations: [
                {
                  id: "rec-new-1",
                  title: "Refactor Hero Value Proposition for Specificity",
                  category: "Business Alignment",
                  severity: "high",
                  impact: "High (+20% CVR)",
                  effort: "Low (1-2 Days)",
                  details: `Update headline to highlight quantifiable ROI for ${formData.industry} buyers.`
                },
                {
                  id: "rec-new-2",
                  title: "Simplify Demo Request Form to 3 Input Fields",
                  category: "Conversion Readiness",
                  severity: "high",
                  impact: "High (+25% CVR)",
                  effort: "Medium (3 Days)",
                  details: "Remove unnecessary fields and embed trust badges below button."
                }
              ],
              roadmap: {
                now: [{ title: "Hero value proposition rewrite", category: "Messaging", effort: "2 Days" }],
                next: [{ title: "Deploy competitor comparison subpages", category: "Content", effort: "1 Week" }],
                later: [{ title: "Interactive ROI calculator component", category: "Interactive", effort: "3 Weeks" }]
              }
            };
          }

          return { ...item, agents };
        })
      );
    }, 1500);

    return analysisId;
  };

  const reRunAnalysis = (analysisId) => {
    setAnalyses((prev) =>
      prev.map((item) => {
        if (item.id !== analysisId) return item;
        return {
          ...item,
          status: "analyzing",
          agents: WEBSITE_AGENTS_DEFINITION.map((a, idx) => ({
            ...a,
            status: idx === 0 ? "running" : "queued",
            progress: idx === 0 ? 30 : 0
          }))
        };
      })
    );

    // Re-run simulation
    let agentStep = 0;
    const interval = setInterval(() => {
      setAnalyses((prevAnalyses) =>
        prevAnalyses.map((item) => {
          if (item.id !== analysisId) return item;

          const agents = [...item.agents];

          if (agentStep < 3) {
            agents[agentStep].progress += 50;

            if (agents[agentStep].progress >= 100) {
              agents[agentStep].progress = 100;
              agents[agentStep].status = "completed";

              agentStep++;
              if (agentStep < 3) {
                agents[agentStep].status = "running";
                agents[agentStep].progress = 30;
              }
            }
          }

          if (agentStep >= 3) {
            clearInterval(interval);
            return {
              ...item,
              status: "completed",
              healthScore: Math.min(95, (item.healthScore || 70) + 4),
              agents: agents.map((a) => ({ ...a, status: "completed", progress: 100 }))
            };
          }

          return { ...item, agents };
        })
      );
    }, 1200);
  };

  return (
    <AppContext.Provider
      value={{
        runs,
        analyses,
        notifications,
        user,
        setUser,
        createRun,
        createAnalysis,
        reRunAnalysis,
        updateAssetStatus,
        resetDemoData,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppProvider");
  }
  return context;
}
