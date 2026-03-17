---
name: vibe-submit
description: Submit a new app to vibe.cerberus by creating src/apps/{slug}/meta.ts + optional index.tsx. DB-less hub, Vite glob auto-discovery. ONLY modify files inside src/apps/{slug}/. No database. PR to submit.
---

# vibe-submit — Submit an App to vibe.cerberus

## Hard Rules (NEVER break)

1. **ONLY create/edit files inside `src/apps/{slug}/`** — never touch any other project file
2. **NO database** — hub is db-less; projects auto-discovered via Vite glob at build time
3. **slug** = kebab-case, unique (e.g. `pixel-clock`, `my-tool`)
4. Submit via **GitHub Pull Request** — never push directly to main

## Required Structure

```
src/apps/{slug}/
├── meta.ts        ← REQUIRED
└── index.tsx      ← OPTIONAL (embedded mini-app)
```

## meta.ts

See `references/appmeta-spec.md` for full spec and AppMeta interface.

```ts
import type { AppMeta } from "@/lib/types";

export const meta: AppMeta = {
  name: "Your App Name",
  description: "What it does. Keep under 160 chars.",
  author_name: "Your Name",
  author_url: "https://github.com/yourname",  // optional
  category_slug: "fun",                        // game | tool | fun | app | other
  created_at: "2026-03-17T00:00:00Z",
};
```

## index.tsx (optional)

See `references/index-tsx-guide.md` for template + constraints.

- Default export React component
- Use `@/components/ui/*` (shadcn) for UI primitives
- Must include back button to `"/"`
- Keep under 150 lines; split if needed

## How auto-discovery works

`src/data/projects.ts` runs `import.meta.glob("../apps/*/meta.ts", { eager: true })` at build time.
If `index.tsx` exists in the same folder → `has_local_app: true` → "Launch App" appears on card.

## Checklist before PR

- [ ] Only files inside `src/apps/{slug}/` were created/modified
- [ ] `meta.ts` exports `const meta: AppMeta`
- [ ] `category_slug` ∈ `game | tool | fun | app | other`
- [ ] `created_at` is valid ISO-8601
- [ ] `index.tsx` has a default export (if present)
- [ ] `npm run build` passes
