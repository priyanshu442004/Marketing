import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { SEO } from "../components/common/SEO";
import { Button } from "../components/ui/Button";
import { Badge, StatusChip } from "../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import {
  Globe,
  ArrowLeft,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Layers,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BarChart2,
  Clock,
  ExternalLink,
  ShieldAlert
} from "lucide-react";

export function WebsiteAnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { analyses, reRunAnalysis } = useAppStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("structure");
  const [expandedNavNode, setExpandedNavNode] = useState(true);
  const [expandedRecId, setExpandedRecId] = useState("rec-1");

  const analysis = id ? analyses.find((a) => a.id === id) : analyses[0];

  const handleExportAuditPackage = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `website-audit-${analysis.domain}-${analysis.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Audit Package Exported",
      description: `Downloaded domain analysis JSON bundle for ${analysis.domain}.`,
      variant: "success",
    });
  };

  if (!analysis) {
    return (
      <div className="p-12 text-center space-y-4 bg-surface rounded-card border border-border max-w-md mx-auto my-12 font-sans">
        <Clock className="w-8 h-8 text-accent animate-spin mx-auto" />
        <div>
          <h3 className="text-base font-semibold text-ink">Loading Website Analysis...</h3>
          <p className="text-xs text-ink-muted mt-1">
            Fetching crawler data and audit status for <span className="font-mono text-accent">{id}</span>.
          </p>
        </div>
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={() => navigate("/app/website")}>
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const handleReRun = () => {
    reRunAnalysis(analysis.id);
    toast({
      title: "Re-running Website Audit",
      description: `Refreshing DOM crawl & gap analysis for ${analysis.domain}...`,
      variant: "info",
    });
  };

  const handleExport = () => {
    toast({
      title: "Preparing Full Website Audit Package",
      description: `Bundling PDF & CSV audit reports for ${analysis.domain}...`,
      variant: "info",
    });
  };

  const getScoreColor = (score) => {
    if (!score) return "text-ink-subtle";
    if (score >= 80) return "text-emerald-700 font-bold";
    if (score >= 50) return "text-amber-800 font-bold";
    return "text-rose-700 font-bold";
  };

  const deliverablesList = [
    "Website Structure Report",
    "Business Gap Analysis",
    "Website Health Score",
    "Category-wise Scorecard",
    "SEO Audit",
    "Content Audit",
    "Conversion Audit",
    "Prioritized Recommendations",
    "Website Improvement Roadmap"
  ];

  return (
    <div className="space-y-6">
      <SEO
        title={`Audit: ${analysis.companyName || analysis.domain}`}
        description={`Domain structure audit, health scorecard (${analysis.healthScore}/100), and 5-area analysis for ${analysis.url}.`}
      />
      {/* Header Block */}
      <div className="bg-surface p-5 rounded-card border border-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={() => navigate("/website")}
                className="text-xs p-1 h-6"
              >
                Analyses
              </Button>
              <span className="font-mono text-xs text-ink-subtle">{analysis.id}</span>
              <StatusChip status={analysis.status} />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-8 h-8 rounded bg-ink text-surface font-mono font-bold text-sm flex items-center justify-center shrink-0">
                {analysis.domain.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-ink tracking-tight flex items-center gap-2">
                  {analysis.companyName}
                  <a
                    href={analysis.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-subtle hover:text-accent"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h1>
                <p className="text-xs font-mono text-ink-muted">{analysis.domain} • {analysis.industry}</p>
              </div>
            </div>
          </div>

          {/* Hero Score + Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Score Hero Widget */}
            <div className="p-3 bg-raise rounded-card border border-border flex items-center gap-3">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase text-ink-subtle block">Health Score</span>
                <span className={`text-2xl font-mono ${getScoreColor(analysis.healthScore)}`}>
                  {analysis.healthScore !== null ? `${analysis.healthScore}/100` : "--"}
                </span>
              </div>
              {/* Compact Radial/Gauge Bar */}
              <div className="w-12 h-12 rounded-full border-4 border-border flex items-center justify-center font-mono text-xs text-ink font-semibold relative">
                {analysis.healthScore || 0}%
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={RefreshCw} onClick={handleReRun}>
                Re-run Audit
              </Button>
              <Button variant="primary" icon={Download} onClick={handleExportAuditPackage}>
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs mapping to the 3 Agents */}
      <Tabs defaultValue="structure" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="structure" icon={Layers}>
            Agent 1: Website Structure
          </TabsTrigger>
          <TabsTrigger value="gaps" icon={AlertTriangle}>
            Agent 2: Business Gap Analysis
          </TabsTrigger>
          <TabsTrigger value="scoring" icon={BarChart2}>
            Agent 3: Recommendations & Roadmap
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Agent 1 - Website Structure */}
        <TabsContent value="structure">
          <div className="space-y-6">
            {/* Technical Overview Panel */}
            <div className="bg-surface p-5 rounded-card border border-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
                Technical Telemetry & Crawl Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-3 bg-raise rounded border border-border">
                  <span className="text-[10px] text-ink-subtle uppercase block">Discovered Pages</span>
                  <span className="text-base font-bold text-ink">{analysis.technicalOverview?.pagesDiscovered || 42}</span>
                </div>
                <div className="p-3 bg-raise rounded border border-border">
                  <span className="text-[10px] text-ink-subtle uppercase block">Max Depth</span>
                  <span className="text-base font-bold text-ink">{analysis.technicalOverview?.maxDepth || 4} levels</span>
                </div>
                <div className="p-3 bg-raise rounded border border-border">
                  <span className="text-[10px] text-ink-subtle uppercase block">Sitemap XML</span>
                  <span className="text-base font-bold text-emerald-800">{analysis.technicalOverview?.sitemapFound || "Found"}</span>
                </div>
                <div className="p-3 bg-raise rounded border border-border">
                  <span className="text-[10px] text-ink-subtle uppercase block">Avg Load Time</span>
                  <span className="text-base font-bold text-ink">{analysis.technicalOverview?.avgLoadTime || "1.42s"}</span>
                </div>
              </div>
            </div>

            {/* Page Inventory Table & Hierarchy Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Page Inventory (8 cols) */}
              <div className="lg:col-span-8 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                  Page Inventory & DOM Crawl Results
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL Path</TableHead>
                      <TableHead>Page Type</TableHead>
                      <TableHead>Page Title</TableHead>
                      <TableHead>Words</TableHead>
                      <TableHead>Links</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.pageInventory?.map((page, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs font-semibold text-accent">{page.path}</TableCell>
                        <TableCell className="text-xs">{page.pageType}</TableCell>
                        <TableCell className="text-xs text-ink truncate max-w-xs">{page.title}</TableCell>
                        <TableCell className="font-mono text-xs">{page.wordCount}</TableCell>
                        <TableCell className="font-mono text-xs">{page.internalLinks}</TableCell>
                        <TableCell>
                          <Badge variant="neutral">{page.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Navigation Hierarchy Tree (4 cols) */}
              <div className="lg:col-span-4 bg-surface p-5 rounded-card border border-border space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
                  Site Navigation Hierarchy
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  {analysis.navigationHierarchy?.map((node, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-1 text-ink font-semibold bg-raise p-1.5 rounded">
                        <ChevronRight className="w-3.5 h-3.5 text-accent" />
                        <span>{node.name}</span>
                      </div>
                      {node.children && node.children.length > 0 && (
                        <div className="pl-6 space-y-1 text-ink-muted">
                          {node.children.map((child, j) => (
                            <div key={j} className="flex items-center gap-1.5">
                              <span className="text-ink-subtle">├─</span>
                              <span>{child.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Agent 2 - Business Gap Analysis */}
        <TabsContent value="gaps">
          <div className="space-y-6">
            <div className="border-b border-border pb-2">
              <h3 className="text-sm font-semibold text-ink">5-Area Business & Messaging Audit</h3>
              <p className="text-xs text-ink-muted">
                Evaluating positioning, content depth, SEO optimization, UX clarity, and conversion friction.
              </p>
            </div>

            {analysis.gapAnalysis ? (
              <div className="space-y-4">
                {[
                  { key: "businessAlignment", title: "1. Business & Messaging Alignment" },
                  { key: "contentAnalysis", title: "2. Content Depth & Coverage" },
                  { key: "seoAnalysis", title: "3. SEO & SERP Optimization" },
                  { key: "conversionAnalysis", title: "4. Conversion Readiness & CTAs" },
                  { key: "userExperience", title: "5. User Experience & Architecture" }
                ].map(({ key, title }) => {
                  const area = analysis.gapAnalysis[key];
                  if (!area) return null;

                  return (
                    <Card key={key} className="p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <h4 className="text-xs font-semibold text-ink">{title}</h4>
                        <Badge variant={area.severity === "high" ? "danger" : area.severity === "medium" ? "warning" : "neutral"}>
                          {area.severity.toUpperCase()} SEVERITY
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-ink-subtle block">Finding</span>
                          <p className="text-ink font-medium leading-relaxed mt-0.5">{area.finding}</p>
                        </div>

                        <div className="p-3 bg-raise rounded border border-border/80">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold block">Why It Matters</span>
                          <p className="text-ink-muted mt-0.5 leading-relaxed">{area.whyItMatters}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-surface rounded-card border border-border text-xs text-ink-muted">
                Audit actively crawling site structure...
              </div>
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Agent 3 - Recommendations & Roadmap (The Payoff Screen) */}
        <TabsContent value="scoring">
          <div className="space-y-6">
            {/* Category-wise Scorecard Dashboard */}
            <div className="bg-surface p-5 rounded-card border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink">Website Health Score Breakdown</h3>
                  <p className="text-xs text-ink-muted">Calculated across 6 structural & strategic dimensions.</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-ink-subtle">Overall Score</span>
                  <div className={`text-xl ${getScoreColor(analysis.healthScore)}`}>
                    {analysis.healthScore || 0}/100
                  </div>
                </div>
              </div>

              {/* Horizontal Category Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.scoringBreakdown?.categories.map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-ink font-medium">{cat.name}</span>
                      <span className="text-ink-subtle">{cat.score}/100</span>
                    </div>
                    <ProgressBar value={cat.score} size="sm" showValue={false} />
                  </div>
                ))}
              </div>
            </div>

            {/* Prioritized Recommendations */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Prioritized Actionable Recommendations
              </h3>

              <div className="space-y-3">
                {analysis.recommendations?.map((rec) => {
                  const isExpanded = expandedRecId === rec.id;
                  return (
                    <Card
                      key={rec.id}
                      className="p-4 cursor-pointer hover:border-accent transition-colors space-y-2"
                      onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={rec.severity === "high" ? "danger" : "accent"}>{rec.category}</Badge>
                          <h4 className="text-xs font-semibold text-ink">{rec.title}</h4>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">{rec.impact}</span>
                          <span className="px-2 py-0.5 rounded bg-raise border border-border text-ink-muted">{rec.effort}</span>
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-ink-subtle" /> : <ChevronRight className="w-4 h-4 text-ink-subtle" />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="pt-2 border-t border-border text-xs text-ink-muted leading-relaxed bg-raise/50 p-3 rounded">
                          <span className="font-semibold text-accent block mb-1">Recommended Implementation:</span>
                          <p>{rec.details}</p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Website Improvement Roadmap (Now / Next / Later) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Website Improvement Roadmap (Phased View)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* NOW Phase */}
                <div className="bg-surface p-4 rounded-card border border-accent/40 space-y-3">
                  <div className="flex items-center justify-between border-b border-accent/30 pb-2">
                    <span className="text-xs font-mono font-bold text-accent uppercase">Phase 1: NOW (Quick Wins)</span>
                    <Badge variant="accent">Weeks 1-2</Badge>
                  </div>
                  <div className="space-y-2">
                    {analysis.roadmap?.now.map((item, i) => (
                      <div key={i} className="p-2.5 rounded bg-accent-tint/30 border border-accent/20 text-xs">
                        <p className="font-semibold text-ink">{item.title}</p>
                        <div className="flex justify-between font-mono text-[10px] text-ink-subtle mt-1">
                          <span>{item.category}</span>
                          <span>{item.effort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NEXT Phase */}
                <div className="bg-surface p-4 rounded-card border border-border space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-mono font-bold text-ink-muted uppercase">Phase 2: NEXT (Growth)</span>
                    <Badge variant="neutral">Weeks 3-4</Badge>
                  </div>
                  <div className="space-y-2">
                    {analysis.roadmap?.next.map((item, i) => (
                      <div key={i} className="p-2.5 rounded bg-raise border border-border text-xs">
                        <p className="font-semibold text-ink">{item.title}</p>
                        <div className="flex justify-between font-mono text-[10px] text-ink-subtle mt-1">
                          <span>{item.category}</span>
                          <span>{item.effort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LATER Phase */}
                <div className="bg-surface p-4 rounded-card border border-border space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-mono font-bold text-ink-subtle uppercase">Phase 3: LATER (Scale)</span>
                    <Badge variant="neutral">Month 2+</Badge>
                  </div>
                  <div className="space-y-2">
                    {analysis.roadmap?.later.map((item, i) => (
                      <div key={i} className="p-2.5 rounded bg-raise/50 border border-border text-xs">
                        <p className="font-semibold text-ink">{item.title}</p>
                        <div className="flex justify-between font-mono text-[10px] text-ink-subtle mt-1">
                          <span>{item.category}</span>
                          <span>{item.effort}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables Downloads Package List */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Audit Deliverables Package (9 Items)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deliverablesList.map((item, i) => (
                  <Card key={i} className="p-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-ink truncate max-w-[180px]">{item}</span>
                    <Button size="sm" variant="ghost" icon={Download} onClick={handleExport} />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
