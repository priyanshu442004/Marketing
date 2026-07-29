import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BRAND } from "../../config";
import { Button } from "../ui/Button";
import { ChevronDown, Menu, X, Megaphone, Globe, Sparkles, Layers, ArrowRight } from "lucide-react";

export function PublicNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setPlatformMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl tracking-tight text-ink">
              {BRAND}
              <span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-ink-muted">
            {/* Platform Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
                className="flex items-center gap-1 hover:text-ink transition-colors py-2 focus:outline-none"
              >
                <span>Platform</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${platformMenuOpen ? "rotate-180 text-accent" : "text-ink-subtle"}`} />
              </button>

              {/* Mega-menu Popover */}
              {platformMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-surface border border-border rounded-card shadow-modal p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                  <Link
                    to="/platform"
                    onClick={() => setPlatformMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-control hover:bg-raise transition-colors group"
                  >
                    <Layers className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-ink group-hover:text-accent">Platform Architecture</p>
                      <p className="text-[11px] text-ink-subtle leading-tight">Overview of the 10-agent multi-agent pipeline</p>
                    </div>
                  </Link>

                  <Link
                    to="/platform/marketing-agent"
                    onClick={() => setPlatformMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-control hover:bg-raise transition-colors group"
                  >
                    <Megaphone className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-ink group-hover:text-accent">AI Marketing Agent</p>
                      <p className="text-[11px] text-ink-subtle leading-tight">Module 1 — Market signals to approved assets</p>
                    </div>
                  </Link>

                  <Link
                    to="/platform/website-intelligence"
                    onClick={() => setPlatformMenuOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-control hover:bg-raise transition-colors group"
                  >
                    <Globe className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-ink group-hover:text-accent">Website Intelligence</p>
                      <p className="text-[11px] text-ink-subtle leading-tight">Module 2 — 5-area audit & improvement roadmap</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/pricing" className={({ isActive }) => (isActive ? "text-ink font-semibold" : "hover:text-ink")}>
              Pricing
            </NavLink>
            <NavLink to="/customers" className={({ isActive }) => (isActive ? "text-ink font-semibold" : "hover:text-ink")}>
              Customers
            </NavLink>
            <NavLink to="/blog" className={({ isActive }) => (isActive ? "text-ink font-semibold" : "hover:text-ink")}>
              Resources
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "text-ink font-semibold" : "hover:text-ink")}>
              Company
            </NavLink>
          </nav>
        </div>

        {/* Right Desktop CTA Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Sign in
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/demo")}>
            Book a demo
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-control text-ink-muted hover:text-ink hover:bg-raise focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1 font-medium text-sm text-ink-muted divide-y divide-border/60">
            <div className="py-2 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-subtle block px-2">Platform Modules</span>
              <Link to="/platform" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Platform Architecture
              </Link>
              <Link to="/platform/marketing-agent" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                AI Marketing Agent (Module 1)
              </Link>
              <Link to="/platform/website-intelligence" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Website Intelligence (Module 2)
              </Link>
            </div>
            <div className="pt-3 space-y-2">
              <Link to="/pricing" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Pricing
              </Link>
              <Link to="/customers" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Customers & Case Studies
              </Link>
              <Link to="/blog" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Resources & Blog
              </Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Company & About
              </Link>
              <Link to="/integrations" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Integrations
              </Link>
              <Link to="/security" onClick={() => setMobileOpen(false)} className="block px-2 py-1 hover:text-ink">
                Security & Trust
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button variant="ghost" onClick={() => { setMobileOpen(false); navigate("/login"); }}>
              Sign in
            </Button>
            <Button variant="primary" onClick={() => { setMobileOpen(false); navigate("/demo"); }}>
              Book a demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
