import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag, BookOpen, Quote } from "lucide-react";

const blogPosts = [
  {
    slug: "engineering-autonomous-serp-telemetry",
    title: "The Engineering of Autonomous SERP Telemetry: Moving Beyond Search Volume",
    category: "Technical Telemetry",
    readTime: "6 min read",
    date: "July 24, 2026",
    author: "Dr. Aris Thorne",
    authorRole: "Head of AI Architecture",
    monogram: "AT",
    summary: "Why traditional keyword search volume is a lagging metric for enterprise B2B SaaS, and how real-time SERP cluster telemetry uncovers high-intent buyer queries.",
    content: [
      { type: "h2", text: "1. The Inadequacy of Static Search Volume" },
      { type: "p", text: "Most SEO tools provide 30-day historical averages for search queries. In rapidly evolving B2B sectors—such as industrial automation or bio-pharma infrastructure—buying triggers occur around regulatory shifts or new competitor features long before keyword tools update their indices." },
      { type: "p", text: "Autonomous SERP telemetry continuously parses Google search intent clusters, related questions, and competitive SERP snippets to calculate intent velocity rather than raw historical volume." },
      { type: "quote", text: "Keyword volume tells you where buyers were 30 days ago. SERP cluster velocity tells you where they are searching today." },
      { type: "h2", text: "2. Multi-Agent Synthesis in Keyword Clustering" },
      { type: "p", text: "Our Trend Identification Agent scans 48 search clusters simultaneously, feeding intent metadata into the SEO Agent to generate SERP-optimized meta titles and structural headings in under 5 seconds." },
      { type: "h2", text: "3. Takeaways for Growth Teams" },
      { type: "p", text: "1. Focus on long-tail technical queries over vanity keywords.\n2. Align content strategy directly with buyer friction points identified in search questions.\n3. Automate meta title iteration based on live competitor SERP changes." }
    ]
  },
  {
    slug: "why-cloud-only-predictive-maintenance-fails",
    title: "Why Cloud-Only Predictive Maintenance Fails in Smart Manufacturing",
    category: "AI Strategy",
    readTime: "8 min read",
    date: "July 18, 2026",
    author: "Sarah Lin",
    authorRole: "Principal Industrial Strategist",
    monogram: "SL",
    summary: "An in-depth analysis of cloud latency, bandwidth costs, and network security risks when deploying anomaly detection across legacy factory PLCs.",
    content: [
      { type: "h2", text: "1. The High Cost of Streaming High-Frequency PLC Sensor Data" },
      { type: "p", text: "Streaming raw vibration and acoustic telemetry from 500 factory sensors to a public cloud model requires gigabytes of bandwidth daily and introduces latency that renders real-time automated shutoff impossible." },
      { type: "quote", text: "In high-speed stamping plants, a 200ms latency delay can result in $50,000 of destroyed tooling." },
      { type: "h2", text: "2. The Offline-First Edge AI Architecture" },
      { type: "p", text: "Running lightweight anomaly detection models directly on edge gateways connected via OPC UA or Modbus allows instantaneous local alerts while selectively batch-syncing summary statistics to the cloud." },
      { type: "h2", text: "3. Positioning Your Product in the Edge AI Market" },
      { type: "p", text: "When marketing edge solutions to manufacturing CXOs, highlight zero-cloud dependency for critical shutoffs and offline resiliency as your primary value drivers." }
    ]
  },
  {
    slug: "5-scada-positioning-mistakes",
    title: "5 SCADA Positioning Mistakes B2B SaaS Founders Make",
    category: "Case Studies",
    readTime: "5 min read",
    date: "July 10, 2026",
    author: "Marcus Vance",
    authorRole: "Guest Author, VP of Growth",
    monogram: "MV",
    summary: "Common messaging missteps when pitching modern SaaS platforms to legacy industrial plant operations leads and OT security teams.",
    content: [
      { type: "h2", text: "1. Over-promising Cloud Integration without OT Security Compliance" },
      { type: "p", text: "Operational Technology (OT) teams prioritize air-gapped security above all else. Claiming seamless cloud sync without detailing firewall isolation creates immediate deal resistance." },
      { type: "h2", text: "2. Confusing SCADA HMI with Predictive Analytics" },
      { type: "p", text: "HMI displays current state; predictive analytics forecasts future failure. Clearly separate operational visibility from automated intelligence in your marketing copy." },
      { type: "quote", text: "Plant engineers don't want another dashboard to monitor. They want specific actionable maintenance instructions." },
      { type: "h2", text: "3. Ignoring Legacy Protocol Backwards-Compatibility" },
      { type: "p", text: "Most factories run equipment manufactured 15–20 years ago. Emphasize native connectors for legacy protocols like Modbus RTU and Profibus." }
    ]
  }
];

