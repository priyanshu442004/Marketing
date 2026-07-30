import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { TrendSeoPreview } from "../../components/public/ProductPreview";
import { Megaphone, CheckCircle2, ArrowRight, Radio, Target, Sparkles, Layers } from "lucide-react";

export function MarketingAgentPage() {
  const navigate = useNavigate();

  const agentsList = [
    {
      num: "01",
      name: "Marketing Supervisor Agent",
      role: "Orchestration & Workflow DAG",
      desc: "Manages step execution, dependency routing, and final context coordination across all downstream agents.",
      outputPreview: "Logs: [Supervisor] Initialized 10-agent pipeline. Context dependencies validated."
    },
    {
      num: "02",
      name: "Trend Identification Agent",
      role: "SERP & Social Signal Telemetry",
      desc: "Scrapes trending keywords, monthly search volume spikes, popular hashtags, and questions.",
      outputPreview: "Top Rising Cluster: 'predictive maintenance AI' (+142% volume over 90 days)."
    },
    {
      num: "03",
      name: "Research Agent",
      role: "Market & Audience Research",
      desc: "Analyzes customer pain points, emerging technologies, market reports, and industry news.",
      outputPreview: "Pain Point: Legacy SCADA lock-in causing false alarm fatigue across 68% of plant ops."
    },
    {
      num: "04",
      name: "Competitive Intelligence Agent",
      role: "Competitor Benchmarking",
      desc: "Scans competitor websites, blogs, LinkedIn, and ad messaging to uncover positioning gaps.",
      outputPreview: "Gap Identified: Rivals lack offline-first edge AI telemetry with instant PLC sync."
    },
    {
      num: "05",
      name: "Context Merger Agent",
      role: "Strategic Synthesis",
      desc: "Combines outputs from Trend, Research, and Competitive Intelligence into a unified strategic brief.",
      outputPreview: "Thesis: Position BrandSutra as the zero-downtime, offline-first edge AI maintenance platform."
    },
    {
      num: "06",
      name: "Content Strategy Agent",
      role: "Channel & Messaging Matrix",
      desc: "Determines optimal content types (Blogs, LinkedIn, Whitepapers, Emails) and communication style.",
      outputPreview: "Strategy: Engineering-grade tone for VP Operations across LinkedIn & Technical Whitepapers."
    },
    {
      num: "07",
      name: "Content Planning Agent",
      role: "Editorial Calendar & Schedule",
      desc: "Constructs 30-day publishing schedules, platform selections, and optimal publishing times.",
      outputPreview: "Schedule: 12 posts scheduled across Tuesdays & Thursdays at 09:00 AM EST."
    },
    {
      num: "08",
      name: "SEO Agent",
      role: "Keyword & SERP Optimization",
      desc: "Generates primary/secondary keyword intent tags, meta titles, descriptions, and FAQ clusters.",
      outputPreview: "Meta Title: 'Predictive Maintenance AI for Smart Manufacturing | BrandSutra'"
    },
    {
      num: "09",
      name: "Content Generation Agent",
      role: "Multi-Format Asset Copywriting",
      desc: "Drafts full long-form articles, LinkedIn posts, email sequences, whitepapers, and landing pages.",
      outputPreview: "Drafted: 1,200-word technical blog + 3 LinkedIn post variants + 3-step email nurture."
    },
    {
      num: "10",
      name: "Creative Generation Agent",
      role: "Visual Asset & Diagram Design",
      desc: "Produces architecture SVG flow diagrams, infographics, product demo specs, and ad creatives.",
      outputPreview: "Generated: Edge Telemetry SVG Architecture Flow + 1200x630 Ad Banner Creative."
    }
  ];

  const deliverables = [
    "Market Research Report",
    "Trend Analysis Report",
    "Competitive Intelligence Report",
    "Content Strategy Brief",
    "30-Day Publishing Calendar",
    "SEO & SERP Recommendations",
    "Multi-Format Copywriting Package",
    "Creative Visual Asset Package"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left font-sans">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2">
          <Badge variant="accent">Module 1</Badge>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">AI Marketing Agent</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Automate the Complete Marketing Lifecycle Across 10 Specialized Agents
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          From continuous RSS market signals to human-approved multi-format marketing assets.
        </p>
      </div>

      {/* Discovery Methods Walkthrough */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">Two Flexible Execution Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3 bg-surface border-border">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-semibold text-ink">Automated Market Monitoring</h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Continuously monitors RSS feed URLs, news feeds, and search trend clusters. When strategic opportunity score exceeds threshold (&gt;80), triggers the 10-agent pipeline automatically.
            </p>
          </Card>

          <Card className="p-6 space-y-3 bg-surface border-border">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-semibold text-ink">Manual Topic Research</h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Input a specific research topic, industry vertical, business objective, and target decision-makers to launch an immediate full-lifecycle research & asset creation run.
            </p>
          </Card>
        </div>
      </div>

      {/* 10 Agents Walkthrough */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-ink tracking-tight">The 10-Agent Pipeline Breakdown</h2>
          <p className="text-xs text-ink-muted">Each agent performs a distinct role in the marketing execution lifecycle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agentsList.map((agent) => (
            <Card key={agent.num} className="p-5 space-y-3 bg-surface border-border hover:border-accent/60 transition-colors">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent">{agent.num}</span>
                  <h3 className="text-xs font-bold text-ink">{agent.name}</h3>
                </div>
                <span className="text-[10px] font-mono text-ink-subtle">{agent.role}</span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">{agent.desc}</p>
              <div className="p-2.5 bg-raise rounded border border-border/80 text-[11px] font-mono text-ink leading-tight">
                <span className="text-[10px] uppercase text-accent font-semibold block mb-0.5">Sample Output</span>
                {agent.outputPreview}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Real Live Output Preview */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">Agent Telemetry Output Preview</h2>
        <TrendSeoPreview />
      </div>

      {/* 8 Deliverables Grid */}
      <Card className="p-6 bg-raise border-border space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">Module 1 Deliverables</span>
          <h3 className="text-lg font-bold text-ink">8 Mandatory Marketing Deliverables</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {deliverables.map((item, i) => (
            <div key={i} className="p-3 bg-surface rounded border border-border flex items-center gap-2 text-xs font-medium text-ink">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <div className="flex items-center justify-between p-6 bg-surface rounded-card border border-border">
        <div>
          <h3 className="text-base font-bold text-ink">Ready to run your first marketing workflow?</h3>
          <p className="text-xs text-ink-muted">Launch a 10-agent run in seconds.</p>
        </div>
        <Button variant="primary" icon={ArrowRight} onClick={() => navigate("/demo")}>
          Book a demo
        </Button>
      </div>
    </div>
  );
}
