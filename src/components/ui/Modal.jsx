import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export function Modal({ isOpen, onClose, title, description, children, footer, className }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg bg-surface rounded-modal border border-border shadow-modal p-6 flex flex-col max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
            {description && <p className="text-xs text-ink-muted mt-1">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-ink-muted hover:text-ink -mr-2 -mt-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 py-1">{children}</div>

        {footer && <div className="mt-6 pt-4 border-t border-border flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
