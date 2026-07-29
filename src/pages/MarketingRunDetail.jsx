import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Badge, StatusChip } from "../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import {
  SupervisorOutput,
  TrendOutput,
  ResearchOutput,
  CompetitiveOutput,
  ContextMergerOutput,
  StrategyOutput,
  PlanningOutput,
  SeoOutput,
  ContentGenOutput,
  CreativeGenOutput,
} from "../components/marketing/AgentOutputs";
import {
  CheckCircle2,
  Clock,
  Download,
  ArrowLeft,
  CheckSquare,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export function MarketingRunDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { runs, updateAssetStatus } = useAppStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedAgentId, setSelectedAgentId] = useState("agent-1");
  const [approvalFilter, setApprovalFilter] = useState("all");

  const run = runs.find((r) => r.id === id) || runs[0];

  if (!run) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-ink-muted">Run not found.</p>
        <Button onClick={() => navigate("/marketing")}>Back to Runs</Button>
      </div>
    );
  }

  // Calculate approval counters
  const allAssets = [];
  if (run.outputs?.blogPost) allAssets.push({ agentName: "Content Generation", ...run.outputs.blogPost });
  if (run.outputs?.linkedinPosts) {
    run.outputs.linkedinPosts.forEach((lp) => allAssets.push({ agentName: "Content Generation", ...lp }));
  }
  if (run.outputs?.emailSequence) {
    run.outputs.emailSequence.forEach((em) => allAssets.push({ agentName: "Content Generation", ...em }));
  }
  if (run.outputs?.adVariants) {
    run.outputs.adVariants.forEach((ad) => allAssets.push({ agentName: "Content Generation", ...ad }));
  }
  if (run.outputs?.creativeAssets) {
    run.outputs.creativeAssets.forEach((cr) => allAssets.push({ agentName: "Creative Generation", ...cr }));
  }

  const pendingCount = allAssets.filter((a) => a.status === "pending").length;

  const filteredApprovalAssets = allAssets.filter((asset) => {
    if (approvalFilter === "all") return true;
    return asset.status === approvalFilter;
  });

  const handleAssetAction = (assetId, action) => {
    updateAssetStatus(run.id, assetId, action);
    toast({
      title: `Asset ${action.replace("_", " ")}`,
      description: `Updated status for asset ${assetId}.`,
      variant: action === "approved" ? "success" : "info",
    });
  };

  const handleDownloadDeliverable = (name) => {
    toast({
      title: "Preparing Export",
      description: `Bundling ${name} package for download...`,
      variant: "info",
    });
  };

  const selectedAgent = run.agents.find((a) => a.id === selectedAgentId) || run.agents[0];

  const deliverablesList = [
    { name: "Market Research Report", format: "PDF", size: "2.4 MB", date: run.createdAt },
    { name: "Trend & Keyword Analysis", format: "DOCX", size: "1.1 MB", date: run.createdAt },
    { name: "Competitive Intelligence Matrix", format: "PDF", size: "3.8 MB", date: run.createdAt },
    { name: "Master Content Strategy Brief", format: "PDF", size: "1.9 MB", date: run.createdAt },
    { name: "30-Day Editorial Calendar", format: "ZIP", size: "4.2 MB", date: run.createdAt },
    { name: "SEO Keyword & SERP Blueprint", format: "DOCX", size: "850 KB", date: run.createdAt },
    { name: "Multi-Channel Marketing Copy Pack", format: "ZIP", size: "5.6 MB", date: run.createdAt },
    { name: "Creative Asset & Visual Spec Kit", format: "ZIP", size: "12.4 MB", date: run.createdAt },
  ];

  const renderAgentOutput = () => {
    if (selectedAgent.status === "queued" || (run.status === "running" && selectedAgent.status !== "completed")) {
      return (
        <div className="space-y-4 bg-surface p-6 rounded-card border border-border">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-sky-600 animate-spin" />
            <div>
              <h3 className="text-sm font-semibold text-ink">Agent is working...</h3>
              <p className="text-xs text-ink-muted">
                {selectedAgent.name} is scanning data and synthesizing outputs.
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      );
    }

    switch (selectedAgent.id) {
      case "agent-1":
        return <SupervisorOutput run={run} />;
      case "agent-2":
        return <TrendOutput data={run.agentData?.trendIdentification} />;
      case "agent-3":
        return <ResearchOutput data={run.agentData?.research} />;
      case "agent-4":
        return <CompetitiveOutput data={run.agentData?.competitiveIntelligence} />;
      case "agent-5":
        return <ContextMergerOutput data={run.agentData?.contextMerger} />;
      case "agent-6":
        return <StrategyOutput data={run.agentData?.contentStrategy} />;
      case "agent-7":
        return <PlanningOutput data={run.agentData?.contentPlanning} />;
      case "agent-8":
        return <SeoOutput data={run.agentData?.seo} />;
      case "agent-9":
        return (
          <ContentGenOutput
            outputs={run.outputs}
            runId={run.id}
            onUpdateStatus={updateAssetStatus}
          />
        );
      case "agent-10":
        return (
          <CreativeGenOutput
            outputs={run.outputs}
            runId={run.id}
            onUpdateStatus={updateAssetStatus}
          />
        );
      default:
        return <div className="text-xs text-ink-muted">No output available.</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="bg-surface p-5 rounded-card border border-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate("/marketing")}
                className="text-xs p-1 h-6"
              >
                Runs
              </Button>
              <span className="font-mono text-xs font-semibold text-accent">{run.id}</span>
              <Badge variant={run.source === "Automated" ? "accent" : "neutral"}>
                {run.source}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-ink tracking-tight">{run.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon={CheckSquare}
              onClick={() => setActiveTab("approvals")}
            >
              Approvals ({pendingCount} pending)
            </Button>
            <Button
              variant="primary"
              icon={Download}
              onClick={() => setActiveTab("deliverables")}
            >
              Export All
            </Button>
          </div>
        </div>

        {/* Metadata Mono Key-Values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border font-mono text-xs">
          <div>
            <span className="text-[10px] text-ink-subtle uppercase block">Industry</span>
            <span className="text-ink font-semibold">{run.industry}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-subtle uppercase block">Objective</span>
            <span className="text-ink font-semibold">{run.objective}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-subtle uppercase block">Target Audience</span>
            <span className="text-ink font-semibold truncate block">{run.targetAudience}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-subtle uppercase block">Status</span>
            <div className="mt-0.5">
              <StatusChip status={run.status} />
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        {run.status === "running" && (
          <div className="pt-2">
            <ProgressBar value={run.overallProgress || 65} showValue size="sm" />
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="pipeline" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pipeline" icon={Layers}>
            Agent Pipeline Rail
          </TabsTrigger>
          <TabsTrigger value="approvals" icon={CheckSquare} badge={pendingCount}>
            Human Approvals Queue
          </TabsTrigger>
          <TabsTrigger value="deliverables" icon={FileText} badge={deliverablesList.length}>
            Deliverables & Export
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pipeline View */}
        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Agent Pipeline Rail (~300px / 4 cols) */}
            <div className="lg:col-span-4 bg-surface rounded-card border border-border p-4 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle pb-2 border-b border-border">
                10-Agent Pipeline Steps
              </h3>

              <div className="space-y-1 relative">
                {run.agents.map((agent, idx) => {
                  const isSelected = selectedAgentId === agent.id;
                  const isCompleted = agent.status === "completed";
                  const isRunning = agent.status === "running";

                  return (
                    <div key={agent.id} className="relative">
                      {/* Faint connecting line */}
                      {idx < run.agents.length - 1 && (
                        <div className="absolute left-5 top-8 bottom-0 w-px bg-border z-0" />
                      )}

                      <button
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`w-full text-left p-3 rounded-control border transition-all duration-150 relative z-10 flex items-start gap-3 ${
                          isSelected
                            ? "border-accent bg-accent-tint/50 shadow-sm"
                            : "border-transparent hover:bg-raise"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5 ${
                            isCompleted
                              ? "bg-accent text-white"
                              : isRunning
                              ? "bg-sky-600 text-white animate-pulse"
                              : "bg-raise text-ink-subtle border border-border"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>

                        <div className="flex-1 space-y-0.5 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold truncate ${
                                isSelected ? "text-accent" : "text-ink"
                              }`}
                            >
                              {agent.name}
                            </span>
                            <StatusChip status={agent.status} />
                          </div>
                          <p className="text-[11px] text-ink-muted truncate">
                            {agent.shortDesc || agent.role}
                          </p>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Output View (8 cols) */}
            <div className="lg:col-span-8 bg-surface rounded-card border border-border p-5 space-y-4">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle">
                    Agent Output View
                  </span>
                  <h2 className="text-base font-bold text-ink">{selectedAgent.name}</h2>
                </div>
                <StatusChip status={selectedAgent.status} />
              </div>

              {renderAgentOutput()}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Approvals View */}
        <TabsContent value="approvals">
          <div className="space-y-6">
            <div className="bg-surface p-4 rounded-card border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-ink">Human Approval Queue</h3>
                <p className="text-xs text-ink-muted">
                  Review generated copy and visual assets prior to campaign publishing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {["all", "pending", "approved", "rejected"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setApprovalFilter(f)}
                    className={`px-3 py-1 text-xs font-medium rounded-control capitalize transition-colors ${
                      approvalFilter === f
                        ? "bg-accent text-white"
                        : "bg-raise text-ink-muted hover:text-ink"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Note on automated publishing */}
            <div className="p-3 rounded bg-raise border border-border text-xs text-ink-muted flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
              <span>Automated social & email channel publishing coming in a future release.</span>
            </div>

            {/* Aggregated Assets List */}
            <div className="space-y-4">
              {filteredApprovalAssets.length > 0 ? (
                filteredApprovalAssets.map((asset, i) => (
                  <Card key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="accent">{asset.agentName}</Badge>
                        <span className="text-xs font-semibold text-ink">
                          {asset.title || asset.subject || asset.type}
                        </span>
                      </div>
                      <StatusChip status={asset.status} />
                    </div>

                    <div className="text-xs text-ink bg-raise/50 p-3 rounded font-sans leading-relaxed whitespace-pre-line">
                      {asset.content || asset.body || `[Creative Asset: ${asset.dimensions}]`}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="primary"
                        icon={CheckCircle2}
                        onClick={() => handleAssetAction(asset.id, "approved")}
                        disabled={asset.status === "approved"}
                      >
                        Approve Asset
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAssetAction(asset.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="p-8 text-center bg-surface rounded-card border border-border text-xs text-ink-muted">
                  No assets match the selected filter.
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Deliverables Export View */}
        <TabsContent value="deliverables">
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-sm font-semibold text-ink">Module-1 Deliverables Package</h3>
              <p className="text-xs text-ink-muted">
                Download structured marketing reports, briefs, editorial plans, and raw asset archives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverablesList.map((item, idx) => (
                <Card key={idx} className="p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">{item.format}</Badge>
                      <h4 className="text-xs font-semibold text-ink">{item.name}</h4>
                    </div>
                    <p className="text-[11px] font-mono text-ink-subtle">
                      Size: {item.size} • Generated: {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Download}
                    onClick={() => handleDownloadDeliverable(item.name)}
                  >
                    Download
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
