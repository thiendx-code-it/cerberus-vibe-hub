# Contributing to vibe.cerberus

Thank you for wanting to contribute! This guide covers everything you need to add your mini-app to the hub or improve the platform itself.

---

## Ways to Contribute

| Type | Description |
|------|-------------|
| **Submit an App** | Add your mini-app under `src/apps/` via PR |
| **Bug Fix** | Fix an issue and open a PR |
| **Feature** | Propose and implement a new platform feature |
| **i18n** | Improve or add translations |
| **Docs** | Improve documentation |

---

## Submitting a Mini-App (Most Common)

### 1. Fork & Clone

```bash
git clone https://github.com/thiendx-code-it/cerberus-vibe-hub.git
cd cerberus-vibe-hub
npm install        # or: pnpm install
```

### 2. Create Your App Directory

```
src/apps/your-app-slug/
├── meta.ts        # Required — project metadata
└── index.tsx      # Optional — embedded React component
```

Use the scaffold script to generate both files interactively:

```bash
npm run create:page
```

### 3. Write `meta.ts`

```typescript
import type { AppMeta } from "@/lib/types";

export const meta: AppMeta = {
  name: "Your App Name",
  description: "What does your app do? (1-2 sentences)",
  author_name: "Your Name",
  author_url: "https://github.com/yourname",   // optional
  category_slug: "fun",  // game | tool | fun | app | other
  created_at: "2026-03-17T00:00:00Z",
};
```

### 4. (Optional) Write `index.tsx`

If your app is interactive, add an embedded component:

```tsx
export default function YourApp() {
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      {/* your app UI */}
    </div>
  );
}
```

The hub lazy-loads it automatically at `/apps/your-app-slug`.

### 5. Test Locally

```bash
npm run dev        # http://localhost:8080
```

Your app should appear on the feed and detail page automatically.

### 6. Open a Pull Request

```bash
git checkout -b feat/your-app-slug
git add src/apps/your-app-slug/
git commit -m "feat: add your-app-slug"
git push origin feat/your-app-slug
```

Then open a PR on GitHub against the `main` branch.

---

## Platform Contributions (Bug Fixes / Features)

### Dev Setup

```bash
npm install
npm run dev        # dev server on :8080
npm run test       # run tests
npm run lint       # lint check
npx tsc --noEmit   # type-check
```

### Branch Naming

| Type | Pattern |
|------|---------|
| Feature | `feat/short-description` |
| Bug fix | `fix/short-description` |
| i18n | `i18n/lang-or-key` |
| Docs | `docs/short-description` |

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add random project button
fix: resolve ProjectCard duplicate declaration
i18n: add missing leaderboard keys in vi.json
docs: update contributing guide
```

### PR Checklist

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run lint` passes
- [ ] `npm run test` passes
- [ ] App renders correctly on mobile and desktop
- [ ] i18n keys added in both `en.json` **and** `vi.json` (for platform changes)

---

## Project Structure Quick Reference

```
src/
├── apps/           ← your mini-app goes here
├── components/     ← shared UI components
├── data/           ← static project/category data (auto-generated)
├── hooks/          ← React hooks
├── i18n/locales/   ← en.json + vi.json translations
├── lib/            ← types, utils
└── pages/          ← route-level page components
```

---

## Code Style

- **TypeScript** — no `any`, prefer explicit types
- **Tailwind CSS** — use existing utility classes; avoid inline styles
- **Components** — keep files under ~150 lines; split if larger
- **No external runtime deps** inside `src/apps/` — use only what's already in `package.json`

---

## Questions?

Open an [issue](https://github.com/thiendx-code-it/cerberus-vibe-hub/issues) or start a discussion. We're happy to help!
