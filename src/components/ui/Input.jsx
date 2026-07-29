import React from "react";
import { cn } from "../../lib/utils";

export const Input = React.forwardRef(
  ({ className, type = "text", label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-[6px] border border-border bg-surface px-3 py-1 text-sm text-ink transition-colors",
            "placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus-visible:border-danger focus-visible:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-ink-subtle">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-[6px] border border-border bg-surface px-3 py-2 text-sm text-ink transition-colors",
            "placeholder:text-ink-subtle focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus-visible:border-danger focus-visible:ring-danger",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-ink-subtle">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef(
  ({ className, label, children, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-[6px] border border-border bg-surface px-3 py-1 text-sm text-ink transition-colors",
            "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus-visible:border-danger focus-visible:ring-danger",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-ink-subtle">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export function Toggle({ checked, onChange, label, description, className }) {
  return (
    <label className={cn("inline-flex items-center justify-between gap-3 cursor-pointer", className)}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm font-medium text-ink">{label}</span>}
          {description && (
            <span className="text-xs text-ink-muted">{description}</span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange && onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          checked ? "bg-accent" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}
