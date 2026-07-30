import React from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { CheckCircle2, Cpu, Shield, Layers, Users } from "lucide-react";

export function AboutPage() {
  const team = [
    { name: "Dr. Aris Thorne", role: "Co-Founder & CEO", bg: "Former Principal AI Lead at Industrial Sensing Labs.", monogram: "AT" },
    { name: "Elena Vance", role: "Co-Founder & CTO", bg: "Architected distributed multi-agent systems at SCADA Systems.", monogram: "EV" },
    { name: "Marcus Rostova", role: "Head of Product", bg: "Led enterprise SaaS growth teams across 12 product launches.", monogram: "MR" },
    { name: "Sarah Lin", role: "Head of AI Telemetry", bg: "PhD in Autonomous Agent Orchestration from Stanford.", monogram: "SL" },
  ];

  const principles = [
    { title: "1. Zero AI Vibe Coding", desc: "No hallucinatory fluff. Every claim, SERP output, and copy asset is tied to verified market data and human-in-the-loop approval." },
    { title: "2. Engineering-Grade Telemetry", desc: "We build tools for technical B2B SaaS teams. Our agents speak technical domain language natively." },
    { title: "3. Complete Human Control", desc: "AI automates the heavy synthesis and draft copywriting, but human leaders retain final publishing sign-off." },
    { title: "4. Restrained Aesthetic Polish", desc: "Clean UI density over flashy gradients. Product function and clarity always come first." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left font-sans">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent">Our Company & Principles</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Building the Autonomous Telemetry Engine for Enterprise SaaS Growth
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          BrandSutra was founded to eliminate the disconnect between complex engineering products and high-converting marketing programs.
        </p>
      </div>

      {/* Origin Story */}
      <div className="p-8 bg-surface rounded-card border border-border space-y-4 max-w-4xl">
        <h2 className="text-xl font-bold text-ink tracking-tight">The Origin of BrandSutra</h2>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          In 2025, our founders observed that B2B SaaS teams were spending 80% of their time translating technical engineering specs into marketing collateral. Traditional marketing agencies lacked technical depth, while internal engineering teams lacked time to write blog posts and whitepapers.
        </p>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          We built BrandSutra to bridge this gap: an Autonomous Agentic AI pipeline that ingests continuous market signals, performs competitive gap analysis, and drafts engineering-grade content for human review.
        </p>
      </div>

      {/* Principles Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-ink tracking-tight">Our Core Principles</h2>
          <p className="text-xs text-ink-muted">The engineering principles guiding our multi-agent architecture.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p, i) => (
            <Card key={i} className="p-6 bg-surface border-border space-y-2">
              <h3 className="text-sm font-bold text-ink">{p.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Leadership Team (Monogram Avatars - No Stock Headshots!) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-ink tracking-tight">Leadership Team</h2>
          <p className="text-xs text-ink-muted">Engineers and product leaders building BrandSutra.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <Card key={i} className="p-5 bg-surface border-border space-y-3">
              <div className="w-12 h-12 rounded-card bg-ink text-surface font-mono font-bold text-base flex items-center justify-center">
                {m.monogram}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{m.name}</h3>
                <p className="text-[11px] font-mono text-accent">{m.role}</p>
              </div>
              <p className="text-[11px] text-ink-muted leading-tight">{m.bg}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
