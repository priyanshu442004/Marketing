import React from "react";
import { cn } from "../../lib/utils";

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto border border-border rounded-card bg-surface">
      <table className={cn("w-full text-left border-collapse text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn("bg-raise border-b border-border text-xs font-mono uppercase tracking-wider text-ink-muted", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return <tbody className={cn("divide-y divide-border text-ink", className)} {...props}>{children}</tbody>;
}

export function TableRow({ className, children, ...props }) {
  return (
    <tr
      className={cn(
        "hover:bg-raise/60 transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }) {
  return (
    <th className={cn("px-4 py-3 font-semibold", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }) {
  return (
    <td className={cn("px-4 py-3.5 align-middle", className)} {...props}>
      {children}
    </td>
  );
}
