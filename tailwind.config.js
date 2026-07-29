/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        raise: "var(--raise)",
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          subtle: "var(--ink-subtle)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          tint: "var(--accent-tint)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        viz: {
          teal: "var(--accent)",
          sand: "#C9A24B",
          slate: "#3E5266",
        }
      },
      fontFamily: {
        sans: ["'Geist Variable'", "sans-serif"],
        mono: ["'Geist Mono Variable'", "monospace"],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(20, 19, 16, 0.05)',
        'md': '0 4px 12px rgba(20, 19, 16, 0.08)',
        'modal': '0 12px 32px rgba(20, 19, 16, 0.12)',
      },
      borderRadius: {
        'card': '8px',
        'control': '6px',
        'modal': '10px',
      }
    },
  },
  plugins: [],
}
