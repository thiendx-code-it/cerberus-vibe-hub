# Changelog

## v1.0.0 — 2026-03-18

> *A community hub for sharing creative mini-apps built by the Cerberus Team. Ship something weird.*

### Core Platform

- **Zero-database architecture** — Projects are auto-discovered at build time via Vite glob patterns (`import.meta.glob`). No backend, no Supabase, no API calls required.
- **Plugin system** — Drop a `meta.ts` file into `src/apps/{slug}/` and your project appears on the hub automatically after a PR is merged.
- **Embedded mini-apps** — Add an optional `index.tsx` alongside `meta.ts` to make your app launchable directly inside the hub at `/apps/{slug}`.

### Pages & Navigation

- **Feed (`/`)** — Project grid with real-time search, category filtering, and random shuffle
- **Project Detail (`/project/:id`)** — Full project page with Launch App / View Demo / Source Code actions
- **Leaderboard (`/leaderboard`)** — Rankings by project completeness and contributor activity
- **Bookmarks (`/bookmarks`)** — Locally saved favorites, persisted to `localStorage`
- **Submit (`/submit`)** — Step-by-step PR guide with code snippets for adding a new app

### Internationalization (i18n)

- Full **English + Vietnamese** support via `i18next`
- **English is the default** language
- Language auto-detected from browser / `localStorage`
- EN/VI toggle button in the header — preference persisted across sessions

### UI & Design

- **OLED-dark theme** with **cyan neon** primary (`#00e5ff`) and **purple** accent (`#a855f7`)
- **JetBrains Mono** for headings and code elements, **IBM Plex Sans** for body text
- Terminal-prompt hero: `> what did you build?` with blinking cursor
- Neon pill category tags with active glow effect
- Card hover: subtle cyan glow bloom

### Developer Experience

- `CLAUDE.md` project rules — enforces scope (`src/apps/{slug}/` only) and no-database constraint for AI assistants
- `vibe-submit` Claude skill — auto-activates when building/submitting apps; includes `AppMeta` spec, `index.tsx` template, and submission checklist

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3 + TypeScript 5.8 |
| Build | Vite 8.0 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| i18n | i18next 25.8 + react-i18next |
| Routing | React Router v6 |
| State | React hooks + localStorage |
| Testing | Vitest 4.1 + Testing Library + Playwright |

### Apps Shipped

| App | Category | Embedded |
|-----|----------|----------|
| Hello World | fun | ✓ |
| Cerberus Calculator | tool | — |

### Contributing

Add your app in 2 files:

```
src/apps/your-slug/meta.ts      ← required
src/apps/your-slug/index.tsx    ← optional
```

Open a PR → auto-discovery handles the rest.
