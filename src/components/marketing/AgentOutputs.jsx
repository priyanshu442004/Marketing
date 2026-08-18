import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";
import { Badge, StatusChip } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import { useToast } from "../ui/Toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Search,
  ExternalLink,
  Calendar,
  Layers,
  FileText,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  Download,
  AlertCircle
} from "lucide-react";

// Agent 1: Supervisor (DAG & Live Log Console)
export function SupervisorOutput({ run }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface p-5 rounded-card border border-border space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
          Orchestration DAG & Agent Dependencies
        </h3>
        
        {/* Simple DAG visualizer */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          {run.agents.map((agent, idx) => (
            <div
              key={agent.id}
              className={`p-2.5 rounded-control border flex flex-col justify-between space-y-1 ${
                agent.status === "completed"
                  ? "bg-accent-tint/50 border-accent text-accent"
                  : agent.status === "running"
                  ? "bg-sky-50 border-sky-300 text-sky-800 animate-pulse"
                  : "bg-raise border-border text-ink-muted"
              }`}
            >
              <div className="font-mono text-[10px] uppercase opacity-75">Step 0{idx + 1}</div>
              <div className="font-semibold truncate">{agent.name}</div>
              <div className="text-[10px] capitalize font-mono">{agent.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Log Console */}
      <div className="bg-ink text-surface p-4 rounded-card border border-ink font-mono text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-ink-muted/30 pb-2">
          <span className="text-ink-subtle uppercase tracking-wider text-[11px]">
            Live Pipeline Logs & Telemetry
          </span>
          <span className="text-accent-tint text-[11px]">Stream Active</span>
        </div>
        <div className="space-y-1.5 max-h-64 overflow-y-auto pt-1 font-mono text-[11px] text-raise">
          {run.logs && run.logs.length > 0 ? (
            run.logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-accent-tint shrink-0">›</span>
                <span>{log}</span>
              </div>
            ))
          ) : (
            <div className="text-ink-subtle">No log entries available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Agent 2: Trend Identification
export function TrendOutput({ data }) {
  if (!data) return null;
  const { kpis, totalKeywords, avgVolume, topRising, keywords, hashtags, questions, seasonalCallout } = data;

  // Resolve dynamic values directly from backend DB fields or keywords array
  const displayTotalKeywords = totalKeywords ?? kpis?.totalKeywords ?? (keywords?.length ? keywords.length : 0);
  const displayAvgVolume = avgVolume ?? kpis?.avgVolume ?? (keywords?.length && keywords[0]?.volume ? keywords[0].volume : "15K");
  const displayTopRising = topRising ?? kpis?.topRising ?? (keywords?.length && keywords[0]?.keyword ? keywords[0].keyword : "Top Market Trends");

  return (
    <div className="space-y-6">
      {/* Dynamic Mono KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-mono uppercase text-ink-subtle">Identified Keywords</span>
          <div className="text-xl font-bold font-mono text-ink mt-1">{displayTotalKeywords}</div>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-mono uppercase text-ink-subtle">Avg Monthly Volume</span>
          <div className="text-xl font-bold font-mono text-ink mt-1">{displayAvgVolume}</div>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-mono uppercase text-ink-subtle">Top Rising Term</span>
          <div className="text-xl font-bold font-mono text-accent mt-1">{displayTopRising}</div>
        </Card>
      </div>

      {/* Keywords Table */}
      {keywords && keywords.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            High-Intent Trending Keywords
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Monthly Vol</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((kw, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs font-semibold text-ink">{kw.keyword}</TableCell>
                  <TableCell className="font-mono text-xs">{kw.volume || "N/A"}</TableCell>
                  <TableCell className="text-xs">{kw.difficulty || "Medium"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{kw.trend || "Rising"}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Hashtags & Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hashtags && hashtags.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Popular Hashtags</h4>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((tag, i) => (
                <Badge key={i} variant="accent">{tag.startsWith("#") ? tag : `#${tag}`}</Badge>
              ))}
            </div>
          </Card>
        )}

        {questions && questions.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Questions People Ask</h4>
            <ul className="space-y-2 text-xs text-ink list-disc list-inside">
              {questions.map((q, i) => (
                <li key={i} className="leading-snug">{q}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Seasonal Callout */}
      {seasonalCallout && (
        <div className="p-4 rounded-card bg-accent-tint border border-accent/30 text-xs text-ink flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-accent block">Seasonal Opportunity</span>
            <p className="mt-0.5 text-ink-muted leading-relaxed">{seasonalCallout}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Agent 3: Research
export function ResearchOutput({ data }) {
  if (!data) return null;
  const { brief, painPoints, technologies, news } = data;

  return (
    <div className="space-y-6">
      {/* Brief */}
      {brief && (
        <Card>
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-subtle mb-2">
            Audience & Market Research Brief
          </h4>
          <p className="text-xs text-ink leading-relaxed whitespace-pre-line">
            {brief}
          </p>
        </Card>
      )}

      {/* Pain Points */}
      {painPoints && painPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Customer Pain Points
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {painPoints.map((pp, i) => (
              <Card key={i} className="p-4 bg-raise/50">
                <h5 className="text-xs font-semibold text-ink">{pp.title}</h5>
                <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">{pp.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* News & Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {technologies && technologies.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Emerging Tech Capabilities</h4>
            <div className="space-y-2">
              {technologies.map((tech, i) => (
                <div key={i} className="border-b border-border/60 pb-2 last:border-none">
                  <span className="text-xs font-semibold text-ink">{tech.name}</span>
                  <p className="text-[11px] text-ink-muted mt-0.5">{tech.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {news && news.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Latest Industry News</h4>
            <div className="space-y-2.5">
              {news.map((item, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-xs font-medium text-ink hover:text-accent cursor-pointer flex items-center gap-1">
                    {item.headline} {item.url && <ExternalLink className="w-3 h-3 text-ink-subtle" />}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-ink-subtle">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Agent 4: Competitive Intelligence
export function CompetitiveOutput({ data }) {
  if (!data) return null;
  const { competitors, gaps, angles } = data;

  return (
    <div className="space-y-6">
      {/* Benchmark Table */}
      {competitors && competitors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Competitor Benchmarking Matrix
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor</TableHead>
                <TableHead>Positioning</TableHead>
                <TableHead>Key Strengths</TableHead>
                <TableHead>Content Cadence</TableHead>
                <TableHead>SEO Focus</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((comp, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold text-xs text-ink">{comp.name}</TableCell>
                  <TableCell className="text-xs text-ink-muted">{comp.positioning}</TableCell>
                  <TableCell className="text-xs">{comp.strengths}</TableCell>
                  <TableCell className="font-mono text-xs">{comp.cadence}</TableCell>
                  <TableCell className="font-mono text-xs text-accent">{comp.seoFocus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Content Gap & Positioning Angles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gaps && gaps.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Content Gap Analysis</h4>
            <ul className="space-y-2 text-xs text-ink list-disc list-inside">
              {gaps.map((gap, i) => (
                <li key={i} className="leading-snug">{gap}</li>
              ))}
            </ul>
          </Card>
        )}

        {angles && angles.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Positioning Opportunities</h4>
            <div className="space-y-2">
              {angles.map((angle, i) => (
                <div key={i} className="p-2.5 rounded bg-accent-tint/40 border border-accent/20">
                  <span className="text-xs font-semibold text-accent">{angle.title}</span>
                  <p className="text-[11px] text-ink-muted mt-0.5">{angle.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// Agent 5: Context Merger
export function ContextMergerOutput({ data }) {
  if (!data) return null;
  const { title, masterTitle, takeaways, thesis } = data;
  const displayTitle = masterTitle || title || "Synthesized Master Brief";

  return (
    <Card className="p-6 space-y-4">
      <div className="border-b border-border pb-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle">
          Synthesized Master Brief
        </span>
        <h3 className="text-lg font-bold text-ink tracking-tight mt-1">{displayTitle}</h3>
      </div>

      {takeaways && takeaways.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
            Key Strategic Takeaways
          </h4>
          <ul className="space-y-1.5 text-xs text-ink list-disc list-inside bg-raise/50 p-3 rounded-control border border-border">
            {takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {thesis && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
            Core Thesis & Strategic Angle
          </h4>
          <p className="text-xs text-ink leading-relaxed whitespace-pre-line bg-surface p-4 rounded border border-border font-sans">
            {thesis}
          </p>
        </div>
      )}
    </Card>
  );
}

// Agent 6: Content Strategy
export function StrategyOutput({ data }) {
  if (!data) return null;
  const { types, selectedTypes, objective, audience, targetAudience, communicationStyle, channels } = data;
  const displayTypes = selectedTypes || types || [];
  const displayAudience = targetAudience || audience || "Decision Makers";

  return (
    <div className="space-y-6">
      {/* Types & Parameters */}
      <Card className="p-5 space-y-4">
        {displayTypes.length > 0 && (
          <div>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-2">Selected Content Formats</h4>
            <div className="flex flex-wrap gap-2">
              {displayTypes.map((type, i) => (
                <Badge key={i} variant="accent">{type}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border">
          <div>
            <span className="text-[11px] font-mono uppercase text-ink-subtle">Objective</span>
            <p className="text-xs font-semibold text-ink mt-0.5">{objective || "Demand Generation"}</p>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-ink-subtle">Target Audience</span>
            <p className="text-xs font-semibold text-ink mt-0.5">{displayAudience}</p>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-ink-subtle">Communication Style</span>
            <p className="text-xs font-semibold text-ink mt-0.5">{communicationStyle || "Authoritative & Data-Backed"}</p>
          </div>
        </div>
      </Card>

      {/* Distribution Matrix */}
      {channels && channels.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Distribution Channels Matrix
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead>Format & Angle</TableHead>
                <TableHead>Frequency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((ch, i) => (
                <TableRow key={i}>
                  <TableCell className="font-semibold text-xs text-ink">{ch.channel}</TableCell>
                  <TableCell className="text-xs text-ink-muted">{ch.format}</TableCell>
                  <TableCell className="font-mono text-xs text-accent">{ch.frequency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// Agent 7: Content Planning
export function PlanningOutput({ data }) {
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedItem, setSelectedItem] = useState(null);

  const calendarItems = Array.isArray(data) ? data : (data?.schedule || []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          Editorial Calendar & Agenda
        </h4>
        <div className="inline-flex p-0.5 bg-raise border border-border rounded-control text-xs">
          <button
            onClick={() => setViewMode("monthly")}
            className={`px-3 py-1 rounded-control ${viewMode === "monthly" ? "bg-surface text-ink font-semibold" : "text-ink-muted"}`}
          >
            Monthly Grid
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={`px-3 py-1 rounded-control ${viewMode === "weekly" ? "bg-surface text-ink font-semibold" : "text-ink-muted"}`}
          >
            Weekly Agenda
          </button>
        </div>
      </div>

      {viewMode === "monthly" ? (
        <div className="bg-surface rounded-card border border-border p-4">
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs text-ink-subtle pb-2 border-b border-border">
            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>
          <div className="grid grid-cols-7 gap-1 pt-2 min-h-[240px]">
            {Array.from({ length: 28 }).map((_, idx) => {
              const dayNum = idx + 1;
              const matchingItem = calendarItems.find((item) => {
                const dateStr = item.date || item.scheduledDate;
                return dateStr && String(dateStr).endsWith(`-${dayNum < 10 ? '0' + dayNum : dayNum}`);
              });

              return (
                <div
                  key={idx}
                  onClick={() => matchingItem && setSelectedItem(matchingItem)}
                  className={`p-2 rounded border border-border/50 min-h-[60px] flex flex-col justify-between cursor-pointer transition-colors ${
                    matchingItem ? "bg-accent-tint/30 hover:bg-accent-tint" : "bg-raise/30 hover:bg-raise"
                  }`}
                >
                  <span className="text-[10px] font-mono text-ink-subtle">{dayNum}</span>
                  {matchingItem && (
                    <div className="space-y-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      <p className="text-[10px] font-medium text-ink truncate">{matchingItem.title}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {calendarItems.map((item, idx) => (
            <Card key={idx} className="p-3 flex items-center justify-between cursor-pointer hover:border-accent" onClick={() => setSelectedItem(item)}>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-accent uppercase">{item.channel}</span>
                <p className="text-xs font-semibold text-ink">{item.title}</p>
              </div>
              <div className="text-right font-mono text-xs text-ink-muted">
                <div>{item.date || item.scheduledDate}</div>
                <div className="text-[10px] text-ink-subtle">{item.time || item.scheduledTime}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="p-4 rounded-card bg-surface border border-accent shadow-md flex items-start justify-between">
          <div className="space-y-1 text-xs">
            <span className="font-mono text-accent font-semibold">{selectedItem.channel} • Scheduled</span>
            <h5 className="font-semibold text-ink">{selectedItem.title}</h5>
            <p className="text-ink-muted font-mono">Date: {selectedItem.date || selectedItem.scheduledDate} at {selectedItem.time || selectedItem.scheduledTime || '10:00 AM'}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setSelectedItem(null)}>Close</Button>
        </div>
      )}
    </div>
  );
}

// Agent 8: SEO Output
export function SeoOutput({ data }) {
  if (!data) return null;
  const { keywords, serpPreview, serpTitle, serpUrl, serpDescription, internalLinks, faqs } = data;

  const displaySerp = serpPreview || (serpTitle ? { title: serpTitle, url: serpUrl || "https://example.com", description: serpDescription } : null);

  return (
    <div className="space-y-6">
      {/* Google SERP Preview Card */}
      {displaySerp && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Google SERP Snippet Preview
          </h4>
          <div className="p-4 rounded-card bg-surface border border-border space-y-1 font-sans">
            <div className="flex items-center gap-1.5 text-xs text-[#202124]">
              <span className="text-[11px] text-[#5f6368] font-mono">{displaySerp.url}</span>
            </div>
            <h3 className="text-base text-[#1a0dab] font-medium hover:underline cursor-pointer">
              {displaySerp.title}
            </h3>
            <p className="text-xs text-[#4d5156] leading-relaxed">
              {displaySerp.description}
            </p>
          </div>
        </div>
      )}

      {/* Keywords Table */}
      {keywords && keywords.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Primary & Secondary Keywords
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Search Volume</TableHead>
                <TableHead>Keyword Difficulty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((kw, i) => (
                <TableRow key={i}>
                  <TableCell className="font-mono text-xs font-semibold text-ink">{kw.keyword}</TableCell>
                  <TableCell>
                    <Badge variant="accent">{kw.intent || "Informational"}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{kw.volume || "10K"}</TableCell>
                  <TableCell className="font-mono text-xs">{kw.difficulty || "Medium"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Internal Links & FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internalLinks && internalLinks.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Internal Linking Opportunities</h4>
            <div className="space-y-2 text-xs">
              {internalLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between font-mono bg-raise/60 p-2 rounded">
                  <span className="text-ink-muted">{link.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent" />
                  <span className="text-accent">{link.to}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {faqs && faqs.length > 0 && (
          <Card>
            <h4 className="text-xs font-mono uppercase text-ink-subtle mb-3">Suggested FAQs</h4>
            <ul className="space-y-2 text-xs text-ink list-disc list-inside">
              {faqs.map((faq, i) => (
                <li key={i} className="leading-snug">{faq}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

// Agent 9: Content Generation
export function ContentGenOutput({ outputs, runId, runTopic, onUpdateStatus }) {
  const { toast } = useToast();
  const [commentInput, setCommentInput] = useState({});
  const [activeCommentAsset, setActiveCommentAsset] = useState(null);

  if (!outputs) return null;

  const assetsList = [];
  if (outputs.blogPost) assetsList.push({ type: "Blog Post", ...outputs.blogPost });
  if (outputs.linkedinPosts) {
    outputs.linkedinPosts.forEach((lp) => assetsList.push({ type: "LinkedIn Post", ...lp }));
  }
  if (outputs.instagramPosts) {
    outputs.instagramPosts.forEach((ip) => assetsList.push({ type: "Instagram Post", ...ip }));
  }
  if (outputs.newsletter) {
    assetsList.push({ type: "Newsletter", ...outputs.newsletter });
  }
  if (outputs.emailSequence) {
    outputs.emailSequence.forEach((em) => assetsList.push({ type: "Email Content", ...em }));
  }
  if (outputs.adVariants) {
    outputs.adVariants.forEach((ad) => assetsList.push({ type: "Ad Copy Variant", ...ad }));
  }
  if (outputs.landingPage) {
    assetsList.push({ type: "Landing Page Copy", ...outputs.landingPage });
  }
  if (outputs.whitepaper) {
    assetsList.push({ type: "Whitepaper", ...outputs.whitepaper });
  }
  if (outputs.caseStudy) {
    assetsList.push({ type: "Case Study", ...outputs.caseStudy });
  }

  const handleAction = (assetId, action) => {
    onUpdateStatus(runId, assetId, action);
    toast({
      title: `Asset ${action.replace('_', ' ')}`,
      description: `Asset ${assetId} status set to ${action}.`,
      variant: action === "approved" ? "success" : "warning",
    });
    setActiveCommentAsset(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-border bg-surface p-4">
        <div className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle mb-2">
          Topic
        </div>
        <h2 className="text-lg font-semibold text-ink">{runTopic || 'Untitled Topic'}</h2>
      </div>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
          Generated Multi-Format Assets ({assetsList.length})
        </h4>
        <span className="text-[11px] font-mono text-ink-subtle">
          Supported Formats: Blogs, LinkedIn, Instagram, Newsletters, Landing Pages, Emails, Whitepapers, Case Studies
        </span>
      </div>

      <div className="space-y-4">
        {assetsList.map((asset) => (
          <Card key={asset.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Badge variant="accent">{asset.type}</Badge>
                <span className="text-xs font-semibold text-ink">{asset.title || asset.subject || asset.type}</span>
              </div>
              <StatusChip status={asset.status} />
            </div>

            {/* Document Content */}
            <div className="prose prose-sm max-w-none text-ink bg-raise/40 p-4 rounded border border-border font-sans">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {asset.content || asset.body || asset.headline || ""}
              </ReactMarkdown>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  icon={CheckCircle2}
                  onClick={() => handleAction(asset.id, "approved")}
                  disabled={asset.status === "approved"}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={MessageSquare}
                  onClick={() => setActiveCommentAsset(activeCommentAsset === asset.id ? null : asset.id)}
                >
                  Request Changes
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={XCircle}
                  className="text-danger hover:bg-rose-50"
                  onClick={() => handleAction(asset.id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            </div>

            {/* Request Changes Box */}
            {activeCommentAsset === asset.id && (
              <div className="p-3 bg-raise rounded border border-border space-y-2 mt-2">
                <Textarea
                  placeholder="Explain requested revisions for AI editor..."
                  value={commentInput[asset.id] || ""}
                  onChange={(e) => setCommentInput({ ...commentInput, [asset.id]: e.target.value })}
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAction(asset.id, "changes_requested")}
                  >
                    Submit Revisions
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// Agent 10: Creative Generation
export function CreativeGenOutput({ outputs, runId, onUpdateStatus }) {
  const { toast } = useToast();
  const creativeList = outputs?.creativeAssets || [
    { id: "asset-c1", title: "Architecture Flow Diagram", type: "Architecture Diagram", dimensions: "1920x1080 SVG", status: "pending" },
    { id: "asset-c2", title: "Social Content Header", type: "Infographic", dimensions: "1200x630 PNG", status: "pending" }
  ];

  const handleAction = (assetId, action) => {
    onUpdateStatus(runId, assetId, action);
    toast({
      title: `Creative Asset ${action}`,
      description: `Asset ${assetId} status updated.`,
      variant: action === "approved" ? "success" : "info",
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
        Creative Assets & Visual Diagrams
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {creativeList.map((asset) => (
          <Card key={asset.id} className="p-4 space-y-3">
            {/* Labeled Geometric SVG Placeholder */}
            <div className="w-full h-40 rounded bg-raise border border-border flex flex-col items-center justify-center p-4 text-center space-y-2 relative overflow-hidden">
              <svg className="w-12 h-12 text-ink-subtle opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-ink">{asset.title}</p>
                <p className="text-[10px] font-mono text-ink-subtle uppercase">{asset.type} • {asset.dimensions}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <StatusChip status={asset.status} />
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="primary" onClick={() => handleAction(asset.id, "approved")}>Approve</Button>
                <Button size="sm" variant="ghost" className="text-danger" onClick={() => handleAction(asset.id, "rejected")}>Reject</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
