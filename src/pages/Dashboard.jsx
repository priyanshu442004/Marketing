import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { SEO } from "../components/common/SEO";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge, StatusChip } from "../components/ui/Badge";
import { API_BASE_URL } from "../config";
import {
  Sparkles,
  Globe,
  PlusCircle,
  ArrowRight,
  CheckSquare,
  Activity,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const { runs, analyses } = useAppStore();
  const [gscOverview, setGscOverview] = useState({ clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 });

  useEffect(() => {
    const fetchOverview = async () => {
      const token = localStorage.getItem("brandsutra_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/google/gsc/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setGscOverview({
            clicks: data.data.clicks || 0,
            impressions: data.data.impressions || 0,
            ctr: data.data.ctr || 0,
            avgPosition: data.data.avgPosition || 0,
          });
        }
      } catch (error) {
        console.warn("GSC overview unavailable", error);
      }
    };

    fetchOverview();
  }, []);

  // Calculate top metrics
  const activeRunsCount = runs.filter((r) => r.status === "running").length;
  
  // Collect all pending assets
  const pendingAssets = [];
  runs.forEach((r) => {
    if (r.outputs?.blogPost && r.outputs.blogPost.status === "pending") {
      pendingAssets.push({ runId: r.id, runTopic: r.topic, ...r.outputs.blogPost });
    }
    if (r.outputs?.linkedinPosts) {
      r.outputs.linkedinPosts
        .filter((lp) => lp.status === "pending")
        .forEach((lp) => pendingAssets.push({ runId: r.id, runTopic: r.topic, ...lp }));
    }
    if (r.outputs?.emailSequence) {
      r.outputs.emailSequence.forEach((em) => {
        if (em.status === "pending") pendingAssets.push({ runId: r.id, runTitle: r.title, ...em });
      });
    }
  });

  const completedAnalyses = analyses.filter((a) => a.healthScore !== null);
  const avgHealthScore =
    completedAnalyses.length > 0
      ? Math.round(
          completedAnalyses.reduce((acc, curr) => acc + curr.healthScore, 0) /
            completedAnalyses.length
        )
      : 72;

  // Recent activity stream
  const activityFeed = [
    { time: "10:45 AM", text: "RUN-2481 Manufacturing pipeline reached Step 7 (Content Planning)." },
    { time: "09:30 AM", text: "Website audit completed for acmecloud.io with Health Score 68." },
    { time: "Yesterday", text: "LinkedIn asset-902 approved for RUN-2480 Multi-Cloud marketing run." },
    { time: "2 days ago", text: "New website audit initiated for finverse-pay.com." }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-left font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
            Control Center Overview
          </span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            BrandSutra CMO Dashboard
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Real-time status across marketing agent runs, pending asset approvals, and website health audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Globe} onClick={() => navigate("/app/website/new")}>
            Analyze Website
          </Button>
          <Button variant="primary" icon={PlusCircle} onClick={() => navigate("/app/marketing/new")}>
            Run
          </Button>
        </div>
      </div>

      {/* Restrained Top Metrics Strip */}
      <div className="bg-surface p-4 rounded-card border border-border grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-r border-border/80 last:border-none pr-4">
          <span className="text-[11px] font-mono uppercase text-ink-subtle block">Active Agent Runs</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-ink">{activeRunsCount}</span>
            <span className="text-[10px] font-mono text-sky-700 flex items-center gap-0.5">
              <Activity className="w-3 h-3" /> Live
            </span>
          </div>
        </div>

        <div className="border-r border-border/80 last:border-none pr-4">
          <span className="text-[11px] font-mono uppercase text-ink-subtle block">Pending Approvals</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-accent">{pendingAssets.length}</span>
            <span className="text-[10px] font-mono text-amber-800">Requires Action</span>
          </div>
        </div>

        <div className="border-r border-border/80 last:border-none pr-4">
          <span className="text-[11px] font-mono uppercase text-ink-subtle block">Analyses This Month</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-ink">{analyses.length}</span>
            <span className="text-[10px] font-mono text-emerald-800 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +20% vs last mo
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase text-ink-subtle block">Avg Website Health</span>
            <a
              href="https://allabovedesignstudio.com/"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-mono text-accent hover:underline flex items-center gap-1"
            >
              Visit
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-ink">{avgHealthScore}/100</span>
            <span className="text-[10px] font-mono text-ink-subtle">Target &gt;80</span>
          </div>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-card border border-border grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded bg-raise p-3">
          <div className="text-[10px] font-mono uppercase text-ink-subtle">Organic Clicks</div>
          <div className="mt-1 text-xl font-bold font-mono text-ink">{gscOverview.clicks}</div>
        </div>
        <div className="rounded bg-raise p-3">
          <div className="text-[10px] font-mono uppercase text-ink-subtle">Impressions</div>
          <div className="mt-1 text-xl font-bold font-mono text-ink">{gscOverview.impressions}</div>
        </div>
        <div className="rounded bg-raise p-3">
          <div className="text-[10px] font-mono uppercase text-ink-subtle">CTR</div>
          <div className="mt-1 text-xl font-bold font-mono text-ink">{(gscOverview.ctr * 100).toFixed(1)}%</div>
        </div>
        <div className="rounded bg-raise p-3">
          <div className="text-[10px] font-mono uppercase text-ink-subtle">Avg Position</div>
          <div className="mt-1 text-xl font-bold font-mono text-ink">{gscOverview.avgPosition.toFixed(1)}</div>
        </div>
        <div className="rounded bg-raise p-3">
          <div className="text-[10px] font-mono uppercase text-ink-subtle">SEO Opportunities</div>
          <div className="mt-1 text-xl font-bold font-mono text-accent">{Math.max(2, Math.round(gscOverview.impressions / 2500))}</div>
        </div>
      </div>

      {/* Module Entry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1 Entry */}
        <div className="bg-surface p-5 rounded-card border border-border space-y-4 hover:border-accent/60 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                Module 1
              </span>
              <h2 className="text-base font-bold text-ink">AI Marketing Agent Pipeline</h2>
            </div>
            <Badge variant="accent">10 Agents</Badge>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Execute 10 autonomous agents across RSS trend scraping, audience research, competitive benchmarking, SEO intent mapping, and multi-channel asset generation.
          </p>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs font-mono text-ink-subtle">{runs.length} total marketing runs</span>
            <Button size="sm" variant="primary" icon={ArrowRight} onClick={() => navigate("/app/marketing")}>
              Launch
            </Button>
          </div>
        </div>

        {/* Module 2 Entry */}
        <div className="bg-surface p-5 rounded-card border border-border space-y-4 hover:border-accent/60 transition-colors">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                Module 2
              </span>
              <h2 className="text-base font-bold text-ink">Website & Business Intelligence</h2>
            </div>
            <Badge variant="neutral">3 Agents</Badge>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Crawl page inventories, evaluate 5 key business & messaging gap areas, calculate 0-100 Health Scores, and generate phased Now/Next/Later optimization roadmaps.
          </p>
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs font-mono text-ink-subtle">{analyses.length} website audits</span>
            <Button size="sm" variant="secondary" icon={ArrowRight} onClick={() => navigate("/app/website")}>
              Launch
            </Button>
          </div>
        </div>
      </div>

      {/* Needs Your Attention Panel & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Approvals Queue (7 cols) */}
        <div className="lg:col-span-7 bg-surface p-5 rounded-card border border-border space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-accent shrink-0" />
              <h3 className="text-sm font-semibold text-ink">Needs Your Attention</h3>
            </div>
            <Badge variant="accent">{pendingAssets.length} Pending Review</Badge>
          </div>

          <div className="space-y-2">
            {pendingAssets.length > 0 ? (
              pendingAssets.slice(0, 4).map((asset, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/app/marketing/runs/${asset.runId}`)}
                  className="p-3 rounded bg-raise hover:bg-raise/80 border border-border cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-accent font-semibold">{asset.runId}</span>
                      <span className="text-xs font-semibold text-ink truncate">{asset.title || asset.subject || asset.type}</span>
                    </div>
                    <p className="text-[11px] text-ink-muted truncate">{asset.runTitle}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-subtle shrink-0" />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-ink-muted font-mono">
                All generated assets have been reviewed.
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface p-5 rounded-card border border-border space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <h3 className="text-sm font-semibold text-ink">Content Planning</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded bg-raise p-3">
                <div className="text-[10px] font-mono uppercase text-ink-subtle">Approved</div>
                <div className="text-base font-semibold text-ink mt-1">12</div>
              </div>
              <div className="rounded bg-raise p-3">
                <div className="text-[10px] font-mono uppercase text-ink-subtle">Scheduled</div>
                <div className="text-base font-semibold text-ink mt-1">6</div>
              </div>
              <div className="rounded bg-raise p-3">
                <div className="text-[10px] font-mono uppercase text-ink-subtle">Draft</div>
                <div className="text-base font-semibold text-ink mt-1">4</div>
              </div>
              <div className="rounded bg-raise p-3">
                <div className="text-[10px] font-mono uppercase text-ink-subtle">Pending Review</div>
                <div className="text-base font-semibold text-ink mt-1">3</div>
              </div>
            </div>
          </div>

          <div className="bg-surface p-5 rounded-card border border-border space-y-3">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <Clock className="w-4 h-4 text-ink-subtle shrink-0" />
              <h3 className="text-sm font-semibold text-ink">System Activity Stream</h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {activityFeed.map((item, idx) => (
                <div key={idx} className="flex gap-2 text-ink-muted border-b border-border/50 pb-2 last:border-none">
                  <span className="text-[10px] text-ink-subtle shrink-0 pt-0.5">{item.time}</span>
                  <span className="text-[11px] leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
