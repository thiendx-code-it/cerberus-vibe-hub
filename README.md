# vibe.cerberus — Cerberus Vibe Hub

A micro-frontend hub for sharing creative "vibe-coded" mini-applications built by the Cerberus Team. Zero-friction submission via GitHub pull requests — no database needed.

## Quick Start

### Prerequisites
- Node.js ≥ 18
- npm or bun

### Installation & Development

```bash
git clone <repo-url>
cd cerberus-vibe-hub
npm install
npm run dev
```

Open http://localhost:8080

### Build & Deploy

```bash
npm run build        # Production build
npm run preview      # Test production build locally
npm run test         # Run tests
npm run lint         # Check code quality
```

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Micro-Frontend Hub** | Auto-discover and load mini-apps from `src/apps/` directories |
| **Project Showcase** | Browse projects with search, filtering by category, and bookmarks |
| **Zero-Friction Submission** | Add projects via GitHub PR — just create `src/apps/{slug}/meta.ts` |
| **Bilingual Support** | English + Vietnamese (language detection via browser/localStorage) |
| **Local Bookmarks** | Save favorite projects to browser localStorage |
| **Responsive Design** | Mobile-friendly UI with Tailwind CSS + shadcn/ui components |

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18.3 + TypeScript 5.8 |
| **Build** | Vite 8.0 (dev port: 8080) |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui (53 Radix UI components) |
| **Fonts** | JetBrains Mono (headings/code) + IBM Plex Sans (body) |
| **Routing** | React Router v6.30 |
| **i18n** | i18next 25.8 (EN + VI) |
| **Forms** | React Hook Form 7.61 + Zod 3.25 (validation) |
| **Testing** | Vitest 4.1 + Testing Library 16 + Playwright 1.57 (E2E) |
| **Design** | Dark theme with crimson primary + neon accents (cyan/purple) |

---

## How to Submit an App

1. **Fork & clone** the repository
2. **Create app directory:** `src/apps/{your-slug}/`
3. **Add metadata file:** `src/apps/{your-slug}/meta.ts`

```typescript
import type { AppMeta } from "@/lib/types";

export const meta: AppMeta = {
  name: "Your App Name",
  description: "Brief description of your app",
  author_name: "Your Name",
  author_url: "https://github.com/your-username",
  category_slug: "game" | "tool" | "fun" | "app" | "other",
  demo_url: null,           // Optional: live demo URL
  source_url: null,         // Optional: source code URL
  thumbnail_url: null,      // Optional: preview image
  created_at: "2026-03-17T00:00:00Z",
};
```

4. **(Optional) Add embedded app:** Create `src/apps/{your-slug}/index.tsx` as a React component
5. **Open PR** — The hub auto-discovers your app at build time

---

## Project Structure Overview

```
src/
├── apps/
│   ├── hello-world/           # Example: simple app
│   └── cerberus-calculator/   # Example: calculator app
├── components/
│   ├── Header.tsx             # Navigation + language switcher
│   ├── ProjectCard.tsx        # Project card component
│   └── ui/                    # 53 shadcn/ui primitives
├── data/
│   ├── categories.ts          # Category definitions
│   └── projects.ts            # Auto-discovered project data
├── hooks/
│   ├── useBookmarks.ts        # Bookmark state management
│   └── useProjects.ts         # Project data hook
├── i18n/
│   ├── config.ts              # i18next configuration
│   └── locales/               # Translation files (en.json, vi.json)
├── lib/
│   ├── types.ts               # AppMeta, Project, Category interfaces
│   └── utils.ts               # Utility functions
├── pages/
│   ├── Index.tsx              # Home: search + category filter
│   ├── ProjectDetail.tsx      # Project view
│   ├── Bookmarks.tsx          # Saved projects
│   ├── SubmitProject.tsx      # Submission guide
│   └── NotFound.tsx           # 404 page
└── main.tsx                   # App entry point
```

---

## Routes

- `/` — Project feed with search and category filter
- `/project/:id` — Project detail page
- `/apps/:slug` — Mini-app renderer (lazy-loaded embedded app)
- `/bookmarks` — Saved projects
- `/leaderboard` — Project leaderboard (top submissions)
- `/submit` — How to submit guide
- `/*` — 404 Not Found

---

## Key Concepts

### Micro-Frontend Architecture

Apps are auto-discovered at **build time** using Vite's `import.meta.glob()`:

- **Static metadata:** `meta.ts` files define each app (required)
- **Lazy-loaded components:** `index.tsx` files render embedded apps (optional)
- **Zero runtime overhead:** Unused apps don't bloat the bundle

### State Management

- **Bookmarks:** React Hook → localStorage key `vibe-cerberus-bookmarks`
- **i18n language:** localStorage key `i18nextLng` (fallback: browser language)
- **UI state:** useState hooks (search, category filter, loading)
- **Projects:** Static data from build-time glob patterns

### Categories

5 categories supported: `game`, `tool`, `fun`, `app`, `other`

---

## Development Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Dev-mode build (no minification)
npm run test         # Run tests once
npm run test:watch   # Watch mode
npm run lint         # ESLint check
npm run preview      # Preview production build
npm run create:page  # Scaffold new page component
```

---

## Design System

- **Color:** Dark theme with crimson primary (`hsl(347 77% 50%)`)
- **UI Kit:** 53 shadcn/ui components (Radix UI primitives)
- **Effects:** Glassmorphism cards with backdrop blur
- **Typography:** Space Grotesk (headings) + Inter (body)
- **Responsiveness:** Mobile-first design via Tailwind CSS

---

## Documentation

For detailed information, see:
- [Project Overview & PDR](./docs/project-overview-pdr.md) — Goals, features, requirements
- [Codebase Summary](./docs/codebase-summary.md) — Directory map and key patterns
- [Code Standards](./docs/code-standards.md) — Conventions and best practices
- [System Architecture](./docs/system-architecture.md) — Design, routing, state layers
- [Development Roadmap](./docs/development-roadmap.md) — Current status and future plans

---

## Author

**ThienDX** — Cerberus Team · [GitHub](https://github.com/thiendx-code-it)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to submit a mini-app or contribute to the platform.

## License

[MIT](./LICENSE) © 2026 ThienDX & Cerberus Team

