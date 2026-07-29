import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/AppStore";
import { Button } from "../components/ui/Button";
import { Input, Select } from "../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../components/ui/Table";
import { StatusChip, Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { useToast } from "../components/ui/Toast";
import { PlusCircle, Search, Filter, MoreHorizontal, Eye, RefreshCw, Archive, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function WebsiteAnalysesList() {
  const navigate = useNavigate();
  const { analyses, reRunAnalysis } = useAppStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [activeMenuId, setActiveMenuId] = useState(null);

  const filteredAnalyses = analyses.filter((item) => {
    const matchesSearch =
      item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      industryFilter === "all" || item.industry.toLowerCase() === industryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("all");
    setStatusFilter("all");
  };

  const getScorePill = (score) => {
    if (score === null || score === undefined) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs text-ink-subtle bg-raise border border-border">
          --
        </span>
      );
    }

    if (score >= 80) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {score}/100
        </span>
      );
    }

    if (score >= 50) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
          {score}/100
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
        {score}/100
      </span>
    );
  };

  const handleReRun = (analysis, e) => {
    e.stopPropagation();
    reRunAnalysis(analysis.id);
    toast({
      title: "Analysis Re-Run Initiated",
      description: `Re-crawling ${analysis.domain}...`,
      variant: "info",
    });
    setActiveMenuId(null);
  };

  const handleArchive = (analysis, e) => {
    e.stopPropagation();
    toast({
      title: "Analysis Archived",
      description: `${analysis.domain} report moved to archive storage.`,
      variant: "info",
    });
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-ink-subtle">
            Module 2 — Website Intelligence
          </span>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            Website Analyses
          </h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Automated website structure crawl, business gap assessment, and prioritized optimization roadmap.
          </p>
        </div>
        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate("/website/new")}
        >
          New Analysis
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-3 rounded-card border border-border flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search domain or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs bg-raise border border-border rounded-control text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-accent"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="h-8 text-xs py-0 w-36"
          >
            <option value="all">All Industries</option>
            <option value="Enterprise SaaS">Enterprise SaaS</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Healthcare IT">Healthcare IT</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="FinTech">FinTech</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 text-xs py-0 w-32"
          >
            <option value="all">All Statuses</option>
            <option value="analyzing">Analyzing</option>
            <option value="completed">Completed</option>
          </Select>

          {(searchTerm || industryFilter !== "all" || statusFilter !== "all") && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Dense Table */}
      {filteredAnalyses.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-64">Site & Domain</TableHead>
              <TableHead>Business Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Health Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Analyzed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnalyses.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => navigate(`/website/analyses/${item.id}`)}
              >
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    {/* Favicon-style Monogram */}
                    <div className="w-7 h-7 rounded bg-ink text-surface font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-ink">
                      {item.domain.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5 truncate">
                      <span className="font-mono text-xs font-semibold text-ink hover:text-accent">
                        {item.domain}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-ink">{item.companyName}</TableCell>
                <TableCell className="text-xs text-ink-muted">{item.industry}</TableCell>
                <TableCell>{getScorePill(item.healthScore)}</TableCell>
                <TableCell>
                  {item.status === "analyzing" ? (
                    <div className="flex items-center gap-2">
                      <StatusChip status="running" />
                      <span className="text-[11px] font-mono text-sky-700 font-semibold">45%</span>
                    </div>
                  ) : (
                    <StatusChip status={item.status} />
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink-subtle">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="relative inline-block text-left">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                      className="p-1 rounded hover:bg-raise text-ink-subtle hover:text-ink transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === item.id && (
                      <div className="origin-top-right absolute right-0 mt-1 w-36 bg-surface rounded-card border border-border shadow-modal z-20 py-1 text-xs">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            navigate(`/website/analyses/${item.id}`);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-raise flex items-center gap-2 text-ink"
                        >
                          <Eye className="w-3.5 h-3.5 text-accent" /> View Analysis
                        </button>
                        <button
                          onClick={(e) => handleReRun(item, e)}
                          className="w-full text-left px-3 py-1.5 hover:bg-raise flex items-center gap-2 text-ink"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-ink-muted" /> Re-run
                        </button>
                        <button
                          onClick={(e) => handleArchive(item, e)}
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
          title="No website analyses match these filters"
          description="Try clearing your search query or selecting a different status filter."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
}
