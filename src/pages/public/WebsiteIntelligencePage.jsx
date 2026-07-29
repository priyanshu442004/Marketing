import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { WebsiteAuditPreview } from "../../components/public/ProductPreview";
import { Globe, CheckCircle2, ArrowRight, Layers, AlertTriangle, BarChart2 } from "lucide-react";

export function WebsiteIntelligencePage() {
  const navigate = useNavigate();

  const websiteAgents = [
    {
      num: "01",
      name: "Website Structure Agent",
      role: "DOM Crawl & Page Inventory",
      desc: "Discovers all site pages, records technical load metrics, builds site navigation hierarchy trees, and checks internal link depth.",
    },
    {
      num: "02",
      name: "Business Gap Analysis Agent",
      role: "5-Area Business & Messaging Audit",
      desc: "Compares business context inputs against extracted DOM content to find gaps in messaging, content depth, SEO, conversion CTAs, and UX.",
    },
    {
      num: "03",
      name: "Recommendation & Scoring Agent",
      role: "0-100 Health Score & Phased Roadmap",
      desc: "Calculates overall & category-wise health scores, prioritizes recommendations by impact/effort, and outputs a phased Now/Next/Later execution roadmap.",
    },
  ];

  const gapAreas = [
    { name: "1. Business & Messaging Alignment", desc: "Evaluates if products, services, and target audience messaging are clearly highlighted on primary landing pages." },
    { name: "2. Content Depth & Coverage", desc: "Identifies missing subpages, weak blogs, absent case studies, and missing product documentation." },
    { name: "3. SEO & SERP Optimization", desc: "Audits heading tags, meta titles, target search intent, and internal linking structure." },
    { name: "4. Conversion Readiness & CTAs", desc: "Checks demo form friction, CTA placement, trust badges, and social proof visibility." },
    { name: "5. User Experience & Architecture", desc: "Evaluates navigation clarity, mobile responsiveness, readability, and page layout density." },
  ];

  const deliverablesList = [
    "Website Structure Report",
    "Business Gap Analysis",
    "Website Health Score (0-100)",
    "Category-wise Scorecard",
    "SEO Audit Report",
    "Content Audit Report",
    "Conversion Audit Report",
    "Prioritized Recommendations",
    "Website Improvement Roadmap"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left font-sans">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2">
          <Badge variant="neutral">Module 2</Badge>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Website Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Comprehensive AI-Powered Website Assessment & Gap Analysis
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Combine website DOM crawl telemetry with strategic business context to surface high-converting messaging and SEO opportunities.
        </p>
      </div>

      {/* 3 Agents Walkthrough */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-ink tracking-tight">3 Architectural & Audit Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {websiteAgents.map((a) => (
            <Card key={a.num} className="p-5 space-y-3 bg-surface border-border">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-mono text-xs font-bold text-accent">{a.num}</span>
                <span className="text-[10px] font-mono text-ink-subtle">{a.role}</span>
              </div>
              <h3 className="text-xs font-bold text-ink">{a.name}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{a.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 5 Gap Areas Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-ink tracking-tight">The 5-Area Business Audit Framework</h2>
          <p className="text-xs text-ink-muted">Every website analysis checks 5 distinct dimensions of business readiness.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gapAreas.map((area, i) => (
            <Card key={i} className="p-4 bg-surface border-border space-y-1.5">
              <h3 className="text-xs font-bold text-ink">{area.name}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{area.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Preview UI */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">Audit & Scorecard Preview</h2>
        <WebsiteAuditPreview />
      </div>

      {/* 9 Deliverables Grid */}
      <Card className="p-6 bg-raise border-border space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">Module 2 Deliverables</span>
          <h3 className="text-lg font-bold text-ink">9 Audit Deliverable Packages</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {deliverablesList.map((item, i) => (
            <div key={i} className="p-3 bg-surface rounded border border-border flex items-center gap-2 text-xs font-medium text-ink">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between p-6 bg-surface rounded-card border border-border">
        <div>
          <h3 className="text-base font-bold text-ink">Audit your website health today</h3>
          <p className="text-xs text-ink-muted">Get a full 5-area gap analysis report in 60 seconds.</p>
        </div>
        <Button variant="primary" icon={ArrowRight} onClick={() => navigate("/demo")}>
          Book a demo
        </Button>
      </div>
    </div>
  );
}
