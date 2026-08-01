import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Bell, Check, ExternalLink, Moon, Sun, Trash2, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { Breadcrumb } from "../ui/Breadcrumb";
import { Avatar } from "../ui/Avatar";
import { useAppStore } from "../../store/AppStore";
import { cn } from "../../lib/utils";

export function Header({ onOpenSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, markNotificationRead, deleteNotification, clearAllNotifications, user, logout } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem("brandsutra-theme");
      if (storedTheme) return storedTheme;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("brandsutra-theme", theme);
  }, [theme]);

  // Build breadcrumb based on route under /app
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === "/app") return [{ label: "Dashboard" }];
    if (path === "/app/marketing") return [{ label: "Marketing Dashboard" }];
    if (path === "/app/marketing/automated" || path === "/app/marketing/new")
      return [{ label: "Automated Market Monitoring" }];
    if (path === "/app/marketing/manual")
      return [{ label: "Manual Topic Research" }];
    if (path === "/app/marketing/content")
      return [{ label: "Content Planning" }];
    if (path.startsWith("/app/marketing/runs/"))
      return [{ label: "Marketing Runs", to: "/app/marketing" }, { label: "Run Detail" }];
    if (path === "/app/website") return [{ label: "Site Analyses" }];
    if (path === "/app/website/new")
      return [{ label: "Site Analyses", to: "/app/website" }, { label: "New Analysis" }];
    if (path.startsWith("/app/website/analyses/"))
      return [{ label: "Site Analyses", to: "/app/website" }, { label: "Analysis Detail" }];
    if (path === "/app/settings") return [{ label: "Settings" }];
    return [];
  };

  return (
    <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Breadcrumb */}
      <Breadcrumb items={getBreadcrumbs()} />

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Global Search Button / Trigger */}
        <button
          onClick={onOpenSearch}
          className="relative hidden sm:flex items-center gap-3 w-64 h-8 px-3 text-xs bg-raise border border-border rounded-control text-ink-subtle hover:text-ink hover:border-accent/50 transition-colors focus-visible:outline-none"
        >
          <Search className="w-3.5 h-3.5 text-ink-subtle shrink-0" />
          <span className="truncate">Search tools, runs, audits...</span>
          <kbd className="ml-auto text-[10px] font-mono text-ink-subtle bg-surface border border-border px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-control text-ink-muted hover:text-ink hover:bg-raise transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

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
            <div className="absolute right-0 mt-2 w-88 bg-surface rounded-card border border-border shadow-modal z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-border flex items-center justify-between bg-raise">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-accent/10 text-accent font-mono font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={() => clearAllNotifications()}
                    className="text-[10px] text-ink-subtle hover:text-danger font-mono transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="divide-y divide-border max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-ink-muted font-mono">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "p-3 text-xs flex items-start justify-between gap-2 transition-colors",
                        !n.read ? "bg-accent-tint/30" : "hover:bg-raise/80"
                      )}
                    >
                      <div
                        className="flex-1 cursor-pointer space-y-0.5"
                        onClick={() => {
                          markNotificationRead(n.id, true);
                          if (n.link) navigate(n.link);
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              n.type === "success"
                                ? "bg-emerald-500"
                                : n.type === "error"
                                ? "bg-rose-500"
                                : "bg-accent"
                            )}
                          />
                          <p className="font-semibold text-ink leading-tight">{n.title}</p>
                        </div>
                        <p className="text-ink-muted text-[11px] leading-relaxed pl-3">{n.message}</p>
                        <p className="text-[10px] text-ink-subtle font-mono pt-0.5 pl-3">{n.time}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          onClick={() => markNotificationRead(n.id, !n.read)}
                          title={n.read ? "Mark as unread" : "Mark as read"}
                          className="p-1 text-ink-subtle hover:text-accent rounded"
                        >
                          <Check className={cn("w-3.5 h-3.5", n.read ? "opacity-30" : "opacity-100 text-accent")} />
                        </button>
                        <button
                          onClick={() => deleteNotification(n.id)}
                          title="Delete notification"
                          className="p-1 text-ink-subtle hover:text-danger rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border mx-1" />

        {/* User Dropdown Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-visible:outline-none"
          >
            <Avatar name={user.name || "Operator"} size="sm" />
            <span className="text-xs font-medium text-ink hidden md:inline-block">
              {user.name || "Operator"}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface rounded-card border border-border shadow-modal z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 divide-y divide-border">
              <div className="p-3 bg-raise">
                <p className="text-xs font-bold text-ink">{user.name || "Operator"}</p>
                <p className="text-[11px] font-mono text-ink-subtle truncate">{user.email}</p>
                <p className="text-[10px] text-accent font-semibold pt-1">{user.company || "Enterprise Suite"}</p>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    navigate("/app/settings");
                  }}
                  className="w-full text-left px-3 py-2 text-ink hover:bg-raise flex items-center gap-2"
                >
                  <SettingsIcon className="w-3.5 h-3.5 text-ink-muted" />
                  Account Settings
                </button>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-danger hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 text-danger" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