export function BlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState("All");

  const categories = ["All", "Technical Telemetry", "AI Strategy", "Case Studies"];

  // Article Detail Page
  if (slug) {
    const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left font-sans">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate("/blog")} className="mb-6">
          Back to Articles
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Reading Measure (~68ch) */}
          <article className="lg:col-span-8 space-y-6 max-w-[68ch]">
            <div className="space-y-3 border-b border-border pb-6">
              <Badge variant="accent">{post.category}</Badge>
              <h1 className="text-2xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-xs font-mono text-ink-subtle pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-ink text-surface font-mono font-bold text-[10px] flex items-center justify-center">
                    {post.monogram}
                  </div>
                  <span className="font-semibold text-ink">{post.author}</span>
                </div>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Prose Content */}
            <div className="space-y-6 text-xs sm:text-sm text-ink leading-relaxed font-sans">
              {post.content.map((block, idx) => {
                if (block.type === "h2") {
                  return <h2 key={idx} className="text-lg font-bold text-ink pt-4 border-t border-border">{block.text}</h2>;
                }
                if (block.type === "quote") {
                  return (
                    <div key={idx} className="p-4 bg-raise border-l-4 border-accent rounded-r italic font-serif text-sm text-ink">
                      "{block.text}"
                    </div>
                  );
                }
                return <p key={idx} className="whitespace-pre-line">{block.text}</p>;
              })}
            </div>

            {/* Byline Box */}
            <div className="p-4 bg-raise rounded border border-border flex items-center gap-3 mt-8">
              <div className="w-10 h-10 rounded-full bg-ink text-surface font-mono font-bold text-sm flex items-center justify-center shrink-0">
                {post.monogram}
              </div>
              <div>
                <h4 className="text-xs font-bold text-ink">{post.author}</h4>
                <p className="text-[11px] font-mono text-ink-subtle">{post.authorRole} • Everline Research</p>
              </div>
            </div>
          </article>

          {/* Sticky Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-24 p-5 bg-surface border border-border rounded-card space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Table of Contents</h3>
              <ul className="space-y-2 text-xs text-ink-muted">
                {post.content.filter((b) => b.type === "h2").map((h, i) => (
                  <li key={i} className="hover:text-accent cursor-pointer truncate">
                    {h.text}
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-border space-y-2">
                <span className="text-[10px] font-mono uppercase text-ink-subtle block">Share Article</span>
                <Button variant="secondary" size="sm" className="w-full">
                  Copy Article Link
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Index Page
  const filteredPosts = selectedCat === "All" ? blogPosts : blogPosts.filter((p) => p.category === selectedCat);
  const featured = blogPosts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent">Resources & Insights</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Engineering & B2B Growth Telemetry Articles
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Deep dives into multi-agent AI pipelines, website auditing, and industrial SaaS positioning.
        </p>
      </div>

      {/* Featured Post Card */}
      <Card className="p-8 bg-surface border-border space-y-4 hover:border-accent transition-colors">
        <div className="flex items-center gap-2">
          <Badge variant="accent">Featured Post</Badge>
          <span className="text-xs font-mono text-ink-subtle">{featured.category} • {featured.readTime}</span>
        </div>
        <Link to={`/blog/${featured.slug}`} className="block group">
          <h2 className="text-2xl font-bold text-ink group-hover:text-accent transition-colors">
            {featured.title}
          </h2>
        </Link>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
          {featured.summary}
        </p>
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-mono text-ink-subtle">By {featured.author} • {featured.date}</span>
          <Link to={`/blog/${featured.slug}`} className="text-xs font-semibold text-accent flex items-center gap-1">
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        <span className="text-xs font-mono uppercase text-ink-subtle mr-2">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 text-xs font-medium rounded-control transition-colors ${
              selectedCat === cat ? "bg-accent text-white font-semibold" : "bg-raise text-ink-muted hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.slug} className="p-6 space-y-4 bg-surface border-border hover:border-accent transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-subtle">
                <span>{post.category}</span>
                <span>{post.readTime}</span>
              </div>

              <Link to={`/blog/${post.slug}`} className="block group">
                <h3 className="text-base font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h3>
              </Link>

              <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-subtle">
              <span>{post.date}</span>
              <Link to={`/blog/${post.slug}`} className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                <span>Read</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
