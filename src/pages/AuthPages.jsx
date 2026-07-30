import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { BRAND } from "../config";
import { Shield, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@brandsutra.com");
  const [password, setPassword] = useState("admin@123");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans text-left">
      {/* Left Form Column */}
      <div className="w-full md:w-1/2 bg-surface p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          {/* Logo Wordmark */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-ink">
              {BRAND}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <div className="mt-12 space-y-2">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Sign in to BrandSutra</h1>
            <p className="text-xs text-ink-muted">
              Enter your credentials to access your autonomous agent workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-sm">
            <Input
              label="Work Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              error={error}
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-ink">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-mono text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink text-xs focus:outline-none focus:border-accent"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center">
              Continue to Workspace
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
              onClick={() => navigate("/app")}
            >
              Continue with Google / SSO
            </Button>
          </form>
        </div>

        <div className="mt-8 text-xs text-ink-subtle">
          New here?{" "}
          <Link to="/signup" className="text-accent font-semibold hover:underline">
            Create an account
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
            BrandSutra turns raw industry signals into publish-ready multi-channel marketing deliverables with enterprise approval controls.
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
              Autonomous Smart Factory IoT Marketing Run
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
  const [password, setPassword] = useState("admin@123");

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans text-left">
      <div className="w-full md:w-1/2 bg-surface p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-ink">
              {BRAND}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <div className="mt-12 space-y-2">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Create your account</h1>
            <p className="text-xs text-ink-muted">
              Start your 14-day B2B marketing & website intelligence workspace.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); navigate("/app"); }} className="mt-8 space-y-4 max-w-sm">
            <Input label="Full Name" defaultValue="Saurabh Dey" />
            <Input label="Work Email" type="email" defaultValue="admin@brandsutra.com" />
            <Input label="Company Name" defaultValue="All Above Design Studio" />
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-ink">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink text-xs focus:outline-none focus:border-accent"
              />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">Strong</span>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full justify-center">
              Create Account & Launch Workspace
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full justify-center text-xs"
              onClick={() => navigate("/app")}
            >
              Continue with Google / SSO
            </Button>

            <p className="text-[11px] text-ink-subtle text-center pt-2">
              By continuing you agree to our{" "}
              <Link to="/terms" className="underline hover:text-ink">Terms</Link> and{" "}
              <Link to="/privacy" className="underline hover:text-ink">Privacy Policy</Link>.
            </p>
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
            Comprehensive Website & Marketing Intelligence
          </h2>
          <p className="text-xs text-surface/75 leading-relaxed">
            Full 10-agent multi-channel research, strategy, copywriting, and 5-area domain structure audit.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row font-sans text-left">
      <div className="w-full md:w-1/2 bg-surface p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-ink">
              {BRAND}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <div className="mt-12 space-y-2">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Reset your password</h1>
            <p className="text-xs text-ink-muted">
              Enter your work email address to receive password reset instructions.
            </p>
          </div>

          {submitted ? (
            <div className="mt-8 p-4 bg-accent-tint/30 border border-accent/40 rounded-card space-y-3 max-w-sm">
              <CheckCircle2 className="w-6 h-6 text-accent" />
              <p className="text-xs font-semibold text-ink">Check your inbox</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                If an account exists for <span className="font-mono font-bold text-ink">{email}</span>, password reset instructions have been sent.
              </p>
              <Button variant="secondary" size="sm" onClick={() => navigate("/login")}>
                Return to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-sm">
              <Input
                label="Work Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
              />

              <Button type="submit" variant="primary" className="w-full justify-center">
                Send Reset Link
              </Button>
            </form>
          )}
        </div>

        <div className="mt-8 text-xs text-ink-subtle">
          Remember your password?{" "}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-ink text-surface p-12 lg:p-16 flex-col justify-between">
        <div className="space-y-4 max-w-md">
          <span className="text-xs font-mono uppercase tracking-wider text-accent-tint">
            Account Security
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Encrypted Workspace Protection
          </h2>
        </div>
      </div>
    </div>
  );
}
