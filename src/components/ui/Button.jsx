import React from "react";
import { cn } from "../../lib/utils";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled = false,
      children,
      icon: Icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-[6px]";

    const variants = {
      primary:
        "bg-accent hover:bg-accent-hover text-white shadow-sm border border-transparent",
      secondary:
        "bg-surface hover:bg-raise text-ink border border-border hover:border-border-strong shadow-sm",
      ghost:
        "bg-transparent hover:bg-raise text-ink-muted hover:text-ink border border-transparent",
      danger:
        "bg-danger hover:opacity-90 text-white shadow-sm border border-transparent",
      outline:
        "bg-transparent border border-border hover:bg-raise text-ink",
    };

    const sizes = {
      sm: "h-8 px-2.5 text-xs gap-1.5",
      md: "h-9 px-3.5 text-sm gap-2",
      lg: "h-10 px-4 text-sm gap-2",
      icon: "h-8 w-8 p-0 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
        {children}
        {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
      </button>
    );
  }
);

Button.displayName = "Button";
