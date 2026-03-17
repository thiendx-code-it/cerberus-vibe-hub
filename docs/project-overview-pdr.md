# Cerberus Vibe Hub — Project Overview & PDR

**Version:** 1.0.0
**Status:** Active Development
**Last Updated:** 2026-03-17

## Executive Summary

Cerberus Vibe Hub is a community-driven micro-frontend platform for sharing creative "vibe-coded" mini-applications. The platform eliminates friction by allowing developers to submit apps via GitHub pull requests — no backend, no database, no approval process. Projects are auto-discovered at build time, reducing deployment overhead.

---

## Project Goals

1. **Enable Creative Sharing** — Provide a zero-friction venue for Cerberus Team members to showcase mini-apps
2. **Build Community Engagement** — Create a discoverable feed and bookmarking system to encourage exploration
3. **Maintain Simplicity** — Rely on static data (Vite glob patterns), no backend complexity
4. **Support Internationalization** — Serve English and Vietnamese speakers with language detection
5. **Ensure Quality UX** — Responsive, fast, accessible interface on all devices

---

## Target Users

- **Developers (Primary):** Cerberus Team members submitting and discovering projects
- **Casual Explorers (Secondary):** Non-developers exploring community creations
- **Multilingual Audience:** English and Vietnamese speakers

---

## Core Features

### Feature: Project Showcase & Discovery
- Browse all projects in chronological order (newest first)
- Full-text search by project name, description, author
- Filter by category (game, tool, fun, app, other)
- View project details: description, author, links, category
- Launch embedded mini-apps directly from the hub

### Feature: Bookmarks
- Save projects to personal collection (localStorage)
- Persistent across sessions
- Quick access via `/bookmarks` page

### Feature: Mini-App Submission
- Create new app via PR: add `src/apps/{slug}/meta.ts`
- Optional embedded component: `src/apps/{slug}/index.tsx`
- Auto-discovered at build time (no manual registration)
- Instant deployment on merge

### Feature: Internationalization
- English and Vietnamese translations
- Browser language auto-detection
- Manual language switcher in header
- localStorage persistence

### Feature: Responsive Design
- Mobile, tablet, desktop layouts
- Touch-friendly interactions
- Dark theme with good contrast
- Fast load times

---

## Non-Functional Requirements

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Build Time** | < 30 seconds | Developer friction reduction |
| **Load Time (FCP)** | < 2 seconds | User retention |
| **Accessibility (WCAG)** | Level AA | Inclusive design |
| **Bundle Size** | < 500 KB (gzipped) | Mobile-friendly |
| **Browser Support** | Last 2 versions Chrome/FF/Safari | Modern baseline |
| **TypeScript Strictness** | Lenient (no strictNullChecks) | Rapid prototyping |
| **Test Coverage** | 60%+ for critical paths | Stability over 100% |

---

## Technical Architecture

### Micro-Frontend Design
- Apps stored in `src/apps/{slug}/` directories
- **Required:** `meta.ts` file with AppMeta interface
- **Optional:** `index.tsx` React component for embedded execution
- Build-time discovery via Vite `import.meta.glob()`

### Data Model
- **AppMeta:** App metadata (name, description, author, links, category, timestamp)
- **Project:** Extended AppMeta with derived fields (id, approval flag, local app indicator)
- **Category:** Category slugs with sort order (game, tool, fun, app, other)

### State Management Layers
1. **React Hooks** — Search, category filter, loading states
2. **localStorage** — Bookmarks, language preference
3. **Static Data** — Projects loaded from Vite glob at build time

### Routing
- SPA via React Router v6
- Client-side navigation
- Support for nested routes (app renderer)

### Internationalization
- i18next framework with language detector
- localStorage caching of language preference
- Browser language fallback
- Two supported languages: English (default), Vietnamese

---

## Success Metrics

| Metric | Target | Purpose |
|--------|--------|---------|
| **Apps Submitted** | 20+ in Y1 | Community engagement signal |
| **Monthly Users** | 500+ | Platform adoption |
| **Bookmark Rate** | 30%+ of browsing sessions | Engagement depth |
| **Build Success Rate** | 99%+ | Platform reliability |
| **Accessibility Score** | 90+ (Lighthouse) | Inclusive UX |
| **Code Coverage** | 60%+ | Regression prevention |

---

## Constraints & Assumptions

| Constraint | Implication |
|-----------|-------------|
| No backend database | Static data only; submissions require PR merge |
| GitHub-only submission | No anonymous contributions; requires GitHub account |
| Client-side state only | No server-side user profiles or admin panel |
| Build-time discovery | New apps require rebuild and deploy to appear |
| Free tier hosting (Vercel) | Limited build minutes; optimize for speed |

---

## Known Limitations

1. **No Real-Time Updates** — Projects cached at build time; deploy needed for new entries
2. **No User Profiles** — No persistent user accounts or contribution history
3. **No Moderation UI** — All submissions visible; community-driven quality control
4. **No Advanced Search** — Text search only; no filtering by date range, author, tags
5. **No Analytics** — No usage tracking or popularity metrics

---

## Future Roadmap (Ordered by Priority)

### Phase 1: Foundation (Current)
- [x] Core app submission flow (GitHub PR)
- [x] Project feed & search
- [x] Bookmarks with persistence
- [x] Bilingual support
- [x] Responsive design

### Phase 2: Community (Q2 2026)
- [ ] Tags/keywords system (fine-grained filtering)
- [ ] Ratings & comments (community feedback)
- [ ] Featured projects highlight
- [ ] Search suggestions & autocomplete

### Phase 3: Creator Tools (Q3 2026)
- [ ] App templates (boilerplate generation)
- [ ] Creator dashboard (submitted projects, statistics)
- [ ] Contribution guidelines (automated linting)

### Phase 4: Analytics & Growth (Q4 2026)
- [ ] Usage metrics & trending projects
- [ ] Social sharing (Twitter, Discord)
- [ ] GitHub stats integration

---

## Dependencies

### External Services
- None (fully static)

### NPM Packages
- React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- i18next, React Router, React Hook Form, Zod
- Vitest, Testing Library, Playwright

### Hosting
- Vercel (or GitHub Pages)
- Custom domain: vibe.cerberus

---

## Quality Gates

- All PRs must pass ESLint and TypeScript checks
- Tests must pass for core utilities and hooks
- No unhandled errors in production build
- Accessibility: Lighthouse score ≥ 90
- Bundle size monitored and checked vs baseline

---

## Acceptance Criteria

- ✓ Apps discoverable from multiple categories
- ✓ Search filters projects accurately
- ✓ Bookmarks persist across sessions
- ✓ Language switcher works seamlessly
- ✓ Responsive layout on mobile/tablet/desktop
- ✓ New apps submittable via GitHub PR
- ✓ Build time under 30 seconds
- ✓ Load time (FCP) under 2 seconds
