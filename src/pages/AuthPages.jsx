import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Shield, Sparkles, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("alex.vance@everline.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans">
      {/* Left Form Column */}
      <div className="w-full md:w-1/2 bg-surface p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          {/* Logo Wordmark */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center">
              E
            </div>
            <span className="font-bold text-sm text-ink tracking-tight">Everline</span>
            <Badge variant="accent" className="ml-1 text-[10px]">Demo</Badge>
          </div>

          <div className="mt-12 space-y-2">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Sign in to Everline</h1>
            <p className="text-xs text-ink-muted">
              Enter your corporate credentials to access autonomous agent pipelines.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-sm">
            <Input
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              error={error}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" className="w-full justify-center">
              Continue to Dashboard
            </Button>

            <div className="relative py-2 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-surface px-2 text-[10px] font-mono text-ink-subtle uppercase">
                or
              </span>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full justify-center text-xs"
              onClick={() => navigate("/")}
            >
              Continue with Enterprise SSO
            </Button>
          </form>
        </div>

        <div className="mt-8 text-xs text-ink-subtle">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent font-semibold hover:underline">
            Request workspace access
          </Link>
        </div>
      </div>

      {/* Right Brand Panel Column */}
      <div className="hidden md:flex w-1/2 bg-ink text-surface p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        <div className="space-y-4 max-w-md relative z-10">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-tint">
            Autonomous Marketing Intelligence
          </span>
          <h2 className="text-2xl font-bold tracking-tight leading-snug">
            Orchestrate 10 specialized AI agents across market research, strategy, and content generation.
          </h2>
          <p className="text-xs text-surface/75 leading-relaxed">
            Everline turns raw industry signals into publish-ready multi-channel campaign deliverables with enterprise approval controls.
          </p>
        </div>

        {/* Static Product Card Preview */}
        <div className="p-4 rounded-card bg-surface/10 border border-surface/20 space-y-3 relative z-10 max-w-md text-xs font-mono">
          <div className="flex items-center justify-between border-b border-surface/20 pb-2">
            <span className="text-accent-tint font-semibold">RUN-2481 • Active Pipeline</span>
            <span className="text-surface/80 text-[10px]">Step 7 of 10</span>
          </div>
          <div className="space-y-1">
            <p className="text-surface font-sans font-semibold text-xs">
              Autonomous Smart Factory IoT Campaign
            </p>
            <p className="text-surface/60 text-[11px]">
              Outputs: 18 assets • 4 pending approval
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans">
      <div className="w-full md:w-1/2 bg-surface p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center">
              E
            </div>
            <span className="font-bold text-sm text-ink tracking-tight">Everline</span>
          </div>

          <div className="mt-12 space-y-2">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Create workspace account</h1>
            <p className="text-xs text-ink-muted">
              Start your 14-day B2B marketing & website intelligence trial.
            </p>
          </div>

          <form onSubmit={() => navigate("/")} className="mt-8 space-y-4 max-w-sm">
            <Input label="Full Name" defaultValue="Alex Vance" />
            <Input label="Work Email" type="email" defaultValue="alex.vance@everline.ai" />
            <Input label="Company Name" defaultValue="Everline Marketing Inc." />
            <Input label="Password" type="password" defaultValue="••••••••••••" />

            <Button type="submit" variant="primary" className="w-full justify-center">
              Create Account & Launch
            </Button>
          </form>
        </div>

        <div className="mt-8 text-xs text-ink-subtle">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-ink text-surface p-12 lg:p-16 flex-col justify-between">
        <div className="space-y-4 max-w-md">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-tint">
            Enterprise SaaS Platform
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Comprehensive Website & Campaign Intelligence
          </h2>
        </div>
      </div>
    </div>
  );
}
