import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Input, Select, Textarea } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../components/ui/Toast";
import {
  Activity,
  Target,
  ArrowLeft,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Info,
  Radio,
  Layers,
} from "lucide-react";

export function NewMarketingRun() {
  const navigate = useNavigate();
  const { createRun } = useAppStore();
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState(null); // 'automated' | 'manual'

  // Automated form state
  const [rssFeeds, setRssFeeds] = useState([
    "https://industryweek.com/rss/technology",
    "https://techcrunch.com/category/enterprise/feed"
  ]);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [autoIndustry, setAutoIndustry] = useState("Manufacturing");
  const [keywords, setKeywords] = useState(["Predictive Maintenance", "IoT Telemetry", "Edge AI"]);
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(["Market News", "Competitor Launches"]);
  const [frequency, setFrequency] = useState("Daily"); // 'Daily' | 'Weekly' | 'Custom'
  const [customCadence, setCustomCadence] = useState("Every 3 Days");

  // Manual form state
  const [topic, setTopic] = useState("Agentic AI & Autonomous SCADA Telemetry in Manufacturing");
  const [manualIndustry, setManualIndustry] = useState("Manufacturing");
  const [objective, setObjective] = useState("Generate Leads");
  const [targetAudience, setTargetAudience] = useState("VP Operations, Chief Technology Officers, Plant Managers");
  const [formErrors, setFormErrors] = useState({});

  const allCategories = ["Market News", "Competitor Launches", "Regulatory Shift", "Customer Pain Points", "Product Updates"];

  const addFeed = () => {
    if (newFeedUrl && !rssFeeds.includes(newFeedUrl)) {
      setRssFeeds([...rssFeeds, newFeedUrl]);
      setNewFeedUrl("");
    }
  };

  const removeFeed = (index) => {
    setRssFeeds(rssFeeds.filter((_, i) => i !== index));
  };

  const addKeyword = (e) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()]);
      }
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (selectedMethod === "manual") {
      if (!topic.trim()) errors.topic = "Topic is required for manual campaign run.";
      if (!targetAudience.trim()) errors.targetAudience = "Target audience is required.";
    } else {
      if (rssFeeds.length === 0) errors.rss = "At least one RSS feed is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload =
      selectedMethod === "manual"
        ? {
            topic,
            source: "Manual",
            industry: manualIndustry,
            objective,
            targetAudience,
          }
        : {
            topic: `Automated ${autoIndustry} Intelligence Stream`,
            source: "Automated",
            industry: autoIndustry,
            objective: "Build Awareness",
            targetAudience: "Enterprise Decision Makers",
          };

    const runId = createRun(payload);
    toast({
      title: "Campaign Run Started",
      description: `Initialized 10-agent pipeline for ${runId}.`,
      variant: "success",
    });

    navigate(`/marketing/runs/${runId}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
          Module 1 — Setup & Discovery
        </span>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          New Marketing Campaign Run
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Select execution methodology to trigger autonomous market intelligence and asset creation.
        </p>
      </div>

      {/* Step 1: Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
            Step 1: Choose Execution Method
          </h2>
          {selectedMethod && (
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
              onClick={() => setSelectedMethod(null)}
              className="text-xs"
            >
              Change Method
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Automated */}
          <div
            onClick={() => {
              setSelectedMethod("automated");
              setFormErrors({});
            }}
            className={`p-5 rounded-card border cursor-pointer transition-all duration-150 relative ${
              selectedMethod === "automated"
                ? "border-accent bg-accent-tint/40 shadow-sm"
                : "border-border bg-surface hover:border-border-strong hover:bg-raise/50"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-control border ${
                  selectedMethod === "automated"
                    ? "bg-accent text-white border-accent"
                    : "bg-raise text-ink border-border"
                }`}
              >
                <Radio className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink">
                  Automated Market Monitoring
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Continuously scan RSS feeds, news clusters, and competitors to surface high-converting campaign opportunities automatically.
                </p>
              </div>
            </div>
            {selectedMethod === "automated" && (
              <div className="absolute top-3 right-3 text-accent">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Card B: Manual */}
          <div
            onClick={() => {
              setSelectedMethod("manual");
              setFormErrors({});
            }}
            className={`p-5 rounded-card border cursor-pointer transition-all duration-150 relative ${
              selectedMethod === "manual"
                ? "border-accent bg-accent-tint/40 shadow-sm"
                : "border-border bg-surface hover:border-border-strong hover:bg-raise/50"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-control border ${
                  selectedMethod === "manual"
                    ? "bg-accent text-white border-accent"
                    : "bg-raise text-ink border-border"
                }`}
              >
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink">
                  Manual Topic Research
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Start from a specific strategic topic or campaign focus and trigger the full 10-agent research & copywriting workflow immediately.
                </p>
              </div>
            </div>
            {selectedMethod === "manual" && (
              <div className="absolute top-3 right-3 text-accent">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Form */}
      {selectedMethod && (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">
            Step 2: Configure Campaign Parameters
          </h2>

          {selectedMethod === "automated" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Automated Form Left */}
              <div className="lg:col-span-2 space-y-4 bg-surface p-5 rounded-card border border-border">
                {/* Repeatable RSS Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                    RSS Feed Sources
                  </label>
                  <div className="space-y-2">
                    {rssFeeds.map((feed, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input value={feed} readOnly className="bg-raise text-xs" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeed(idx)}
                          className="text-ink-subtle hover:text-danger shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      <Input
                        placeholder="https://example.com/rss.xml"
                        value={newFeedUrl}
                        onChange={(e) => setNewFeedUrl(e.target.value)}
                        error={formErrors.rss}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon={Plus}
                        onClick={addFeed}
                        className="shrink-0"
                      >
                        Add Feed
                      </Button>
                    </div>
                  </div>
                </div>

                <Select
                  label="Industry Focus"
                  value={autoIndustry}
                  onChange={(e) => setAutoIndustry(e.target.value)}
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                  <option value="Healthcare IT">Healthcare IT</option>
                  <option value="FinTech">FinTech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </Select>

                {/* Keywords Chips */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Target Keyword Clusters (Press Enter to add)
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface border border-border rounded-control min-h-[38px]">
                    {keywords.map((kw, i) => (
                      <Badge key={i} variant="accent" className="cursor-pointer" onClick={() => removeKeyword(kw)}>
                        {kw} <span className="ml-1 text-xs">×</span>
                      </Badge>
                    ))}
                    <input
                      type="text"
                      placeholder="Add keyword..."
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={addKeyword}
                      className="text-xs bg-transparent focus:outline-none flex-1 min-w-[120px]"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Monitoring Categories
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {allCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            isSelected
                              ? "bg-accent-tint text-accent border-accent font-medium"
                              : "bg-raise text-ink-muted border-border hover:border-border-strong"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Monitoring Frequency Segmented Control */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
                    Monitoring Cadence
                  </label>
                  <div className="inline-flex p-1 bg-raise border border-border rounded-control gap-1">
                    {["Daily", "Weekly", "Custom"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrequency(f)}
                        className={`px-4 py-1 text-xs font-medium rounded-control transition-colors ${
                          frequency === f
                            ? "bg-surface text-ink shadow-sm"
                            : "text-ink-muted hover:text-ink"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {frequency === "Custom" && (
                    <div className="pt-2">
                      <Input
                        label="Custom Cadence Expression"
                        value={customCadence}
                        onChange={(e) => setCustomCadence(e.target.value)}
                        helperText="e.g. Every 3 days at 08:00 UTC"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Info Panel Right */}
              <div className="bg-surface p-5 rounded-card border border-border space-y-4 h-fit">
                <div className="flex items-center gap-2 text-ink">
                  <Info className="w-4 h-4 text-accent shrink-0" />
                  <h3 className="text-sm font-semibold">How Automated Monitoring Works</h3>
                </div>
                <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-accent font-semibold">01</span>
                    <p>Scans configured RSS feeds & news signals every 24 hours.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-accent font-semibold">02</span>
                    <p>Identifies high-growth search query clusters and competitor gaps.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-accent font-semibold">03</span>
                    <p>Automatically triggers 10-agent pipeline when strategic score &gt; 80.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Manual Form Left */}
              <div className="lg:col-span-2 space-y-4 bg-surface p-5 rounded-card border border-border">
                <Textarea
                  label="Strategic Campaign Topic"
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  error={formErrors.topic}
                  placeholder="e.g. Agentic AI & Autonomous SCADA Telemetry in Manufacturing"
                  helperText="Define the specific thesis, product release, or industry trend to investigate."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Industry Vertical"
                    value={manualIndustry}
                    onChange={(e) => setManualIndustry(e.target.value)}
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Enterprise SaaS">Enterprise SaaS</option>
                    <option value="Healthcare IT">Healthcare IT</option>
                    <option value="FinTech">FinTech</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </Select>

                  <Select
                    label="Primary Business Objective"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                  >
                    <option value="Generate Leads">Generate Leads</option>
                    <option value="Build Awareness">Build Awareness</option>
                    <option value="Drive Signups">Drive Signups</option>
                    <option value="Establish Thought Leadership">Establish Thought Leadership</option>
                  </Select>
                </div>

                <Input
                  label="Target Audience & Key Decision Makers"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  error={formErrors.targetAudience}
                  placeholder="e.g. VP Operations, Chief Technology Officers, Plant Managers"
                />
              </div>

              {/* Run Preview Card Right */}
              <div className="bg-surface p-5 rounded-card border border-border space-y-4 h-fit">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
                    Run Preview
                  </span>
                  <Badge variant="accent">10 Agents</Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-ink-muted">Expected Deliverables:</span>
                    <span className="font-mono text-ink font-semibold">18 Assets</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/60">
                    <span className="text-ink-muted">Pipeline Duration:</span>
                    <span className="font-mono text-ink font-semibold">~8 Seconds</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-muted">Approval Gate:</span>
                    <span className="font-mono text-accent font-semibold">Required</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-1.5">
                  <div className="text-[11px] font-mono text-ink-subtle uppercase">Agents to execute:</div>
                  <div className="space-y-1 text-xs text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Market & Trend Intelligence</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Competitive Benchmark & Context</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Strategy, Editorial & SEO</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span>Multi-Format Copy & Creatives</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/marketing")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Sparkles}>
              Start Autonomous Run
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
