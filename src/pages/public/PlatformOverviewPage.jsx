import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { PipelinePreview } from "../../components/public/ProductPreview";
import { Megaphone, Globe, Layers, ArrowRight, CheckCircle2, Cpu } from "lucide-react";

export function PlatformOverviewPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left font-sans">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2">
          <Badge variant="accent">Architecture</Badge>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">System Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Everline Multi-Agent Platform Architecture
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          How our 10-agent AI Marketing pipeline and 3-agent Website Intelligence suite interlock to automate market discovery, competitive strategy, asset copywriting, and website audits.
        </p>
      </div>

      {/* SVG System Architecture Flow Diagram */}
      <Card className="p-6 bg-surface border-border space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">Integrated Multi-Agent Dataflow</h3>
            <p className="text-xs text-ink-muted">Signals &rarr; Agent Orchestration &rarr; Approval Gate &rarr; Export</p>
          </div>
          <span className="text-xs font-mono text-accent">13 Total Agents</span>
        </div>

        {/* Clean Restrained SVG Flow Diagram */}
        <div className="w-full overflow-x-auto p-4 bg-raise rounded border border-border/80">
          <svg className="w-full min-w-[700px] h-64 font-mono text-xs" viewBox="0 0 800 240">
            {/* Input Node */}
            <g transform="translate(20, 80)">
              <rect x="0" y="0" width="130" height="80" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
              <text x="15" y="30" fill="#0F172A" fontWeight="bold" fontSize="11">Data Inputs</text>
              <text x="15" y="50" fill="#64748B" fontSize="10">• RSS Feed Signals</text>
              <text x="15" y="65" fill="#64748B" fontSize="10">• Topic & Domain</text>
            </g>

            {/* Connecting Arrow 1 */}
            <path d="M 150 120 L 190 120" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4" markerEnd="url(#arrow)" />

            {/* Module 1 Node */}
            <g transform="translate(200, 20)">
              <rect x="0" y="0" width="220" height="90" rx="6" fill="#F8FAFC" stroke="#0052FF" strokeWidth="1.5" />
              <text x="15" y="30" fill="#0052FF" fontWeight="bold" fontSize="11">Module 1: AI Marketing Agent</text>
              <text x="15" y="50" fill="#334155" fontSize="10">10 Specialized Agents Pipeline</text>
              <text x="15" y="68" fill="#64748B" fontSize="9">Trend &rarr; Research &rarr; Comp &rarr; Copy &rarr; Creative</text>
            </g>

            {/* Module 2 Node */}
            <g transform="translate(200, 130)">
              <rect x="0" y="0" width="220" height="90" rx="6" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
              <text x="15" y="30" fill="#0F172A" fontWeight="bold" fontSize="11">Module 2: Website Intelligence</text>
              <text x="15" y="50" fill="#334155" fontSize="10">3 Audit & Scoring Agents</text>
              <text x="15" y="68" fill="#64748B" fontSize="9">Structure &rarr; 5 Gaps &rarr; Health Score Roadmap</text>
            </g>

            {/* Connecting Arrows to Supervisor */}
            <path d="M 420 65 L 480 120" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M 420 175 L 480 120" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Supervisor & Approval Gate Node */}
            <g transform="translate(490, 80)">
              <rect x="0" y="0" width="140" height="80" rx="6" fill="#FFFFFF" stroke="#0052FF" strokeWidth="1.5" />
              <text x="15" y="30" fill="#0052FF" fontWeight="bold" fontSize="11">Human Approval</text>
              <text x="15" y="50" fill="#64748B" fontSize="10">• Asset Review</text>
              <text x="15" y="65" fill="#64748B" fontSize="10">• Revision Loop</text>
            </g>

            {/* Connecting Arrow to Export */}
            <path d="M 630 120 L 670 120" stroke="#94A3B8" strokeWidth="1.5" />

            {/* Export Node */}
            <g transform="translate(680, 80)">
              <rect x="0" y="0" width="100" height="80" rx="6" fill="#0F172A" stroke="#0F172A" strokeWidth="1.5" />
              <text x="15" y="35" fill="#FFFFFF" fontWeight="bold" fontSize="11">Deliverables</text>
              <text x="15" y="55" fill="#94A3B8" fontSize="10">17 Artifacts</text>
            </g>
          </svg>
        </div>
      </Card>

      {/* Two Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Module 1 */}
        <Card className="p-6 space-y-4 hover:border-accent transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-accent" />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Module 1</span>
            </div>
            <h3 className="text-xl font-bold text-ink">AI Marketing Agent</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Automates the complete marketing lifecycle across 10 specialized agents—from SERP & RSS trend monitoring to approved multi-format asset copywriting and creative diagram design.
            </p>
            <ul className="space-y-1.5 text-xs text-ink font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>10 Specialized AI Agents</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Automated RSS & SERP Signal Scraping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>8 Structured Campaign Deliverables</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="secondary" icon={ArrowRight} onClick={() => navigate("/platform/marketing-agent")} className="w-full">
              Explore Module 1 Deep Dive
            </Button>
          </div>
        </Card>

        {/* Card 2: Module 2 */}
        <Card className="p-6 space-y-4 hover:border-accent transition-colors flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Module 2</span>
            </div>
            <h3 className="text-xl font-bold text-ink">Website Intelligence</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Crawls website page inventory, builds structural hierarchy trees, and runs a 5-area business gap analysis to output a 0–100 Health Score and phased Now/Next/Later execution roadmap.
            </p>
            <ul className="space-y-1.5 text-xs text-ink font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>3 Architectural & Audit Agents</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>5-Area Gap Analysis Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>9 Audit Deliverable Reports</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="secondary" icon={ArrowRight} onClick={() => navigate("/platform/website-intelligence")} className="w-full">
              Explore Module 2 Deep Dive
            </Button>
          </div>
        </Card>
      </div>

      {/* Live Pipeline Preview Container */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">Live Pipeline Telemetry</h3>
        <PipelinePreview />
      </div>
    </div>
  );
}
