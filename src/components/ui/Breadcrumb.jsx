import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

export function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center space-x-1 text-xs text-ink-muted" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-ink transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-ink-subtle shrink-0" />
            {isLast || !item.to ? (
              <span className="font-medium text-ink truncate max-w-[200px]">{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-ink transition-colors truncate max-w-[160px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
