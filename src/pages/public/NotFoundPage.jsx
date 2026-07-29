import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BRAND } from "../../config";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md space-y-6">
        <Link to="/" className="inline-block">
          <span className="font-bold text-2xl tracking-tight text-ink">
            {BRAND}
            <span className="text-accent">.</span>
          </span>
        </Link>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-accent uppercase tracking-wider">404 Error</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            We couldn't find that page.
          </h1>
          <p className="text-xs text-ink-muted leading-relaxed">
            The link you followed may be broken or the page may have been moved.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="primary" icon={Home} onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button variant="secondary" onClick={() => navigate("/platform")}>
            View Platform
          </Button>
        </div>
      </div>
    </div>
  );
}
