import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ChevronDown, MapPin, Briefcase } from "lucide-react";

export function CareersPage() {
  const navigate = useNavigate();
  const [expandedRole, setExpandedRole] = useState(null);

  const openRoles = [
    { id: 1, title: "Principal AI Telemetry Architect", dept: "Engineering", location: "San Francisco, CA / Remote", desc: "Lead the design of high-throughput multi-agent execution DAGs, real-time SERP telemetry scrapers, and context merger engines." },
    { id: 2, title: "Senior React & Design Systems Engineer", dept: "Product", location: "Remote (US/EU)", desc: "Build dense, high-fidelity B2B SaaS interfaces adhering to strict anti-AI design principles and custom component tokens." },
    { id: 3, title: "Enterprise Solutions Architect", dept: "Sales Engineering", location: "New York, NY", desc: "Partner with enterprise growth leaders to map custom website intelligence workflows and RSS telemetry configurations." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent">Careers at BrandSutra</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Join Us in Building the Future of Autonomous B2B Marketing
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          We're a fast-moving team of systems engineers, AI researchers, and product designers based in San Francisco and working remotely worldwide.
        </p>
      </div>

      {/* Open Roles */}
      <div className="space-y-4 max-w-4xl">
        <h2 className="text-xl font-bold text-ink tracking-tight">Open Opportunities</h2>

        <div className="space-y-3">
          {openRoles.map((role) => {
            const isExpanded = expandedRole === role.id;
            return (
              <Card
                key={role.id}
                className="p-5 bg-surface border-border cursor-pointer hover:border-accent transition-colors space-y-3"
                onClick={() => setExpandedRole(isExpanded ? null : role.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-ink">{role.title}</h3>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-ink-subtle mt-0.5">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {role.dept}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {role.location}</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-ink-subtle transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-border/60 space-y-3 text-xs text-ink-muted leading-relaxed">
                    <p>{role.desc}</p>
                    <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); navigate("/contact"); }}>
                      Apply via Email
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
