import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Settings as SettingsIcon,
  Sparkles,
  SearchIcon,
  TrendingUp,
  SearchCode,
} from "lucide-react";
import { BRAND } from "../../config";
import { useAppStore } from "../../store/AppStore";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";

export function Sidebar() {
  const { user } = useAppStore();
  const location = useLocation();

  const navGroups = [
    {
      items: [
        { label: "Overview", to: "/app", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: "AI Marketing Agent",
      items: [
        { label: "Automated Market Monitoring", to: "/app/marketing/automated", icon: SearchCode },
        { label: "Manual Topic Research", to: "/app/marketing/manual", icon: SearchIcon },
        { label: "Content Planning", to: "/app/marketing/content", icon: Sparkles },
      ],
    },
    {
      title: "Website Intelligence",
      items: [
        { label: "Site Analyses", to: "/app/website", icon: TrendingUp },
        { label: "New Analysis", to: "/app/website/new", icon: PlusCircle },
      ],
    },
  ];

  return (
    <aside className="w-60 shrink-0 bg-surface border-r border-border h-screen flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="h-14 px-5 flex items-center border-b border-border">
          <NavLink to="/app" className="flex items-center gap-2 group">
            <div className="font-semibold text-lg tracking-tight text-ink">
              {BRAND}
              <span className="text-accent">.</span>
            </div>
            <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded bg-raise text-ink-muted border border-border">
              Enterprise
            </span>
          </NavLink>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {group.title && (
                <div className="px-3 pb-1 text-[11px] font-mono uppercase tracking-wider text-ink-subtle">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-control transition-colors relative",
                      isActive
                        ? "bg-accent-tint text-accent font-semibold border-l-2 border-accent rounded-l-none pl-2.5"
                        : "text-ink-muted hover:text-ink hover:bg-raise"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer User Chip & Settings */}
      <div className="p-3 border-t border-border space-y-2 bg-surface">
        <NavLink
          to="/app/settings"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-control transition-colors",
            location.pathname === "/app/settings"
              ? "bg-accent-tint text-accent font-semibold"
              : "text-ink-muted hover:text-ink hover:bg-raise"
          )}
        >
          <SettingsIcon className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </NavLink>

        <div className="flex items-center justify-between p-2 rounded-control bg-raise border border-border/60">
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar name={user.name} size="sm" />
            <div className="truncate">
              <p className="text-xs font-semibold text-ink truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-ink-subtle truncate leading-tight font-mono">
                {user.company}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
