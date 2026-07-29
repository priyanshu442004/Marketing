import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, Check, Sparkles, ExternalLink } from "lucide-react";
import { Breadcrumb } from "../ui/Breadcrumb";
import { Avatar } from "../ui/Avatar";
import { useAppStore } from "../../store/AppStore";
import { cn } from "../../lib/utils";

export function Header() {
  const location = useLocation();
  const { notifications, markNotificationRead, user } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build breadcrumb based on route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/") return [{ label: "Dashboard" }];
    if (path === "/marketing") return [{ label: "Campaign Runs" }];
    if (path === "/marketing/new")
      return [{ label: "Campaign Runs", to: "/marketing" }, { label: "New Campaign Run" }];
    if (path.startsWith("/marketing/runs/"))
      return [{ label: "Campaign Runs", to: "/marketing" }, { label: "Run Detail" }];
    if (path === "/website") return [{ label: "Site Analyses" }];
    if (path === "/website/new")
      return [{ label: "Site Analyses", to: "/website" }, { label: "New Analysis" }];
    if (path.startsWith("/website/analyses/"))
      return [{ label: "Site Analyses", to: "/website" }, { label: "Analysis Detail" }];
    if (path === "/settings") return [{ label: "Settings" }];
    return [];
  };

  return (
    <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Breadcrumb */}
      <Breadcrumb items={getBreadcrumbs()} />

      {/* Right Actions (Global Search, Notifications Bell, Avatar Menu) */}
      <div className="flex items-center gap-3">
        {/* Mock Global Search (⌘K) */}
        <div className="relative hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            type="text"
            placeholder="Search campaigns, audits, assets..."
            className="w-64 h-8 pl-8 pr-12 text-xs bg-raise border border-border rounded-control text-ink placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-accent focus-visible:bg-surface transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-subtle bg-surface border border-border px-1 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-control text-ink-muted hover:text-ink hover:bg-raise transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-surface" />
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface rounded-card border border-border shadow-modal z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-border flex items-center justify-between bg-raise">
                <span className="text-xs font-semibold text-ink">Notifications</span>
                <span className="text-[11px] font-mono text-ink-subtle">
                  {unreadCount} unread
                </span>
              </div>
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={cn(
                      "p-3 text-xs cursor-pointer hover:bg-raise/80 transition-colors flex items-start gap-2.5",
                      !n.read ? "bg-accent-tint/30" : ""
                    )}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0 opacity-80" />
                    <div className="flex-1 space-y-0.5">
                      <p className="font-semibold text-ink leading-tight">{n.title}</p>
                      <p className="text-ink-muted text-[11px] leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-ink-subtle font-mono pt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        {/* User Chip */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar name={user.name} size="sm" />
          <span className="text-xs font-medium text-ink hidden md:inline-block">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  );
}
