import React, { useState } from "react";
import { CheckCircle2, Layers, AlertTriangle, BarChart2, Sparkles, Globe, RefreshCw, ArrowRight, FileText, Share2, Mail, Terminal, Cpu } from "lucide-react";
import { StatusChip, Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";

export function ProductPreviewFrame({ title = "BrandSutra Autonomous Marketing Platform", children, className = "" }) {
  return (
    <div className={`bg-surface rounded-card border border-border shadow-modal overflow-hidden text-left font-sans select-none ${className}`}>
      {/* Browser Chrome Header */}
      <div className="h-9 bg-raise border-b border-border px-3.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
          <span className="w-2.5 h-2.5 rounded-full bg-border" />
        </div>
        <div className="px-3 py-0.5 rounded bg-surface border border-border/80 text-[10px] font-mono text-ink-subtle flex items-center gap-1.5 max-w-[220px] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>https://app.BrandSutra.ai</span>
        </div>
        <div className="w-8" />
      </div>
      <div className="p-4 sm:p-5 bg-surface text-ink">
        {children}
      </div>
    </div>
  );
}

// 1. Interactive Hero Platform Preview Sandbox
export function InteractiveHeroPreview() {
  const [activeTab, setActiveTab] = useState("pipeline"); // 'pipeline' | 'telemetry' | 'copy' | 'audit'

  const agents = [
    { name: "Marketing Supervisor", status: "completed", progress: 100 },
    { name: "Trend Identification", status: "completed", progress: 100 },
    { name: "Research Agent", status: "completed", progress: 100 },
    { name: "Competitive Intelligence", status: "completed", progress: 100 },
    { name: "Context Merger", status: "completed", progress: 100 },
    { name: "Content Strategy", status: "completed", progress: 100 },
    { name: "Content Planning", status: "running", progress: 85 },
    { name: "SEO Agent", status: "running", progress: 40 },
    { name: "Content Generation", status: "queued", progress: 0 },
    { name: "Creative Generation", status: "queued", progress: 0 },
  ];

  return (
    <ProductPreviewFrame title="BrandSutra Autonomous Platform Sandbox">
      <div className="space-y-4">
        {/* Top Interactive Tabs Bar */}
        <div className="flex items-center gap-1 border-b border-border pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("pipeline")}
            className={`px-3 py-1.5 rounded-control text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "pipeline"
                ? "bg-accent text-white shadow-sm"
                : "bg-raise text-ink-muted hover:text-ink hover:bg-raise/80"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>01 Pipeline DAG</span>
          </button>

          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3 py-1.5 rounded-control text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "telemetry"
                ? "bg-accent text-white shadow-sm"
                : "bg-raise text-ink-muted hover:text-ink hover:bg-raise/80"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>02 SERP Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab("copy")}
            className={`px-3 py-1.5 rounded-control text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "copy"
                ? "bg-accent text-white shadow-sm"
                : "bg-raise text-ink-muted hover:text-ink hover:bg-raise/80"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>03 Copy Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-control text-xs font-mono font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "audit"
                ? "bg-accent text-white shadow-sm"
                : "bg-raise text-ink-muted hover:text-ink hover:bg-raise/80"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>04 Site Audit</span>
          </button>
        </div>

        {/* Tab 1: 10-Agent Pipeline */}
        {activeTab === "pipeline" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent">RUN-2481</span>
                  <StatusChip status="running" />
                </div>
                <h4 className="text-xs font-bold text-ink mt-0.5">
                  Autonomous Manufacturing & Smart Factory IoT Marketing Run
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-ink-subtle block">Live DAG Progress</span>
                <span className="text-base font-mono font-bold text-accent">82%</span>
              </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {agents.map((agent, i) => (
                <div
                  key={i}
                  className={`p-2 rounded border text-left transition-colors ${
                    agent.status === "running"
                      ? "bg-accent-tint/40 border-accent"
                      : agent.status === "completed"
                      ? "bg-raise border-border"
                      : "bg-surface border-border/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-ink-subtle mb-0.5">
                    <span>0{i + 1}</span>
                    {agent.status === "completed" ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    ) : agent.status === "running" ? (
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    ) : (
                      <span>Wait</span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-ink truncate">{agent.name}</p>
                  <div className="mt-1 w-full bg-border/40 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full transition-all duration-300"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Console Output */}
            <div className="bg-ink text-surface p-3 rounded font-mono text-[11px] space-y-1">
              <div className="text-accent flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>[Supervisor] Agent 07 (Content Planning) outputting 30-day editorial schedule...</span>
              </div>
              <div className="text-ink-subtle text-[10px]">
                08:30:24 [SEO Agent] Verified primary intent cluster: 'predictive maintenance AI' (Vol: 18.4K).
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SERP Telemetry */}
        {activeTab === "telemetry" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent">Agent 2: SERP & Signal Scraper</Badge>
                <span className="text-xs font-mono text-ink-subtle">48 Telemetry Clusters</span>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +142% Vol Spike
              </span>
            </div>

            <div className="border border-border rounded overflow-hidden divide-y divide-border text-xs font-mono">
              <div className="bg-raise p-2 flex justify-between font-semibold text-ink-muted text-[10px] uppercase">
                <span>Search Query Cluster</span>
                <span>Monthly Vol</span>
                <span>Keyword Difficulty</span>
              </div>
              <div className="p-2.5 flex justify-between items-center bg-surface">
                <span className="font-semibold text-accent">predictive maintenance AI</span>
                <span>18,400</span>
                <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Medium (42)</span>
              </div>
              <div className="p-2.5 flex justify-between items-center bg-surface">
                <span className="font-semibold text-ink">smart factory sensor telemetry</span>
                <span>9,200</span>
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Low (28)</span>
              </div>
              <div className="p-2.5 flex justify-between items-center bg-surface">
                <span className="font-semibold text-ink">SCADA anomaly detection edge</span>
                <span>12,100</span>
                <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">High (64)</span>
              </div>
            </div>

            <div className="p-3 bg-raise rounded border border-border space-y-1">
              <span className="text-[10px] font-mono uppercase text-ink-subtle">SERP Metadata Preview</span>
              <p className="text-xs font-semibold text-blue-700 underline">
                Predictive Maintenance AI for Smart Manufacturing | BrandSutra
              </p>
              <p className="text-[11px] text-ink-muted leading-tight font-sans">
                Eliminate unplanned factory downtime with BrandSutra's offline-first edge AI. Connect legacy PLCs in under 48 hours.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Copy Synthesis */}
        {activeTab === "copy" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent">Agent 9: Copy Generation</Badge>
                <span className="text-xs font-mono text-ink-subtle">3 Deliverable Formats</span>
              </div>
              <span className="text-xs font-mono font-semibold text-accent">Approved by Gate</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-raise rounded border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-accent uppercase flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Technical Blog Draft (1,240 Words)
                  </span>
                  <Badge variant="neutral">Long-Form</Badge>
                </div>
                <h5 className="font-bold text-ink text-xs">
                  How Edge AI and SCADA Telemetry Reduce Unplanned Downtime in Modern Factories
                </h5>
                <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">
                  Unplanned equipment downtime costs manufacturing enterprises over $50B annually. By deploying agentic AI telemetry at the SCADA edge...
                </p>
              </div>

              <div className="p-3 bg-raise rounded border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-accent uppercase flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> LinkedIn Thought Leadership Post
                  </span>
                  <Badge variant="neutral">Social</Badge>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed line-clamp-2">
                  "Most factory ops managers believe AI requires replacing legacy PLCs. That's a myth. Here is how edge telemetry integrates in 48h 🧵👇"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Site Audit */}
        {activeTab === "audit" && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center">
                  A
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">Apex Manufacturing Inc.</h4>
                  <p className="text-[10px] font-mono text-ink-subtle">apex-mfg.com • Industrial Automation</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-ink-subtle block">Health Score</span>
                <span className="text-base font-mono font-bold text-amber-700">74/100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-raise rounded border border-border space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-muted">Business Alignment</span>
                  <span className="font-bold text-ink">70%</span>
                </div>
                <ProgressBar value={70} size="sm" showValue={false} />
              </div>
              <div className="p-2 bg-raise rounded border border-border space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-muted">Technical Quality</span>
                  <span className="font-bold text-emerald-700">86%</span>
                </div>
                <ProgressBar value={86} size="sm" showValue={false} />
              </div>
              <div className="p-2 bg-raise rounded border border-border space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-muted">SEO Optimization</span>
                  <span className="font-bold text-ink">72%</span>
                </div>
                <ProgressBar value={72} size="sm" showValue={false} />
              </div>
              <div className="p-2 bg-raise rounded border border-border space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-ink-muted">Conversion Readiness</span>
                  <span className="font-bold text-rose-700">65%</span>
                </div>
                <ProgressBar value={65} size="sm" showValue={false} />
              </div>
            </div>

            <div className="p-2.5 bg-accent-tint/30 rounded border border-accent/30 text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-accent uppercase">High Severity Gap Identified</span>
                <Badge variant="danger">High Severity</Badge>
              </div>
              <p className="text-[11px] font-medium text-ink">
                Homepage hero CTA button leads to lengthy form without social proof badges.
              </p>
            </div>
          </div>
        )}
      </div>
    </ProductPreviewFrame>
  );
}

// 2. Export alias components for backwards compatibility
export function PipelinePreview() {
  return <InteractiveHeroPreview />;
}

export function TrendSeoPreview() {
  return <InteractiveHeroPreview />;
}

export function WebsiteAuditPreview() {
  return <InteractiveHeroPreview />;
}
