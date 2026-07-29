import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Input, Select, Textarea } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { useToast } from "../components/ui/Toast";
import { Globe, Sparkles, HelpCircle, ArrowLeft, Plus, CheckCircle2 } from "lucide-react";

export function NewWebsiteAnalysis() {
  const navigate = useNavigate();
  const { createAnalysis } = useAppStore();
  const { toast } = useToast();

  const [url, setUrl] = useState("https://acmecloud.io");
  const [companyName, setCompanyName] = useState("Acme Cloud Technologies");
  const [overview, setOverview] = useState(
    "Acme Cloud provides automated multi-cloud cost governance and egress policy-as-code for enterprise DevOps teams."
  );
  const [productInput, setProductInput] = useState("");
  const [products, setProducts] = useState(["Cost Explorer Engine", "Egress Shield Policy"]);
  const [serviceInput, setServiceInput] = useState("");
  const [services, setServices] = useState(["Cloud Architecture Audit", "FinOps Onboarding"]);
  const [targetAudience, setTargetAudience] = useState("VP Infrastructure, Chief Information Security Officers, FinOps Leads");
  const [industry, setIndustry] = useState("Enterprise SaaS");
  const [selectedGoals, setSelectedGoals] = useState(["Increase Conversion", "Organic SEO Growth", "Generate Enterprise Leads"]);

  const [formErrors, setFormErrors] = useState({});

  const availableGoals = [
    "Increase Conversion",
    "Organic SEO Growth",
    "Reposition Brand",
    "Generate Enterprise Leads",
    "Reduce Bounce Rate",
    "Improve Mobile Experience"
  ];

  const addProduct = (e) => {
    if (e.key === "Enter" && productInput.trim()) {
      e.preventDefault();
      if (!products.includes(productInput.trim())) {
        setProducts([...products, productInput.trim()]);
      }
      setProductInput("");
    }
  };

  const removeProduct = (p) => setProducts(products.filter((item) => item !== p));

  const addService = (e) => {
    if (e.key === "Enter" && serviceInput.trim()) {
      e.preventDefault();
      if (!services.includes(serviceInput.trim())) {
        setServices([...services, serviceInput.trim()]);
      }
      setServiceInput("");
    }
  };

  const removeService = (s) => setServices(services.filter((item) => item !== s));

  const toggleGoal = (goal) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!url.trim()) {
      errors.url = "Website URL is required.";
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      errors.url = "URL must start with https:// or http://";
    }

    if (!companyName.trim()) {
      errors.companyName = "Business name is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      url,
      companyName,
      overview,
      products,
      services,
      targetAudience,
      industry,
      goals: selectedGoals,
    };

    const newId = createAnalysis(payload);
    toast({
      title: "Analysis Started",
      description: `3-agent crawler analyzing ${companyName}...`,
      variant: "success",
    });

    navigate(`/app/website/analyses/${newId}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-left font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
            Module 2 — Setup & Configuration
          </span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Analyze Website & Business Gaps
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Crawl site structure, evaluate business alignment, and generate a prioritized optimization roadmap.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/app/website")}
        >
          Back to List
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-surface p-5 rounded-card border border-border space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">
            Target Website & Business Context
          </h2>

          {/* Website URL with prefix affordance */}
          <div className="space-y-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
              Target Website URL
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-subtle select-none">
                https://
              </span>
              <input
                type="text"
                value={url.replace(/^https?:\/\//, "")}
                onChange={(e) => setUrl(`https://${e.target.value.replace(/^https?:\/\//, "")}`)}
                placeholder="acmecloud.io"
                className={`w-full h-9 pl-16 pr-3 text-xs bg-surface border rounded-control font-mono text-ink placeholder:text-ink-subtle focus-visible:outline-none ${
                  formErrors.url ? "border-danger" : "border-border focus-visible:border-accent"
                }`}
              />
            </div>
            {formErrors.url && (
              <span className="text-[11px] text-danger">{formErrors.url}</span>
            )}
          </div>

          <Input
            label="Business / Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            error={formErrors.companyName}
            placeholder="e.g. Acme Cloud Technologies"
          />

          <Textarea
            label="Company Overview & Core Value Proposition"
            rows={3}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Describe what the company offers and its primary market positioning..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Industry Vertical"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="Enterprise SaaS">Enterprise SaaS</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Healthcare IT">Healthcare IT</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="FinTech">FinTech</option>
              <option value="E-Commerce">E-Commerce</option>
            </Select>

            <Input
              label="Target Audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. VP Infrastructure, CISOs"
            />
          </div>

          {/* Products Chips Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
              Key Products (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface border border-border rounded-control min-h-[38px]">
              {products.map((p, i) => (
                <Badge key={i} variant="accent" className="cursor-pointer" onClick={() => removeProduct(p)}>
                  {p} <span className="ml-1 text-xs">×</span>
                </Badge>
              ))}
              <input
                type="text"
                placeholder="Add product..."
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                onKeyDown={addProduct}
                className="text-xs bg-transparent focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Services Chips Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
              Key Services (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface border border-border rounded-control min-h-[38px]">
              {services.map((s, i) => (
                <Badge key={i} variant="neutral" className="cursor-pointer" onClick={() => removeService(s)}>
                  {s} <span className="ml-1 text-xs">×</span>
                </Badge>
              ))}
              <input
                type="text"
                placeholder="Add service..."
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={addService}
                className="text-xs bg-transparent focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Business Goals Multi-select */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
              Primary Audit Goals
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {availableGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      isSelected
                        ? "bg-accent-tint text-accent border-accent font-medium"
                        : "bg-raise text-ink-muted border-border hover:border-border-strong"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="secondary" onClick={() => navigate("/app/website")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Sparkles}>
              Run Website Analysis
            </Button>
          </div>
        </form>

        {/* Right Instruction & Example Panel (5 cols) */}
        <div className="lg:col-span-5 bg-surface p-5 rounded-card border border-border space-y-4 font-sans text-left">
          <div className="flex items-center gap-2 text-ink border-b border-border pb-3">
            <HelpCircle className="w-4 h-4 text-accent shrink-0" />
            <h3 className="text-sm font-semibold">How to Provide Good Context</h3>
          </div>

          <div className="space-y-3 text-xs text-ink-muted leading-relaxed">
            <p>
              Providing clear company overview and product specifics helps the AI agents compare what you actually sell against what your website currently communicates.
            </p>
          </div>

          {/* Fully Filled Example */}
          <div className="p-4 rounded-control bg-raise border border-border space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                Example Input Benchmark
              </span>
              <Badge variant="accent">High Fidelity Context</Badge>
            </div>

            <div>
              <span className="text-[10px] font-mono text-ink-subtle uppercase block">URL & Company</span>
              <span className="font-mono text-ink font-semibold">https://acmecloud.io — Acme Cloud</span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-ink-subtle uppercase block">Overview</span>
              <p className="text-ink-muted mt-0.5">
                "Automated multi-cloud cost governance and egress policy-as-code for enterprise DevOps teams."
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-ink-subtle uppercase block">Products</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px]">Cost Engine</span>
                <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px]">Egress Shield</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-ink-subtle uppercase block">Target Audience</span>
              <span className="text-ink font-mono text-[11px]">VP Infrastructure, FinOps Directors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
