import React, { useState } from "react";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { Badge } from "../components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { useToast } from "../components/ui/Toast";
import {
  User,
  Rss,
  CreditCard,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Shield,
  Download,
  Upload
} from "lucide-react";

export function Settings() {
  const { user, setUser, resetDemoData } = useAppStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);
  const [role, setRole] = useState(user.role);

  // RSS Feeds state
  const [rssSources, setRssSources] = useState([
    "https://industryweek.com/rss/technology",
    "https://techcrunch.com/category/enterprise/feed",
    "https://finops.org/feed.xml"
  ]);
  const [newRss, setNewRss] = useState("");

  // Connectors state
  const [connectors, setConnectors] = useState([
    { id: "linkedin", name: "LinkedIn Organization Page", connected: true, account: "Everline Marketing Corp" },
    { id: "gsc", name: "Google Search Console", connected: true, account: "acmecloud.io" },
    { id: "hubspot", name: "HubSpot CRM & CMS", connected: false, account: "Not Connected" },
    { id: "wordpress", name: "WordPress Publishing Engine", connected: false, account: "Not Connected" }
  ]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name, email, company, role });
    toast({
      title: "Profile Updated",
      description: "User details updated successfully.",
      variant: "success",
    });
  };

  const addRss = () => {
    if (newRss && !rssSources.includes(newRss)) {
      setRssSources([...rssSources, newRss]);
      setNewRss("");
      toast({ title: "Feed Source Added", description: newRss, variant: "info" });
    }
  };

  const removeRss = (index) => {
    setRssSources(rssSources.filter((_, i) => i !== index));
  };

  const toggleConnector = (id) => {
    setConnectors(
      connectors.map((c) => {
        if (c.id !== id) return c;
        const newConnected = !c.connected;
        toast({
          title: newConnected ? `${c.name} Connected` : `${c.name} Disconnected`,
          variant: newConnected ? "success" : "info",
        });
        return {
          ...c,
          connected: newConnected,
          account: newConnected ? "Connected Account" : "Not Connected"
        };
      })
    );
  };

  const handleReset = () => {
    resetDemoData();
    toast({
      title: "Demo Data Restored",
      description: "State has been reset to initial prototype seed data.",
      variant: "success",
    });
  };

  const invoiceList = [
    { id: "INV-2026-007", date: "2026-07-01", amount: "$1,450.00", status: "Paid" },
    { id: "INV-2026-006", date: "2026-06-01", amount: "$1,450.00", status: "Paid" },
    { id: "INV-2026-005", date: "2026-05-01", amount: "$1,450.00", status: "Paid" }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
          Account & Operations Settings
        </span>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Settings</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Manage user profiles, automated RSS signals, external integrations, billing, and demo state.
        </p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" icon={User}>
            Profile
          </TabsTrigger>
          <TabsTrigger value="integrations" icon={Rss}>
            Integrations & Signals
          </TabsTrigger>
          <TabsTrigger value="billing" icon={CreditCard}>
            Billing & Invoices
          </TabsTrigger>
          <TabsTrigger value="demo" icon={RotateCcw}>
            Demo Control
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <form onSubmit={handleSaveProfile} className="bg-surface p-5 rounded-card border border-border space-y-4 max-w-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">
              Operator Profile
            </h3>

            {/* Avatar Upload Placeholder */}
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 rounded-full bg-ink text-surface font-mono font-bold text-base flex items-center justify-center border border-ink">
                AV
              </div>
              <div className="space-y-1">
                <Button type="button" size="sm" variant="secondary" icon={Upload}>
                  Upload Avatar
                </Button>
                <p className="text-[10px] font-mono text-ink-subtle">JPG or PNG. Max 2MB.</p>
              </div>
            </div>

            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Work Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input label="Role / Title" value={role} onChange={(e) => setRole(e.target.value)} />

            <div className="pt-2 border-t border-border flex justify-end">
              <Button type="submit" variant="primary">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-6 max-w-3xl">
            {/* RSS Manager */}
            <div className="bg-surface p-5 rounded-card border border-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">
                Automated RSS Intelligence Sources
              </h3>
              <div className="space-y-2">
                {rssSources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-raise border border-border text-xs">
                    <span className="font-mono text-ink">{source}</span>
                    <Button size="sm" variant="ghost" icon={Trash2} onClick={() => removeRss(idx)} className="text-danger" />
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                  <Input
                    placeholder="Add new RSS feed URL..."
                    value={newRss}
                    onChange={(e) => setNewRss(e.target.value)}
                  />
                  <Button size="sm" variant="secondary" icon={Plus} onClick={addRss}>
                    Add Source
                  </Button>
                </div>
              </div>
            </div>

            {/* Connectors List */}
            <div className="bg-surface p-5 rounded-card border border-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">
                External Platform Connectors
              </h3>
              <div className="space-y-3">
                {connectors.map((c) => (
                  <div key={c.id} className="p-3 rounded bg-raise border border-border flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-ink">{c.name}</h4>
                      <p className="text-[11px] font-mono text-ink-subtle">{c.account}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={c.connected ? "accent" : "neutral"}>
                        {c.connected ? "Connected" : "Disconnected"}
                      </Badge>
                      <Button
                        size="sm"
                        variant={c.connected ? "secondary" : "primary"}
                        onClick={() => toggleConnector(c.id)}
                      >
                        {c.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Billing */}
        <TabsContent value="billing">
          <div className="space-y-6 max-w-3xl">
            {/* Plan Card */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-semibold">Active Plan</span>
                  <h3 className="text-lg font-bold text-ink">{user.plan}</h3>
                </div>
                <Badge variant="accent">Enterprise</Badge>
              </div>
              <p className="text-xs text-ink-muted">
                Includes unlimited 10-agent campaign runs, website structure crawls, and human approval queue workflows.
              </p>
            </Card>

            {/* Invoice History */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">
                Billing Invoice History
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceList.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-semibold text-ink">{inv.id}</TableCell>
                      <TableCell className="font-mono text-xs">{inv.date}</TableCell>
                      <TableCell className="font-mono text-xs">{inv.amount}</TableCell>
                      <TableCell>
                        <Badge variant="accent">{inv.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" icon={Download}>
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Demo Reset */}
        <TabsContent value="demo">
          <Card className="p-5 space-y-4 max-w-xl border-amber-300 bg-amber-50/40">
            <div className="flex items-center gap-2 text-amber-900">
              <RotateCcw className="w-5 h-5 text-amber-800 shrink-0" />
              <h3 className="text-sm font-semibold">Restore Prototype Seed Data</h3>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              If mock data becomes corrupted or deleted during click-through demonstrations, click below to purge localStorage and restore initial seed runs and website analyses.
            </p>
            <div className="pt-2">
              <Button variant="primary" icon={RotateCcw} onClick={handleReset}>
                Reset Demo Data Now
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
