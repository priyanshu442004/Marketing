import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { PipelinePreview, WebsiteAuditPreview } from "../../components/public/ProductPreview";
import { ArrowLeft, ArrowRight, CheckCircle2, Building2, Quote } from "lucide-react";

const customerStories = [
  {
    slug: "cognitive-scada",
    company: "Cognitive SCADA Systems",
    industry: "Industrial IoT & Manufacturing",
    monogram: "C",
    metric: "72% Faster Marketing Launch",
    summary: "How Cognitive SCADA replaced manual agency copywriters with BrandSutra's 10-agent pipeline to scale content output across 4 verticals.",
    challenge: "Cognitive SCADA developed edge AI telemetry hardware for automotive plants, but their internal marketing team struggled to translate complex SCADA technical specs into engaging B2B marketing copy. Agencies required 3+ weeks per whitepaper.",
    approach: "Deployed BrandSutra's Module 1 (AI Marketing Agent) configured with automated RSS monitoring across industrial trade journals and competitor search clusters. Triggered 10-agent runs for weekly product briefs.",
    outcome: "Reduced content turnaround time from 21 days to under 48 hours. Produced 18 approved multi-format assets per month while maintaining 100% engineering review approval.",
    quote: "BrandSutra is the first platform that speaks our engineering domain language. The context merger agent synthesizes complex technical topics flawlessly.",
    author: "Marcus Vance, VP of Growth"
  },
  {
    slug: "vertex-biopharma",
    company: "Vertex BioPharma IT",
    industry: "Healthcare IT & Compliance",
    monogram: "V",
    metric: "14 Portals Audited in 1 Day",
    summary: "Vertex BioPharma used Website Intelligence to identify critical HIPAA messaging gaps and conversion friction across 14 international product landing pages.",
    challenge: "Managing 14 distinct sub-domains across regional markets led to messaging drift and unaligned lead generation forms. Manual site audits took months.",
    approach: "Ran BrandSutra's Module 2 (Website Intelligence) across all 14 domains, receiving individual 0–100 Health Scores and category scorecards for Business Alignment, SEO, and Conversion Readiness.",
    outcome: "Discovered high-severity conversion friction on 6 key demo request forms. Executed Phase 1 Now roadmap items to increase organic demo conversions by 28%.",
    quote: "The 5-area gap analysis gave our product managers an immediate prioritized roadmap. No more guessing what to fix first.",
    author: "Elena Rostova, Head of Digital Marketing"
  },
  {
    slug: "apex-automation",
    company: "Apex Automation",
    industry: "Enterprise SaaS & Robotic Process",
    monogram: "A",
    metric: "3.4x Higher Demo Conversion",
    summary: "Apex Automation combined Module 1 marketing execution with Module 2 website gap audits to align search intent with landing page copy.",
    challenge: "Apex ran paid search programs for RPA keywords, but landing page bounce rates exceeded 65% due to generic value propositions.",
    approach: "Utilized BrandSutra's SEO Agent SERP telemetry to rewrite landing page headers and deployed Module 2 to align CTA placement.",
    outcome: "Bounce rates dropped by 42% within two weeks. Organic search traffic grew 185% over 90 days across high-intent transactional query clusters.",
    quote: "Connecting market search telemetry directly to website gap analysis is a game-changer for B2B growth.",
    author: "David Chen, Chief Marketing Officer"
  }
];

export function CustomersPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Detail View
  if (slug) {
    const story = customerStories.find((s) => s.slug === slug) || customerStories[0];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left font-sans">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate("/customers")}>
          Back to Customer Stories
        </Button>

        {/* Story Header */}
        <div className="space-y-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-ink text-surface font-mono font-bold text-lg flex items-center justify-center">
              {story.monogram}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">{story.company}</h1>
              <p className="text-xs font-mono text-ink-subtle">{story.industry}</p>
            </div>
          </div>

          <div className="p-3 bg-accent-tint/30 border border-accent/30 rounded font-mono text-sm font-bold text-accent">
            Headline Impact: {story.metric}
          </div>
        </div>

        {/* Challenge / Approach / Outcome */}
        <div className="space-y-8 text-xs sm:text-sm text-ink leading-relaxed">
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-ink-subtle">The Challenge</h2>
            <p className="p-4 bg-surface rounded border border-border">{story.challenge}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-ink-subtle">The BrandSutra Approach</h2>
            <p className="p-4 bg-surface rounded border border-border">{story.approach}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-ink-subtle">Results & Business Outcome</h2>
            <p className="p-4 bg-surface rounded border border-border">{story.outcome}</p>
          </div>

          {/* Pulled Quote */}
          <div className="p-6 bg-raise border-l-4 border-accent rounded-r space-y-2 italic">
            <Quote className="w-6 h-6 text-accent opacity-50" />
            <p className="text-sm font-semibold text-ink">"{story.quote}"</p>
            <p className="text-xs font-mono text-ink-subtle not-italic">— {story.author}</p>
          </div>

          {/* Real Product Preview */}
          <div className="space-y-2 pt-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Platform Telemetry Utilized</h3>
            <PipelinePreview />
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-between items-center">
          <Button variant="secondary" onClick={() => navigate("/customers")}>
            Explore More Stories
          </Button>
          <Button variant="primary" icon={ArrowRight} onClick={() => navigate("/demo")}>
            Book a Demo
          </Button>
        </div>
      </div>
    );
  }

  // Index View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent">Customer Success</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          How Enterprise Teams Scale Growth with BrandSutra
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Read real case studies from B2B SaaS engineering and marketing leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {customerStories.map((story) => (
          <Card key={story.slug} className="p-6 space-y-4 bg-surface border-border hover:border-accent transition-colors flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center">
                  {story.monogram}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">{story.company}</h3>
                  <p className="text-[10px] font-mono text-ink-subtle">{story.industry}</p>
                </div>
              </div>

              <span className="inline-block text-xs font-mono font-bold text-accent bg-accent-tint/30 px-2 py-0.5 rounded border border-accent/20">
                {story.metric}
              </span>

              <p className="text-xs text-ink-muted leading-relaxed">{story.summary}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <Link to={`/customers/${story.slug}`} className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                <span>Read Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
