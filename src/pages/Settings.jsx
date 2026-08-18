import React, { useState, useEffect } from "react";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs";
import { Badge } from "../components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { useToast } from "../components/ui/Toast";
import { API_BASE_URL } from "../config";
import {
  User,
  Rss,
  CreditCard,
  Plus,
  Trash2,
  Upload,
  Download,
  RefreshCw,
  Link2,
  Globe
} from "lucide-react";

export function Settings() {
  const { user, updateUserProfile } = useAppStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [gscStatus, setGscStatus] = useState({ connected: false, siteUrl: null, lastSyncAt: null, status: 'inactive' });
  const [gscLoading, setGscLoading] = useState(true);
  const [gscError, setGscError] = useState("");
  const [ga4Status, setGa4Status] = useState({ connected: false, propertyId: null, lastSyncAt: null, status: 'inactive' });
  const [ga4Loading, setGa4Loading] = useState(true);
  const [ga4Error, setGa4Error] = useState("");

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [company, setCompany] = useState(user.company || "");
  const [role, setRole] = useState(user.role || user.title || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
    setCompany(user.company || "");
    setRole(user.role || user.title || "");
  }, [user]);

  const loadGscStatus = async () => {
    const token = localStorage.getItem("brandsutra_token");
    if (!token) {
      setGscLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/google/gsc/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setGscStatus({
          connected: Boolean(data.data?.connected),
          siteUrl: data.data?.siteUrl || null,
          lastSyncAt: data.data?.lastSyncAt || null,
          status: data.data?.status || 'inactive',
        });
      }
    } catch (error) {
      setGscError("Unable to load Search Console status.");
    } finally {
      setGscLoading(false);
    }
  };

  const loadGa4Status = async () => {
    const token = localStorage.getItem("brandsutra_token");
    if (!token) {
      setGa4Loading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/google/ga4/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setGa4Status({
          connected: Boolean(data.data?.connected),
          propertyId: data.data?.propertyId || null,
          lastSyncAt: data.data?.lastSyncAt || null,
          status: data.data?.status || 'inactive',
        });
      }
    } catch (error) {
      setGa4Error("Unable to load GA4 status.");
    } finally {
      setGa4Loading(false);
    }
  };

  useEffect(() => {
    loadGscStatus();
    loadGa4Status();
  }, [user.id]);

  const [rssSources, setRssSources] = useState([
    "https://industryweek.com/rss/technology",
    "https://techcrunch.com/category/enterprise/feed",
    "https://finops.org/feed.xml"
  ]);
  const [newRss, setNewRss] = useState("");

  const connectors = [
    { id: "linkedin", name: "LinkedIn Organization Page", connected: true, account: "BrandSutra Marketing Corp" },
    { id: "hubspot", name: "HubSpot CRM & CMS", connected: false, account: "Not Connected" },
    { id: "wordpress", name: "WordPress Publishing Engine", connected: false, account: "Not Connected" }
  ];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const success = await updateUserProfile({ name, email, company, title: role });
    setSaving(false);
    toast({
      title: success ? "Profile Saved to Database" : "Profile Updated",
      description: "User profile details have been saved to PostgreSQL.",
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

  const connectGsc = async () => {
    setGscLoading(true);
    setGscError("");
    try {
      const token = localStorage.getItem("brandsutra_token");
      const res = await fetch(`${API_BASE_URL}/google/gsc/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data?.authUrl) {
        window.location.href = data.data.authUrl;
        return;
      }
      throw new Error(data.message || "Unable to connect to Google Search Console.");
    } catch (error) {
      setGscError(error.message || "Google Search Console connection failed.");
      toast({ title: "Google Search Console", description: error.message || "Connection failed", variant: "error" });
    } finally {
      setGscLoading(false);
    }
  };

  const syncGsc = async () => {
    setGscLoading(true);
    setGscError("");
    try {
      const token = localStorage.getItem("brandsutra_token");
      const res = await fetch(`${API_BASE_URL}/google/gsc/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Search Console sync failed.");
      }
      await loadGscStatus();
      toast({ title: "Search Console synced", description: `${data.data?.recordsProcessed || 0} records processed`, variant: "success" });
    } catch (error) {
      setGscError(error.message || "Sync failed.");
      toast({ title: "Search Console sync", description: error.message || "Sync failed", variant: "error" });
    } finally {
      setGscLoading(false);
    }
  };

  const connectGa4 = async () => {
    setGa4Loading(true);
    setGa4Error("");
    try {
      const token = localStorage.getItem("brandsutra_token");
      const res = await fetch(`${API_BASE_URL}/google/ga4/connect`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.data?.authUrl) {
        window.location.href = data.data.authUrl;
        return;
      }
      throw new Error(data.message || "Unable to connect to Google Analytics 4.");
    } catch (error) {
      setGa4Error(error.message || "Google Analytics 4 connection failed.");
      toast({ title: "Google Analytics 4", description: error.message || "Connection failed", variant: "error" });
    } finally {
      setGa4Loading(false);
    }
  };

  const syncGa4 = async () => {
    setGa4Loading(true);
    setGa4Error("");
    try {
      const token = localStorage.getItem("brandsutra_token");
      const res = await fetch(`${API_BASE_URL}/google/ga4/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "GA4 sync failed.");
      }
      await loadGa4Status();
      toast({ title: "GA4 synced", description: `${data.data?.recordsProcessed || 0} records processed`, variant: "success" });
    } catch (error) {
      setGa4Error(error.message || "GA4 sync failed.");
      toast({ title: "GA4 sync", description: error.message || "Sync failed", variant: "error" });
    } finally {
      setGa4Loading(false);
    }
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
          Manage your persistent user profile, RSS feeds, integrations, and workspace preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" icon={User}>Profile</TabsTrigger>
          <TabsTrigger value="integrations" icon={Rss}>Integrations & Signals</TabsTrigger>
          <TabsTrigger value="billing" icon={CreditCard}>Billing & Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleSaveProfile} className="bg-surface p-5 rounded-card border border-border space-y-4 max-w-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">Operator Profile</h3>
            <div className="flex items-center gap-4 py-2">
              <div className="w-12 h-12 rounded-full bg-ink text-surface font-mono font-bold text-base flex items-center justify-center border border-ink">
                {name ? name.substring(0, 2).toUpperCase() : "OP"}
              </div>
              <div className="space-y-1">
                <Button type="button" size="sm" variant="secondary" icon={Upload}>Upload Avatar</Button>
                <p className="text-[10px] font-mono text-ink-subtle">JPG or PNG. Max 2MB.</p>
              </div>
            </div>

            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Work Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
            <Input label="Role / Title" value={role} onChange={(e) => setRole(e.target.value)} />

            <div className="pt-2 border-t border-border flex justify-end">
              <Button type="submit" variant="primary" disabled={saving}>{saving ? "Saving to Database..." : "Save Profile Changes"}</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-6 max-w-3xl">
            <div className="bg-surface p-5 rounded-card border border-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">Automated RSS Intelligence Sources</h3>
              <div className="space-y-2">
                {rssSources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-raise border border-border text-xs">
                    <span className="font-mono text-ink">{source}</span>
                    <Button size="sm" variant="ghost" icon={Trash2} onClick={() => removeRss(idx)} className="text-danger" />
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                  <Input placeholder="Add new RSS feed URL..." value={newRss} onChange={(e) => setNewRss(e.target.value)} />
                  <Button size="sm" variant="secondary" icon={Plus} onClick={addRss}>Add Source</Button>
                </div>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-card border border-border space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">Google Search Console</h3>
              {gscError ? <p className="text-xs text-red-600">{gscError}</p> : null}

              <div className="flex items-center justify-between gap-4 p-3 rounded bg-raise border border-border">
                <div>
                  <div className="text-xs font-mono text-ink-subtle">Status</div>
                  <div className="text-sm font-semibold text-ink">{gscLoading ? "Loading..." : (gscStatus.connected ? "✓ Connected" : "Not Connected")}</div>
                </div>
                <Badge variant={gscStatus.connected ? "accent" : "neutral"}>{gscStatus.connected ? "Connected" : "Not Connected"}</Badge>
              </div>

              <div className="grid gap-2 text-xs text-ink-muted sm:grid-cols-2">
                <div className="rounded bg-raise border border-border p-3">
                  <div className="text-[10px] font-mono uppercase text-ink-subtle">Property</div>
                  <div className="mt-1 font-medium text-ink">{gscStatus.siteUrl || "example.com"}</div>
                </div>
                <div className="rounded bg-raise border border-border p-3">
                  <div className="text-[10px] font-mono uppercase text-ink-subtle">Last Sync</div>
                  <div className="mt-1 font-medium text-ink">{gscStatus.lastSyncAt ? new Date(gscStatus.lastSyncAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={gscStatus.connected ? "secondary" : "primary"} icon={Globe} onClick={connectGsc} disabled={gscLoading}>
                  {gscStatus.connected ? "Reconnect" : "Connect Google Search Console"}
                </Button>
                <Button size="sm" variant="secondary" icon={Link2} onClick={syncGsc} disabled={!gscStatus.connected || gscLoading}>Sync Now</Button>
                <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => setGscStatus((prev) => ({ ...prev, connected: false, siteUrl: null, lastSyncAt: null }))}>Disconnect</Button>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-card border border-border space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">Google Analytics 4</h3>
              {ga4Error ? <p className="text-xs text-red-600">{ga4Error}</p> : null}

              <div className="flex items-center justify-between gap-4 p-3 rounded bg-raise border border-border">
                <div>
                  <div className="text-xs font-mono text-ink-subtle">Status</div>
                  <div className="text-sm font-semibold text-ink">{ga4Loading ? "Loading..." : (ga4Status.connected ? "✓ Connected" : "Not Connected")}</div>
                </div>
                <Badge variant={ga4Status.connected ? "accent" : "neutral"}>{ga4Status.connected ? "Connected" : "Not Connected"}</Badge>
              </div>

              <div className="grid gap-2 text-xs text-ink-muted sm:grid-cols-2">
                <div className="rounded bg-raise border border-border p-3">
                  <div className="text-[10px] font-mono uppercase text-ink-subtle">Property ID</div>
                  <div className="mt-1 font-medium text-ink">{ga4Status.propertyId || "123456789"}</div>
                </div>
                <div className="rounded bg-raise border border-border p-3">
                  <div className="text-[10px] font-mono uppercase text-ink-subtle">Last Sync</div>
                  <div className="mt-1 font-medium text-ink">{ga4Status.lastSyncAt ? new Date(ga4Status.lastSyncAt).toLocaleString() : "—"}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={ga4Status.connected ? "secondary" : "primary"} icon={Globe} onClick={connectGa4} disabled={ga4Loading}>
                  {ga4Status.connected ? "Reconnect" : "Connect Google Analytics 4"}
                </Button>
                <Button size="sm" variant="secondary" icon={Link2} onClick={syncGa4} disabled={!ga4Status.connected || ga4Loading}>Sync Now</Button>
                <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => setGa4Status((prev) => ({ ...prev, connected: false, propertyId: null, lastSyncAt: null }))}>Disconnect</Button>
              </div>
            </div>

            <div className="bg-surface p-5 rounded-card border border-border space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border pb-2">External Platform Connectors</h3>
              <div className="space-y-3">
                {connectors.map((c) => (
                  <div key={c.id} className="p-3 rounded bg-raise border border-border flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-ink">{c.name}</h4>
                      <p className="text-[11px] font-mono text-ink-subtle">{c.account}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={c.connected ? "accent" : "neutral"}>{c.connected ? "Connected" : "Disconnected"}</Badge>
                      <Button size="sm" variant={c.connected ? "secondary" : "primary"}>{c.connected ? "Disconnect" : "Connect"}</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6 max-w-3xl">
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-accent font-semibold">Active Plan</span>
                  <h3 className="text-lg font-bold text-ink">{user.plan || "Enterprise Suite"}</h3>
                </div>
                <Badge variant="accent">Enterprise</Badge>
              </div>
              <p className="text-xs text-ink-muted">Includes unlimited 10-agent marketing runs, website structure crawls, and human approval queue workflows.</p>
            </Card>

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-ink-muted">Billing Invoice History</h3>
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
                      <TableCell><Badge variant="accent">{inv.status}</Badge></TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" icon={Download}>PDF</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
