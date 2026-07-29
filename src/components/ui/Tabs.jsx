import React, { createContext, useContext, useState } from "react";
import { cn } from "../../lib/utils";

const TabsContext = createContext();

export function Tabs({ defaultValue, value, onValueChange, className, children }) {
  const [selectedTab, setSelectedTab] = useState(defaultValue);
  const activeTab = value !== undefined ? value : selectedTab;

  const handleSelect = (val) => {
    if (onValueChange) onValueChange(val);
    else setSelectedTab(val);
  };

  return (
    <TabsContext.Provider value={{ activeTab, handleSelect }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 border-b border-border w-full text-sm font-medium",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className, icon: Icon, badge }) {
  const { activeTab, handleSelect } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => handleSelect(value)}
      className={cn(
        "inline-flex items-center gap-2 py-2 px-3 text-sm font-medium transition-colors border-b-2 -mb-px outline-none",
        isActive
          ? "border-accent text-accent font-semibold"
          : "border-transparent text-ink-muted hover:text-ink hover:border-border-strong",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-mono",
            isActive ? "bg-accent-tint text-accent" : "bg-raise text-ink-muted"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={cn("pt-4 focus-visible:outline-none", className)}>{children}</div>;
}
