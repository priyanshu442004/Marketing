import React from "react";
import { cn } from "../../lib/utils";

export function ProgressBar({ value = 0, max = 100, className, showValue = false, size = "md" }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizes = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full space-y-1">
      {showValue && (
        <div className="flex justify-between items-center text-xs font-mono text-ink-muted">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={cn("w-full bg-raise rounded-full overflow-hidden border border-border/50", sizes[size], className)}>
        <div
          className="bg-accent h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
