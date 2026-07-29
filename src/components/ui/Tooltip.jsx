import React, { useState } from "react";
import { cn } from "../../lib/utils";

export function Tooltip({ text, children, position = "top" }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: "-top-8 left-1/2 -translate-x-1/2",
    bottom: "-bottom-8 left-1/2 -translate-x-1/2",
    left: "-left-2 top-1/2 -translate-y-1/2 -translate-x-full",
    right: "-right-2 top-1/2 -translate-y-1/2 translate-x-full",
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-[11px] font-medium text-white bg-ink rounded shadow-sm whitespace-nowrap pointer-events-none transition-opacity duration-150",
            positions[position]
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
}
