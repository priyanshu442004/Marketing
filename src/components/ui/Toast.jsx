import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = "info", duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastItem({ toast, onClose }) {
  const icons = {
    info: <Info className="w-4 h-4 text-accent shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-success shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning shrink-0" />,
    danger: <XCircle className="w-4 h-4 text-danger shrink-0" />,
  };

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-3.5 rounded-card bg-surface border border-border shadow-md transition-all duration-200"
      )}
    >
      {icons[toast.variant] || icons.info}
      <div className="flex-1 space-y-0.5">
        {toast.title && <p className="text-sm font-semibold text-ink">{toast.title}</p>}
        {toast.description && <p className="text-xs text-ink-muted leading-snug">{toast.description}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-ink-subtle hover:text-ink transition-colors p-0.5 rounded"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
