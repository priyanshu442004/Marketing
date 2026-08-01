import React, { useState } from "react";
import { useAppStore } from "../store/AppStore";
import { SEO } from "../components/common/SEO";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";
import {
  Calendar,
  Send,
  Clock,
  CheckCircle2,
  Copy,
  Filter,
  Search,
  Sparkles,
  Share2,
  FileText
} from "lucide-react";

export function ContentPlanningPage() {
  const { runs } = useAppStore();
  const { toast } = useToast();

  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledItems, setScheduledItems] = useState({});
  const [publishedItems, setPublishedItems] = useState({});

  // Extract all content assets from all runs in store
  const allAssets = [];

  runs.forEach((run) => {
    if (run.outputs?.blogPost) {
      allAssets.push({
        id: run.outputs.blogPost.id || `blog-${run.id}`,
        runId: run.id,
        runTopic: run.topic,
        title: run.outputs.blogPost.title || "Long-form Strategy Blog Article",
        platform: "Blog",
        preview: run.outputs.blogPost.excerpt || run.outputs.blogPost.title,
        content: run.outputs.blogPost.content || run.outputs.blogPost.title,
        status: run.outputs.blogPost.status || "approved",
      });
    }

    if (run.outputs?.linkedinPosts) {
      run.outputs.linkedinPosts.forEach((post, i) => {
        allAssets.push({
          id: post.id || `li-${run.id}-${i}`,
          runId: run.id,
          runTopic: run.topic,
          title: `LinkedIn Post #${i + 1}`,
          platform: "LinkedIn",
          preview: post.text || post.preview,
          content: post.text || post.preview,
          status: post.status || "approved",
        });
      });
    }

    if (run.outputs?.emailSequence) {
      run.outputs.emailSequence.forEach((em, i) => {
        allAssets.push({
          id: em.id || `em-${run.id}-${i}`,
          runId: run.id,
          runTopic: run.topic,
          title: `Email #${i + 1}: ${em.subject || "Campaign Touchpoint"}`,
          platform: "Newsletter",
          preview: em.preview || em.body,
          content: em.body || em.preview,
          status: em.status || "approved",
        });
      });
    }

    if (run.outputs?.adVariants) {
      run.outputs.adVariants.forEach((ad, i) => {
        allAssets.push({
          id: ad.id || `ad-${run.id}-${i}`,
          runId: run.id,
          runTopic: run.topic,
          title: `Ad Variant: ${ad.platform || "Paid Ad"}`,
          platform: "Ads",
          preview: ad.headline || ad.copy,
          content: `${ad.headline}\n${ad.copy}`,
          status: ad.status || "approved",
        });
      });
    }
  });

  // Fallback defaults if no runs exist yet
  const displayAssets = allAssets.length > 0 ? allAssets : [
    {
      id: "demo-1",
      runTopic: "AI Marketing Strategy",
      title: "The Future of Autonomous Operations",
      platform: "LinkedIn",
      preview: "A practical guide to combining human oversight with agent-driven workflows for faster execution.",
      content: "A practical guide to combining human oversight with agent-driven workflows for faster execution.",
      status: "approved",
    },
    {
      id: "demo-2",
      runTopic: "SaaS Product Growth",
      title: "Weekly Product Brief: New AI Workflow",
      platform: "Blog",
      preview: "Highlights the latest strategy updates and the operational gains unlocked by the new workflow.",
      content: "Highlights the latest strategy updates and the operational gains unlocked by the new workflow.",
      status: "approved",
    },
    {
      id: "demo-3",
      runTopic: "Customer Success Case",
      title: "Customer Story: Scaling With Confidence",
      platform: "Newsletter",
      preview: "A short narrative overview of how teams use structured review cycles to ship faster.",
      content: "A short narrative overview of how teams use structured review cycles to ship faster.",
      status: "approved",
    },
  ];

  const filteredAssets = displayAssets.filter((item) => {
    const matchesPlatform = platformFilter === "all" || item.platform.toLowerCase() === platformFilter.toLowerCase();
    const currentStatus = publishedItems[item.id] ? "published" : scheduledItems[item.id] ? "scheduled" : item.status;
    const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;
    const matchesQuery = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesStatus && matchesQuery;
  });

  const handleCopy = (text, title) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `Content for "${title}" copied.`,
      variant: "success",
    });
  };

  const handlePublishNow = (id, title) => {
    setPublishedItems((prev) => ({ ...prev, [id]: true }));
    toast({
      title: "Published Successfully",
      description: `"${title}" has been broadcast to your channel.`,
      variant: "success",
    });
  };

  const handleSchedule = (id, title) => {
    setScheduledItems((prev) => ({ ...prev, [id]: new Date(Date.now() + 86400000).toLocaleDateString() }));
    toast({
      title: "Content Scheduled",
      description: `"${title}" queued for tomorrow at 09:00 AM.`,
      variant: "info",
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-left font-sans">
      <SEO
        title="Content Planning & Editorial Calendar"
        description="Schedule, manage, and publish AI-generated marketing content across LinkedIn, Blogs, Email Newsletters, and Paid Ads."
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
            Module 1 — Content Planning & Publishing
          </span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Approved Content Calendar
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Review approved deliverables across all marketing runs, queue scheduling, or post immediately to target channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="accent" className="font-mono text-xs py-1 px-3">
            {displayAssets.length} Total Deliverables
          </Badge>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 bg-surface rounded-card border border-border space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-ink-subtle flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Platform:
          </span>
          {["all", "Blog", "LinkedIn", "Newsletter", "Ads"].map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-2.5 py-1 text-xs rounded-control transition-colors ${
                platformFilter === p
                  ? "bg-accent text-white font-semibold"
                  : "bg-raise border border-border text-ink-muted hover:text-ink"
              }`}
            >
              {p === "all" ? "All Channels" : p}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search content preview..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 bg-raise border border-border rounded-control text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Content Grid */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-surface rounded-card border border-border space-y-3">
          <FileText className="w-8 h-8 text-ink-subtle mx-auto" />
          <p className="text-sm font-semibold text-ink">No content matching selected filters</p>
          <p className="text-xs text-ink-muted">Try clearing search or switching channel filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssets.map((post) => {
            const isPublished = publishedItems[post.id];
            const scheduledDate = scheduledItems[post.id];

            return (
              <Card key={post.id} className="flex flex-col justify-between space-y-4 hover:border-accent/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="neutral" className="text-[10px] font-mono">
                      {post.platform}
                    </Badge>

                    {isPublished ? (
                      <Badge variant="accent" className="bg-emerald-500/10 text-emerald-600 font-mono text-[10px]">
                        <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Published
                      </Badge>
                    ) : scheduledDate ? (
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        <Clock className="w-3 h-3 mr-1 inline text-accent" /> {scheduledDate}
                      </Badge>
                    ) : (
                      <Badge variant="accent" className="font-mono text-[10px]">
                        Approved
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-sm font-bold text-ink line-clamp-2 mt-1">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-ink-subtle font-mono truncate">
                    Campaign: {post.runTopic}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="p-3 bg-raise rounded border border-border/60 text-xs text-ink-muted leading-relaxed line-clamp-4">
                    {post.preview}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={isPublished ? "secondary" : "primary"}
                        disabled={isPublished}
                        onClick={() => handlePublishNow(post.id, post.title)}
                        className="flex-1 justify-center text-xs"
                      >
                        <Send className="w-3 h-3 mr-1.5" />
                        {isPublished ? "Published" : "Post Now"}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={isPublished}
                        onClick={() => handleSchedule(post.id, post.title)}
                        className="justify-center text-xs"
                      >
                        <Calendar className="w-3 h-3" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(post.content || post.preview, post.title)}
                        className="p-2 text-ink-subtle hover:text-ink"
                        title="Copy content to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
