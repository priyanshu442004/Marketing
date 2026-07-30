import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { StatusChip, Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { useToast } from "../components/ui/Toast";
import { PlusCircle, Search, Filter, MoreHorizontal, Eye, Copy, Archive, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function MarketingRunsList() {
  const navigate = useNavigate();
  const { runs } = useAppStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");

  const [activeMenuId, setActiveMenuId] = useState(null);

  // Filter runs based on active filters
  const filteredRuns = runs.filter((run) => {
    const matchesSearch =
      run.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      run.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSource =
      sourceFilter === "all" || run.source.toLowerCase() === sourceFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" || run.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesIndustry =
      industryFilter === "all" || run.industry.toLowerCase() === industryFilter.toLowerCase();

    return matchesSearch && matchesSource && matchesStatus && matchesIndustry;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSourceFilter("all");
    setStatusFilter("all");
    setIndustryFilter("all");
  };

  const calculateAssetCounts = (run) => {
    let total = 0;
    let pending = 0;

    if (!run.outputs) return "0 assets";

    const allAssets = [];
    if (run.outputs.blogPost) allAssets.push(run.outputs.blogPost);
    if (run.outputs.linkedinPosts) allAssets.push(...run.outputs.linkedinPosts);
    if (run.outputs.emailSequence) allAssets.push(...run.outputs.emailSequence);
    if (run.outputs.adVariants) allAssets.push(...run.outputs.adVariants);
    if (run.outputs.creativeAssets) allAssets.push(...run.outputs.creativeAssets);

    total = allAssets.length;
    pending = allAssets.filter((a) => a.status === "pending").length;

    if (total === 0) return "0 assets";
    return `${total} assets · ${pending} pending`;
  };

  const handleDuplicate = (run, e) => {
    e.stopPropagation();
    toast({
      title: "Run Duplicated",
      description: `Copied parameters from ${run.id} into draft queue.`,
      variant: "info",
    });
    setActiveMenuId(null);
  };

  const handleArchive = (run, e) => {
    e.stopPropagation();
    toast({
      title: "Run Archived",
      description: `${run.id} moved to archive storage.`,
      variant: "info",
    });
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
            Module 1 — AI Marketing Agent
          </span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Marketing Runs
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Autonomous multi-agent discovery, market research, strategy, and content generation pipelines.
          </p>
        </div>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate("/app/marketing/new")}
        >
          Research
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-3 rounded-card border border-border flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search topic or Run ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-raise border border-border rounded-control text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-8 text-xs py-0 w-32"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual</option>
            <option value="automated">Automated</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 text-xs py-0 w-32"
          >
            <option value="all">All Statuses</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </Select>

          <Select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="h-8 text-xs py-0 w-36"
          >
            <option value="all">All Industries</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Enterprise SaaS">Enterprise SaaS</option>
            <option value="Healthcare IT">Healthcare IT</option>
            <option value="FinTech">FinTech</option>
            <option value="E-Commerce">E-Commerce</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </Select>

          {(searchTerm || sourceFilter !== "all" || statusFilter !== "all" || industryFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Dense Runs Table */}
      {filteredRuns.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-72">Run & Topic</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Objective</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deliverables</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRuns.map((run) => (
              <TableRow
                key={run.id}
                onClick={() => navigate(`/app/marketing/runs/${run.id}`)}
              >
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-accent">
                        {run.id}
                      </span>
                    </div>
                    <p className="font-medium text-ink truncate max-w-xs text-xs">
                      {run.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={run.source === "Automated" ? "accent" : "neutral"}>
                    {run.source}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-ink-muted">{run.industry}</TableCell>
                <TableCell className="text-xs text-ink-muted">{run.objective}</TableCell>
                <TableCell>
                  {run.status === "running" ? (
                    <div className="flex items-center gap-2">
                      <StatusChip status="running" />
                      <span className="text-[11px] font-mono text-sky-700 font-semibold">
                        {run.overallProgress || 50}%
                      </span>
                    </div>
                  ) : (
                    <StatusChip status={run.status} />
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-muted">
                  {calculateAssetCounts(run)}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-subtle">
                  {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === run.id ? null : run.id)}
                      className="p-1 rounded hover:bg-raise text-ink-subtle hover:text-ink transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === run.id && (
                      <div className="origin-top-right absolute right-0 mt-1 w-36 bg-surface rounded-card border border-border shadow-modal z-20 py-1 text-xs">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            navigate(`/app/marketing/runs/${run.id}`);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-raise flex items-center gap-2 text-ink"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" /> View Run
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(run, e)}
                          className="w-full text-left px-3 py-1.5 hover:bg-raise flex items-center gap-2 text-ink"
                        >
                          <Copy className="w-3.5 h-3.5 text-ink-muted" /> Duplicate
                        </button>
                        <button
                          onClick={(e) => handleArchive(run, e)}
                          className="w-full text-left px-3 py-1.5 hover:bg-raise flex items-center gap-2 text-danger"
                        >
                          <Archive className="w-3.5 h-3.5 text-danger" /> Archive
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={Filter}
          title="No runs match these filters"
          description="Try selecting a different industry, status, or search query to view marketing runs."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}
