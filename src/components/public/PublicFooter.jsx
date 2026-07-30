import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../../config";
import { Globe, Share2, ExternalLink, Rss } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-raise border-t border-border pt-12 pb-8 text-ink text-xs font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <Link to="/" className="inline-block">
              <span className="font-bold text-xl tracking-tight text-ink">
                {BRAND}
                <span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              Autonomous multi-agent marketing and website intelligence platform for enterprise B2B SaaS. Autonomous market telemetry, competitive strategy, and high-converting asset generation.
            </p>
            <div className="pt-2 flex items-center gap-3 text-ink-subtle">
              <a href="#" aria-label="Website" className="hover:text-ink transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Share" className="hover:text-ink transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" aria-label="External" className="hover:text-ink transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" aria-label="RSS Feed" className="hover:text-ink transition-colors">
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle">Product Modules</h4>
            <ul className="space-y-2 text-ink-muted">
              <li><Link to="/platform" className="hover:text-ink transition-colors">Platform Overview</Link></li>
              <li><Link to="/platform/marketing-agent" className="hover:text-ink transition-colors">AI Marketing Agent</Link></li>
              <li><Link to="/platform/website-intelligence" className="hover:text-ink transition-colors">Website Intelligence</Link></li>
              <li><Link to="/integrations" className="hover:text-ink transition-colors">Integrations</Link></li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle">Solutions</h4>
            <ul className="space-y-2 text-ink-muted">
              <li><Link to="/platform/marketing-agent" className="hover:text-ink transition-colors">Demand Generation</Link></li>
              <li><Link to="/platform/marketing-agent" className="hover:text-ink transition-colors">Content Operations</Link></li>
              <li><Link to="/customers" className="hover:text-ink transition-colors">Agencies & Growth Teams</Link></li>
              <li><Link to="/platform/website-intelligence" className="hover:text-ink transition-colors">Website Audits</Link></li>
            </ul>
          </div>

          {/* Resources & Company Col */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle">Resources & Company</h4>
            <ul className="space-y-2 text-ink-muted">
              <li><Link to="/blog" className="hover:text-ink transition-colors">Blog & Insights</Link></li>
              <li><Link to="/customers" className="hover:text-ink transition-colors">Customer Stories</Link></li>
              <li><Link to="/about" className="hover:text-ink transition-colors">About BrandSutra</Link></li>
              <li><Link to="/careers" className="hover:text-ink transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-ink transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline Bar */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-ink-subtle">
          <p>© 2026 BrandSutra Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-ink transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-ink transition-colors">Compliance & SOC 2</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
