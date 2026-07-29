import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { InteractiveHeroPreview } from "../../components/public/ProductPreview";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Megaphone,
  Globe,
  BarChart2,
  FileText,
  ShieldCheck,
  Zap,
  Terminal,
  Clock,
  Lock,
} from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  const processSteps = [
    { number: "01", name: "Signal Ingestion", desc: "Automated RSS feeds & SERP volume cluster scraping" },
    { number: "02", name: "Market Research", desc: "Audience pain points & technical trend analysis" },
    { number: "03", name: "Competitive Gap", desc: "Rival positioning & messaging matrix extraction" },
    { number: "04", name: "Asset Synthesis", desc: "Multi-format copy, SEO tags & SVG flow diagrams" },
    { number: "05", name: "Human Gate", desc: "Revision control & one-click workspace export" },
  ];

  const deliverables = [
    { title: "Market Research Report", module: "AI Marketing Agent", desc: "Synthesized buyer pain points and technical trend clusters" },
    { title: "Competitive Intelligence", module: "AI Marketing Agent", desc: "Positioning gap analysis vs 4 primary rivals" },
    { title: "Publishing Calendar", module: "AI Marketing Agent", desc: "30-day scheduled multi-channel matrix" },
    { title: "SEO & SERP Recommendations", module: "AI Marketing Agent", desc: "Meta descriptions, intent tags & FAQ clusters" },
    { title: "Multi-Format Copywriting", module: "AI Marketing Agent", desc: "Blogs, LinkedIn posts, email sequences & ad briefs" },
    { title: "Creative Visual Assets", module: "AI Marketing Agent", desc: "Architecture SVG flow diagrams & infographics" },
    { title: "Website Structure Report", module: "Website Intelligence", desc: "Full DOM page inventory & depth crawl" },
    { title: "5-Area Gap Analysis", module: "Website Intelligence", desc: "Business, content, SEO, conversion & UX audit" },
    { title: "Website Health Score (0-100)", module: "Website Intelligence", desc: "Category-wise scorecard & industry benchmarks" },
    { title: "Improvement Roadmap", module: "Website Intelligence", desc: "Phased Now / Next / Later execution plan" },
  ];

  const testimonials = [
    {
      quote: "Everline replaced our fragmented agency retainers with a continuous 10-agent pipeline. We went from shipping 4 articles per month to 24 approved, high-converting campaign assets in a fraction of the time.",
      author: "Marcus Vance",
      role: "VP of Growth",
      company: "Cognitive SCADA Systems",
      monogram: "C",
      metric: "+310% Asset Output",
    },
    {
      quote: "The Website Intelligence audit identified three critical conversion friction points on our primary enterprise product page in under 2 minutes. The Now/Next/Later execution roadmap gave our dev team instant clarity.",
      author: "Elena Rostova",
      role: "Head of Digital Marketing",
      company: "Vertex BioPharma IT",
      monogram: "V",
      metric: "4.8h Avg Campaign Turnaround",
    },
  ];

  return (
    <div className="space-y-20 pb-20 font-sans text-left">
      {/* Hero Section */}
      <section className="pt-12 md:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Asymmetric Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-raise border border-border text-xs font-mono text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Everline Platform Architecture 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.15]">
              Autonomous 10-agent pipeline for B2B marketing & website intelligence.
            </h1>

            <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl">
              Everline connects continuous RSS market signal scraping with an orchestrated multi-agent copywriting & audit engine to generate verified enterprise campaign deliverables.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button size="lg" variant="primary" icon={ArrowRight} onClick={() => navigate("/demo")}>
                Book a live demo
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate("/platform")}>
                Explore platform architecture
              </Button>
            </div>

            {/* Enterprise Trust Proof Points */}
            <div className="pt-4 border-t border-border/80 flex flex-wrap items-center gap-6 text-xs font-mono text-ink-subtle">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Deterministic DAG Orchestration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                <span>SOC 2 Type II Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-accent shrink-0" />
                <span>Human-in-the-Loop Gate</span>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Tabbed Sandbox */}
          <div className="lg:col-span-6">
            <InteractiveHeroPreview />
          </div>
        </div>
      </section>

      {/* Horizontal Process Execution Strip */}
      <section className="bg-raise border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
              Autonomous Campaign Execution Lifecycle
            </span>
            <span className="text-xs font-mono text-accent font-semibold">10-Agent Synchronization</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {processSteps.map((step, i) => (
              <div key={i} className="p-3 bg-surface rounded-card border border-border space-y-1">
                <span className="font-mono text-xs font-bold text-accent">{step.number}</span>
                <p className="text-xs font-semibold text-ink">{step.name}</p>
                <p className="text-[11px] text-ink-subtle leading-tight">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Platform Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Engineered for Technical Rigor</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            Built as a deterministic multi-agent DAG — not a generic chatbot.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Item 1 */}
          <div className="p-6 bg-surface rounded-card border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-raise border border-border flex items-center justify-center text-accent">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ink">10-Agent Directed Acyclic Graph</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Each agent operates with explicit context dependencies, JSON schema outputs, and fallback retry loops. No unscripted hallucinations.
              </p>
            </div>
            <div className="p-3 bg-raise rounded border border-border text-[11px] font-mono text-ink-subtle">
              Dependencies: Supervisor &rarr; Trend &rarr; Research &rarr; Copywriter &rarr; Gate
            </div>
          </div>

          {/* Bento Item 2 */}
          <div className="p-6 bg-surface rounded-card border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-raise border border-border flex items-center justify-center text-accent">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ink">Automated Market & SERP Scraping</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Scans RSS news feeds and search volume spikes every 24 hours. Launches campaigns automatically when opportunity scores exceed threshold.
              </p>
            </div>
            <div className="p-3 bg-raise rounded border border-border text-[11px] font-mono text-ink-subtle">
              Signal Frequency: Continuous RSS & SERP Volume Monitoring
            </div>
          </div>

          {/* Bento Item 3 */}
          <div className="p-6 bg-surface rounded-card border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded bg-raise border border-border flex items-center justify-center text-accent">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-ink">5-Area Website Intelligence</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Crawls website page DOM structures and compares site messaging against core business offerings to calculate a 0–100 Health Score.
              </p>
            </div>
            <div className="p-3 bg-raise rounded border border-border text-[11px] font-mono text-ink-subtle">
              Audit Scope: Business, SEO, Content, Conversion, UX
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Grid Band */}
      <section className="bg-raise border-y border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Production Outputs</span>
            <h2 className="text-2xl font-bold text-ink tracking-tight">
              17 Structured Deliverables Generated Per Campaign & Audit Run
            </h2>
            <p className="text-xs text-ink-muted">
              Every campaign run and website audit outputs production-ready markdown, JSON, and SVG assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deliverables.map((d, i) => (
              <div key={i} className="p-3.5 bg-surface rounded border border-border flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-accent font-semibold">{d.module}</span>
                  <h4 className="text-xs font-semibold text-ink">{d.title}</h4>
                  <p className="text-[11px] text-ink-subtle">{d.desc}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Customer Metrics & Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">Verified Outcomes</span>
          <h2 className="text-2xl font-bold text-ink tracking-tight">Validated by B2B SaaS Growth Teams</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 bg-surface rounded-card border border-border space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center">
                      {t.monogram}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">{t.author}</h4>
                      <p className="text-[11px] font-mono text-ink-subtle">{t.role} • {t.company}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {t.metric}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ink leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-border p-8 md:p-12 rounded-card space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">Get Started</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Deploy autonomous marketing & website intelligence today.
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              Schedule a 15-minute technical demo with our engineering team or explore the interactive platform directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" variant="primary" icon={ArrowRight} onClick={() => navigate("/demo")}>
              Book a live demo
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/signup")}>
              Create account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
