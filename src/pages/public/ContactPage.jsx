import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";
import { Mail, MapPin, Phone, MessageSquare, CheckCircle2, Clock } from "lucide-react";

export function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast("Please fill in all required fields.", "error");
      return;
    }
    setSubmitted(true);
    addToast("Message sent! Our team will respond within 2 hours.", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left font-sans">
      <div className="max-w-3xl space-y-4">
        <Badge variant="accent">Contact Us</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
          Get in Touch with the Everline Team
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Have questions about our multi-agent architecture or need a custom enterprise SLA? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-surface border-border space-y-6">
            <h2 className="text-lg font-bold text-ink">Send Us a Message</h2>

            {submitted ? (
              <div className="p-6 bg-accent-tint/30 border border-accent/40 rounded-card space-y-3">
                <CheckCircle2 className="w-8 h-8 text-accent" />
                <h3 className="text-base font-bold text-ink">Message Received</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Thank you for reaching out, {formData.name}. A solution architect from Everline will review your inquiry and respond to {formData.email} within 2 hours.
                </p>
                <Button variant="secondary" size="sm" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", company: "", message: "" }); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-ink">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Company Name</label>
                  <input
                    type="text"
                    placeholder="Acme Industrial Systems"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full h-9 px-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your multi-agent campaign or website audit requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 bg-raise border border-border rounded-control text-ink focus:outline-none focus:border-accent font-sans"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Right Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-raise border-border space-y-4">
            <h3 className="text-sm font-bold text-ink">Global Offices & Telemetry HQ</h3>
            <div className="space-y-3 text-xs text-ink-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">San Francisco HQ</p>
                  <p>500 Howard Street, Suite 400<br />San Francisco, CA 94105</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">Direct Support</p>
                  <p className="font-mono">support@everline.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">Response Time SLA</p>
                  <p>Growth: 4h • Enterprise: 1h</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-4 bg-surface rounded border border-border space-y-2 text-xs">
            <h4 className="font-semibold text-ink">Need urgent platform assistance?</h4>
            <p className="text-ink-muted">Existing customers can submit tickets directly through the in-app settings portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
