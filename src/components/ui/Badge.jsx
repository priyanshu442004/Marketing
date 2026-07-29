import React from "react";
import { cn } from "../../lib/utils";

export function Badge({
  variant = "neutral",
  size = "md",
  className,
  children,
  ...props
}) {
  const variants = {
    neutral: "bg-raise text-ink-muted border-border",
    accent: "bg-accent-tint text-accent border-accent/20",
    success: "bg-emerald-50 text-success border-emerald-200",
    warning: "bg-amber-50 text-warning border-amber-200",
    danger: "bg-rose-50 text-danger border-rose-200",
    running: "bg-sky-50 text-sky-800 border-sky-200",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[11px] font-mono tracking-tight",
    md: "px-2 py-0.5 text-xs font-mono tracking-tight",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium rounded-full border shrink-0",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StatusChip({ status, className }) {
  let variant = "neutral";
  let label = status;
  let dotColor = "bg-ink-subtle";

  switch (status?.toLowerCase()) {
    case "completed":
    case "done":
    case "approved":
    case "active":
    case "healthy":
      variant = "success";
      label = status;
      dotColor = "bg-success";
      break;
    case "running":
    case "in_progress":
    case "analyzing":
    case "queued":
      variant = "running";
      label = status === "in_progress" ? "In Progress" : status;
      dotColor = "bg-sky-600 animate-pulse";
      break;
    case "pending":
    case "needs_review":
    case "warning":
      variant = "warning";
      label = status === "needs_review" ? "Needs Review" : status;
      dotColor = "bg-warning";
      break;
    case "failed":
    case "rejected":
    case "error":
    case "critical":
      variant = "danger";
      label = status;
      dotColor = "bg-danger";
      break;
    default:
      variant = "neutral";
      dotColor = "bg-ink-subtle";
  }

  return (
    <Badge variant={variant} className={className}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      <span className="capitalize">{label}</span>
    </Badge>
  );
}
