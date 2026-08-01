import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/AppStore";
import {
  Search,
  LayoutDashboard,
  Megaphone,
  Globe,
  Calendar,
  Settings as SettingsIcon,
  PlusCircle,
  Sparkles,
  ArrowRight,
  X,
  FileText,
  Layers,
  LogOut
} from "lucide-react";

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { runs, analyses, logout } = useAppStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state trigger
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultActions = [
    {
      id: "dash",
      title: "Go to Dashboard",
      subtitle: "Overview metrics & recent telemetry",
      icon: LayoutDashboard,
      action: () => navigate("/app"),
    },
    {
      id: "mkt-list",
      title: "View Marketing Runs",
      subtitle: "All 10-agent autonomous campaigns",
      icon: Megaphone,
      action: () => navigate("/app/marketing"),
    },
    {
      id: "mkt-new-auto",
      title: "New Automated Marketing Run",
      subtitle: "Launch RSS signal monitoring",
      icon: PlusCircle,
      action: () => navigate("/app/marketing/automated"),
    },
    {
      id: "mkt-new-manual",
      title: "New Manual Marketing Run",
      subtitle: "Run research on custom target topic",
      icon: PlusCircle,
      action: () => navigate("/app/marketing/manual"),
    },
    {
      id: "mkt-content",
      title: "Content Planning & Scheduling",
      subtitle: "Review approved posts & editorial calendar",
      icon: Calendar,
      action: () => navigate("/app/marketing/content"),
    },
    {
      id: "web-list",
      title: "View Website Intelligence Audits",
      subtitle: "Domain structure & gap analysis",
      icon: Globe,
      action: () => navigate("/app/website"),
    },
    {
      id: "web-new",
      title: "New Website Audit",
      subtitle: "Run 5-area domain audit",
      icon: PlusCircle,
      action: () => navigate("/app/website/new"),
    },
    {
      id: "settings",
      title: "Account & System Settings",
      subtitle: "API keys, webhooks & user profile",
      icon: SettingsIcon,
      action: () => navigate("/app/settings"),
    },
    {
      id: "logout",
      title: "Sign Out",
      subtitle: "Terminate active workspace session",
      icon: LogOut,
      action: () => logout(),
    },
  ];

  // Filter marketing runs by query
  const matchingRuns = runs
    .filter((r) => r.topic.toLowerCase().includes(query.toLowerCase()) || r.industry.toLowerCase().includes(query.toLowerCase()))
    .map((r) => ({
      id: `run-${r.id}`,
      title: `Marketing Run: ${r.topic}`,
      subtitle: `${r.industry} • ${r.status.toUpperCase()}`,
      icon: Sparkles,
      action: () => navigate(`/app/marketing/runs/${r.id}`),
    }));

  // Filter website analyses by query
  const matchingAnalyses = analyses
    .filter((a) => a.companyName?.toLowerCase().includes(query.toLowerCase()) || a.url?.toLowerCase().includes(query.toLowerCase()))
    .map((a) => ({
      id: `ana-${a.id}`,
      title: `Website Audit: ${a.companyName || a.url}`,
      subtitle: `Score: ${a.healthScore}/100 • ${a.url}`,
      icon: Globe,
      action: () => navigate(`/app/website/analyses/${a.id}`),
    }));

  const allFiltered = [
    ...defaultActions.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.subtitle.toLowerCase().includes(query.toLowerCase())
    ),
    ...matchingRuns,
    ...matchingAnalyses,
  ];

  const handleSelect = (item) => {
    item.action();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-surface rounded-card border border-border shadow-2xl overflow-hidden text-left font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3 border-b border-border gap-3 bg-raise">
          <Search className="w-4 h-4 text-ink-subtle shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, run title, or domain... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && allFiltered.length > 0) {
                handleSelect(allFiltered[selectedIndex] || allFiltered[0]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % allFiltered.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + allFiltered.length) % allFiltered.length);
              }
            }}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-ink-subtle hover:text-ink rounded hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-border/40">
          {allFiltered.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted">
              No matching commands or resources found for "<span className="font-semibold">{query}</span>".
            </div>
          ) : (
            allFiltered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-control cursor-pointer transition-colors ${
                    isSelected ? "bg-accent/10 border-l-2 border-accent text-ink" : "hover:bg-raise text-ink-muted"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded shrink-0 ${
                        isSelected ? "bg-accent text-white" : "bg-raise border border-border text-ink-subtle"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? "text-accent" : "text-ink"}`}>
                        {item.title}
                      </p>
                      <p className="text-[11px] text-ink-subtle truncate">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-accent opacity-100" : "opacity-0"}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-raise border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-subtle">
          <div className="flex items-center gap-2">
            <span><kbd className="px-1.5 py-0.5 bg-surface border border-border rounded">↑</kbd> <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded">↓</kbd> to navigate</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 bg-surface border border-border rounded">↵</kbd> to select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-surface border border-border rounded">Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}
