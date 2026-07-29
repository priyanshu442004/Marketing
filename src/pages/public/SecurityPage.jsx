import React from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ShieldCheck, Lock, Key, Server, FileText, CheckCircle2 } from "lucide-react";

export function SecurityPage() {
  const commitments = [
    { title: "SOC 2 Type II Certified", desc: "Annual independent third-party audits of security controls, availability, and confidentiality." },
    { title: "GDPR & CCPA Compliant", desc: "Strict data privacy controls, right-to-erasure workflows, and transparent subprocessor disclosures." },
    { title: "AES-256 Data Encryption", desc: "All telemetry data, search outputs, and generated copy are encrypted at rest (AES-256) and in transit (TLS 1.3)." },
    { title: "Zero Public Model Training", desc: "Your proprietary marketing data and research briefs are never used to train public LLM foundation models." },
  ];

  const subprocessors = [
    { name: "AWS Cloud Infrastructure", role: "Primary Hosting & Database Storage", region: "US-East / EU-Central" },
    { name: "Cloudflare Inc.", role: "DNS, DDoS Protection & Edge CDN", region: "Global Edge" },
    { name: "OpenAI Enterprise", role: "Dedicated Inference API Subprocessor", region: "US (Zero Data Retention)" },
    { name: "Anthropic Enterprise", role: "Dedicated Inference API Subprocessor", region: "US (Zero Data Retention)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent font-mono">Enterprise Trust</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Security, Compliance, and Data Protection Standards
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          How Everline safeguards enterprise data across multi-agent pipelines and website intelligence telemetry.
        </p>
      </div>

      {/* Security Commitments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {commitments.map((c, i) => (
          <Card key={i} className="p-6 bg-surface border-border space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold text-ink">{c.title}</h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">{c.desc}</p>
          </Card>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8 max-w-4xl">
        <div className="p-6 bg-raise border border-border rounded-card space-y-3">
          <h2 className="text-base font-bold text-ink">1. Infrastructure & Access Control</h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Everline operates on isolated tenant architectures. Multi-factor authentication (MFA) and Single Sign-On (SSO / SAML 2.0) are enforced across all corporate accounts. Access permissions follow strict Principle of Least Privilege (PoLP).
          </p>
        </div>

        <div className="p-6 bg-raise border border-border rounded-card space-y-3">
          <h2 className="text-base font-bold text-ink">2. Uptime & SLA Commitments</h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Our platform guarantees 99.9% uptime SLA backed by automated multi-region failovers. Real-time status monitoring is available on our dedicated status portal.
          </p>
        </div>
      </div>

      {/* Subprocessor List */}
      <div className="space-y-4 max-w-4xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-ink tracking-tight">Approved Third-Party Subprocessors</h2>
          <p className="text-xs text-ink-muted">List of third-party vendors utilized for infrastructure hosting and inference.</p>
        </div>

        <div className="border border-border rounded-card overflow-hidden bg-surface">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-raise border-b border-border text-[11px] text-ink-muted">
                <th className="p-3 font-semibold">Vendor</th>
                <th className="p-3 font-semibold">Role / Service</th>
                <th className="p-3 font-semibold">Data Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subprocessors.map((sub, i) => (
                <tr key={i}>
                  <td className="p-3 font-semibold text-ink">{sub.name}</td>
                  <td className="p-3 text-ink-muted">{sub.role}</td>
                  <td className="p-3 text-accent">{sub.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
