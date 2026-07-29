import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-card border border-dashed border-border bg-surface/50",
        className
      )}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-full bg-raise flex items-center justify-center mb-3 text-ink-muted border border-border">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ink tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs text-ink-muted max-w-sm mt-1 mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
