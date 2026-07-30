import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Rss, Search, Share2, Globe, Database, MessageSquare, Code, ArrowRight } from "lucide-react";

export function IntegrationsPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");

  const integrations = [
    { name: "RSS & News Feed Scraper", cat: "Signals", icon: Rss, desc: "Continuously ingest industry RSS feeds and market signal updates into Module 1." },
    { name: "Google Search Console API", cat: "SEO Telemetry", icon: Search, desc: "Sync live impression, CTR, and search intent clusters to feed the SEO Agent." },
    { name: "LinkedIn Publishing Connector", cat: "Publishing", icon: Share2, desc: "Schedule and auto-draft multi-variant LinkedIn posts directly from approved runs." },
    { name: "WordPress & CMS Webhook", cat: "Publishing", icon: Globe, desc: "Export approved blog posts, meta titles, and featured diagrams to your CMS." },
    { name: "HubSpot Marketing Hub", cat: "CRM & Demand", icon: Database, desc: "Push landing page copy and lead nurture email sequences straight into HubSpot." },
    { name: "Slack Notifications & Approval", cat: "Workflow", icon: MessageSquare, desc: "Receive immediate Slack alerts when a 10-agent pipeline completes and requires review." },
    { name: "Developer API & Webhooks", cat: "Custom", icon: Code, desc: "Programmatically trigger marketing runs and retrieve JSON deliverable payloads." },
  ];

  const categories = ["All", "Signals", "SEO Telemetry", "Publishing", "CRM & Demand", "Workflow", "Custom"];

  const filtered = category === "All" ? integrations : integrations.filter((item) => item.cat === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent font-mono">Ecosystem Connectors</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Native Connectors & API Webhooks
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Connect BrandSutra's multi-agent pipeline to your existing content management systems, CRM tools, and alerting channels.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <span className="text-xs font-mono uppercase text-ink-subtle mr-2">Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-control transition-colors ${
              category === cat ? "bg-accent text-white font-semibold" : "bg-raise text-ink-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card key={i} className="p-6 bg-surface border-border space-y-4 hover:border-accent transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-card bg-raise border border-border flex items-center justify-center text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-ink-subtle uppercase px-2 py-0.5 bg-raise rounded border border-border">
                  {item.cat}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{item.name}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mt-1">{item.desc}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Request Integration CTA */}
      <div className="p-8 bg-raise rounded-card border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-ink">Need a custom enterprise connector?</h3>
          <p className="text-xs text-ink-muted">Our solutions team builds bespoke API connectors for enterprise plans.</p>
        </div>
        <Button variant="primary" icon={ArrowRight} onClick={() => navigate("/contact")}>
          Request Connector
        </Button>
      </div>
    </div>
  );
}
