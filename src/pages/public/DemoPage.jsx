import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";
import { CheckCircle2, ArrowRight, Sparkles, Shield, Layers } from "lucide-react";
import { PipelinePreview } from "../../components/public/ProductPreview";

export function DemoPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "10-50",
    modules: ["marketing"],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleModule = (mod) => {
    if (formData.modules.includes(mod)) {
      setFormData({ ...formData, modules: formData.modules.filter((m) => m !== mod) });
    } else {
      setFormData({ ...formData, modules: [...formData.modules, mod] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) {
      addToast("Please fill in required fields.", "error");
      return;
    }
    setSubmitted(true);
    addToast("Demo request confirmed!", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent font-mono">1:1 Live Walkthrough</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Book a Personal Demo of the BrandSutra Platform
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          See how our 10-agent AI Marketing pipeline and 5-area Website Intelligence audit run in real-time on your domain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Lead Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-surface border-border space-y-6">
            <h2 className="text-lg font-bold text-ink">Schedule Your Demo</h2>

            {submitted ? (
              <div className="p-6 bg-accent-tint/30 border border-accent/40 rounded-card space-y-4 text-left">
                <CheckCircle2 className="w-10 h-10 text-accent" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-ink">Demo Request Confirmed</h3>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Thanks, {formData.name}! We'll be in touch within one business day to calendar your live 1:1 walkthrough for {formData.company}.
                  </p>
                </div>
                <div className="p-3 bg-surface rounded border border-border text-xs font-mono space-y-1">
                  <p className="text-ink-subtle uppercase text-[10px]">Selected Modules:</p>
                  <p className="text-accent font-semibold">{formData.modules.join(", ").toUpperCase()}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-ink">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-ink">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-ink">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme SaaS Inc."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-ink">Company Size</label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                    >
                      <option value="1-10">1-10 Employees</option>
                      <option value="10-50">10-50 Employees</option>
                      <option value="50-250">50-250 Employees</option>
                      <option value="250+">250+ Employees</option>
                    </select>
                  </div>
                </div>

                {/* Module Interest Selection */}
                <div className="space-y-2 pt-2">
                  <label className="font-semibold text-ink block">Modules of Interest:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label
                      onClick={() => toggleModule("marketing")}
                      className={`p-3 rounded border cursor-pointer flex items-center gap-2 transition-colors ${
                        formData.modules.includes("marketing")
                          ? "bg-accent-tint/40 border-accent text-accent font-semibold"
                          : "bg-raise border-border text-ink-muted"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Module 1: AI Marketing Agent</span>
                    </label>

                    <label
                      onClick={() => toggleModule("website")}
                      className={`p-3 rounded border cursor-pointer flex items-center gap-2 transition-colors ${
                        formData.modules.includes("website")
                          ? "bg-accent-tint/40 border-accent text-accent font-semibold"
                          : "bg-raise border-border text-ink-muted"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Module 2: Website Intelligence</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Specific Goals / Use Case (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Scaling weekly engineering blogs or auditing 5 domain portals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent font-sans"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full">
                  Confirm Demo Request
                </Button>

                <p className="text-[11px] font-mono text-ink-subtle text-center">
                  By clicking confirm, you agree to our Terms of Service & Privacy Policy.
                </p>
              </form>
            )}
          </Card>
        </div>

        {/* Right Product Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">What We'll Demonstrate Live</span>
            <PipelinePreview />
          </div>

          <div className="p-4 bg-raise border border-border rounded space-y-2 text-xs">
            <h4 className="font-bold text-ink flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>SOC 2 Compliant Infrastructure</span>
            </h4>
            <p className="text-ink-muted leading-relaxed">
              Your company data is never used to train global public models. Complete data isolation guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
