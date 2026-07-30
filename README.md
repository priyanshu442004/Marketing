# BrandSutra AI Marketing & Website Intelligence Platform

**BrandSutra** is a high-fidelity B2B SaaS frontend prototype built for client demonstrations. It features a complete interactive workflow for autonomous marketing campaign generation and website intelligence auditing.

The application includes no real backend—all data is dynamically mocked in-memory with local state persistence (`localStorage`), offering real-time progress simulation across 10 specialized marketing agents and 3 website intelligence agents.

---

## Key Modules & Features

### 1. Module 1: AI Marketing Agent (`/marketing`)
- **Marketing Runs List**: Dense filterable table tracking active and historical campaign runs with status progress, source tags, and industry metadata.
- **New Campaign Setup**: 2-step setup supporting both **Automated Monitoring** (RSS signal triggers) and **Manual Topic Research**.
- **Run Management & Agent Pipeline (`/marketing/runs/:id`)**:
  - Real-time 10-step progress visualization (Supervisor DAG, Trend Identification, Research, Competitive Intelligence, Context Merger, Content Strategy, Content Planning, SEO, Content Generation, Creative Generation).
  - Rich outputs for all 10 agents (Keyword trend sparklines, Competitive matrix, Content calendars, SERP meta previews, Copywriting previews).
  - Granular human approval & rejection workflow for blog posts, LinkedIn insights, email sequences, ad variants, and creative diagrams.
  - Consolidated Deliverables Export panel.

### 2. Module 2: Website Intelligence (`/website`)
- **Analyses List**: Overview of analyzed websites displaying compact 0–100 Health Score pills, industry vertical, and crawl status.
- **New Analysis Setup (`/website/new`)**: Two-column configuration form featuring business context inputs alongside an interactive example benchmark helper panel.
- **Analysis Dashboard (`/website/analyses/:id`)**:
  - **Agent 1: Website Structure**: DOM crawl metrics, page inventory table, and expandable navigation hierarchy tree.
  - **Agent 2: Business Gap Analysis**: 5-area messaging audit (Business Alignment, Content Depth, SEO, Conversion Readiness, UX) with severity badges and *"Why It Matters"* explanations.
  - **Agent 3: Recommendations & Roadmap**: Hero 0–100 Health Score, 6 category progress scorecards, prioritized actionable recommendations, phased **NOW / NEXT / LATER** improvement roadmap, and 9 downloadable audit reports.

### 3. Global Command & Settings
- **Operator Dashboard (`/`)**: Restrained metric strip, active approval queue ("Needs Your Attention"), real-time system activity log, and direct module entry cards.
- **Auth Module (`/login`, `/signup`)**: Editorial split layout with solid dark brand panel and static product preview cards.
- **Settings (`/settings`)**: Profile management, RSS feed source manager, external connectors toggle (LinkedIn, GSC, HubSpot, WordPress), billing invoices, and a **Reset Demo Data** control.

---

## Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS with custom design token palette (Monochrome canvas, restrained ink, single warm accent, Geist sans/mono typography)
- **Icons**: Lucide React
- **Date Utilities**: `date-fns`
- **State & Persistence**: React Context (`AppStore`) + `localStorage`

---

## Quickstart

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## Project Structure

```
c:\Users\hp\Desktop\miscellaneous\Marketing\
├── src/
│   ├── components/
│   │   ├── layout/       # AppShell, Sidebar, Topbar
│   │   ├── marketing/    # Rich output cards for all 10 marketing agents
│   │   └── ui/           # Custom design primitives (Button, Card, Badge, Table, Tabs, Input, Modal, Toast, etc.)
│   ├── mock/             # Modular seed datasets (runs.js, analyses.js, agents.js, activity.js, competitors.js)
│   ├── pages/            # Application pages (Dashboard, Marketing Runs, Website Analyses, Auth, Settings)
│   ├── store/            # AppStore Context provider with multi-agent simulation & state persistence
│   ├── App.jsx           # Application route declarations
│   ├── index.css         # CSS variables & typography tokens
│   └── main.jsx          # Mount point
├── tailwind.config.js    # Design token system (Palette, Radii, Shadows, Fonts)
└── README.md
```

---

## Design System & Anti-AI Standards

This prototype strictly follows an editorial B2B aesthetic:
- **No generic AI tropes**: No floating gradients, no purple/violet glowing cards, no emojis in UI copy.
- **Data Density**: High tabular readability, hairline borders (`border-border`), and Geist Mono for key numbers, timestamps, and IDs.
- **Realistic Mock Data**: All keywords, research briefs, competitive matrices, and copy outputs use genuine enterprise domain context.
