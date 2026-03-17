# Cerberus Vibe Hub — Codebase Summary

**Last Updated:** 2026-03-17
**Total LOC:** ~5,500 (excluding node_modules and UI primitives)
**React Components:** 56+ | **Pages:** 6 | **Apps:** 2 | **Languages:** 2 (EN + VI)

---

## Directory Structure with LOC

```
src/ (~5,500 LOC total)
├── apps/ (~150 LOC)
│   ├── hello-world/ (30 LOC)
│   │   ├── index.tsx            # Simple greeting component
│   │   └── meta.ts              # AppMeta definition
│   └── cerberus-calculator/ (30 LOC)
│       ├── index.tsx            # Calculator component
│       └── meta.ts              # AppMeta definition
│
├── components/ (~400 LOC)
│   ├── Header.tsx (61 LOC)      # Nav + language switcher
│   ├── ProjectCard.tsx (65 LOC) # Project card UI
│   ├── NavLink.tsx (25 LOC)     # Navigation link
│   └── ui/ (249 LOC)            # 53 shadcn/ui primitives
│       ├── button.tsx, card.tsx, dialog.tsx, etc.
│       └── Form components: input, select, checkbox, radio
│
├── data/ (~60 LOC)
│   ├── projects.ts (31 LOC)     # Vite glob auto-discovery
│   └── categories.ts (29 LOC)   # 5 category definitions
│
├── hooks/ (~150 LOC)
│   ├── useBookmarks.ts (27 LOC) # localStorage bookmark management
│   ├── useProjects.ts (45 LOC)  # Static project data loader
│   ├── use-mobile.tsx (28 LOC)  # Responsive breakpoint hook
│   └── use-toast.ts (50 LOC)    # Toast notification hook
│
├── i18n/ (~100 LOC)
│   ├── config.ts (27 LOC)       # i18next setup & initialization
│   └── locales/ (73 LOC)
│       ├── en.json (38 LOC)     # English translations
│       └── vi.json (35 LOC)     # Vietnamese translations
│
├── lib/ (~80 LOC)
│   ├── types.ts (37 LOC)        # AppMeta, Project, Category interfaces
│   └── utils.ts (43 LOC)        # cn() utility for Tailwind merging
│
├── pages/ (~330 LOC)
│   ├── Index.tsx (152 LOC)      # Home: search, category filter, grid
│   ├── ProjectDetail.tsx (75 LOC) # Single project view
│   ├── Bookmarks.tsx (32 LOC)   # Saved projects list
│   ├── Leaderboard.tsx (50 LOC) # Top projects ranking
│   ├── SubmitProject.tsx (18 LOC) # Submission guide
│   └── NotFound.tsx (3 LOC)     # 404 page
│
├── test/ (~50 LOC)
│   ├── example.test.ts (25 LOC) # Sample unit test
│   └── setup.ts (25 LOC)        # Vitest + Testing Library setup
│
├── App.tsx (76 LOC)             # Routes & mini-app auto-loader
├── main.tsx (15 LOC)            # React entry, i18n init
└── vite-env.d.ts (4 LOC)        # Vite type definitions

Root Files
├── package.json (101 LOC)       # Dependencies, scripts
├── vite.config.ts (20 LOC)      # Build configuration
├── tailwind.config.ts (95 LOC)  # Tailwind theming
├── tsconfig.json (23 LOC)       # TypeScript config (lenient)
├── vitest.config.ts (15 LOC)    # Test runner config
├── eslint.config.js (30 LOC)    # Linting rules
└── index.html (30 LOC)          # HTML entry point
```

---

## Key Files & Patterns

### Core: Auto-Discovery Engine

**File:** `src/data/projects.ts` (31 LOC)

```typescript
const metaModules = import.meta.glob("../apps/*/meta.ts", { eager: true });
const appModules = import.meta.glob("../apps/*/index.tsx");

export const projects: Project[] = Object.entries(metaModules)
  .map(([path, module]) => {
    const slug = path.split("/").slice(-2)[0];
    const hasLocalApp = `../apps/${slug}/index.tsx` in appModules;
    return {
      ...module.meta,
      id: slug,
      has_local_app: hasLocalApp,
      is_approved: true,
      author_url: null,
      demo_url: null,
      source_url: null,
      thumbnail_url: null,
      updated_at: module.meta.created_at,
    };
  })
  .sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
```

**How It Works:**
1. Vite compiles all `src/apps/*/meta.ts` files at build time
2. `import.meta.glob()` creates a module record for each app
3. Loop extracts slug from file path, checks for index.tsx
4. Projects sorted by creation date (newest first)

### Mini-App Renderer

**File:** `src/App.tsx` (lines 14-55)

```typescript
const appComponents = import.meta.glob("./apps/*/index.tsx");

function AppRenderer() {
  const { slug } = useParams<{ slug: string }>();
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const key = `./apps/${slug}/index.tsx`;
    const loader = appComponents[key];
    if (!loader) return setNotFound(true);

    loader()
      .then((m) => setComponent(() => m.default))
      .catch(() => setNotFound(true));
  }, [slug]);

  return Component ? <Component /> : <NotFound />;
}
```

**Pattern:**
- Lazy-load mini-app on route change
- Only download chunk if app exists
- Handle errors gracefully with NotFound page

### Bookmark Persistence

**File:** `src/hooks/useBookmarks.ts` (27 LOC)

```typescript
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vibe-cerberus-bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  const addBookmark = (id: string) => {
    const updated = [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem("vibe-cerberus-bookmarks", JSON.stringify(updated));
  };

  // ... removeBookmark, isBookmarked methods
}
```

**Pattern:**
- Sync localStorage on mount
- Update state & persist on each change
- Debounce not needed (small dataset)

### i18n Configuration

**File:** `src/i18n/config.ts` (27 LOC)

```typescript
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, vi: { translation: vi } },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });
```

**Detection Order:**
1. localStorage (user preference)
2. navigator.language (browser setting)
3. Fallback: English

---

## Component Hierarchy

```
App
├── Header
│   ├── NavLink (4x)
│   └── Language Switcher
├── Routes
│   ├── Index Page
│   │   ├── SearchInput
│   │   ├── CategoryFilter
│   │   └── ProjectCard (N×)
│   ├── ProjectDetail Page
│   │   ├── ProjectInfo
│   │   ├── DemoLink
│   │   └── BookmarkButton
│   ├── Bookmarks Page
│   │   └── ProjectCard (bookmarked only)
│   ├── SubmitProject Page
│   │   └── Step-by-step guide
│   ├── AppRenderer (lazy)
│   │   └── Mini-app component (custom per app)
│   └── NotFound Page
└── Toast/Tooltip Providers
```

---

## Data Types

### AppMeta (Required)
```typescript
interface AppMeta {
  name: string;
  description: string;
  author_name: string;
  author_url?: string | null;
  category_slug: "game" | "tool" | "fun" | "app" | "other";
  demo_url?: string | null;
  source_url?: string | null;
  thumbnail_url?: string | null;
  created_at: string; // ISO date
}
```

### Project (Extended)
```typescript
interface Project extends AppMeta {
  id: string;                    // slug
  is_approved: boolean;          // always true (no moderation)
  has_local_app: boolean;        // index.tsx exists
  updated_at: string;            // same as created_at
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  slug: "game" | "tool" | "fun" | "app" | "other";
  icon: string;                  // emoji
  sort_order: number;
}
```

---

## State Management Pattern

### Local Component State
- Search query, category filter, loading flags
- Used in Index.tsx with useState

### Persistent State (localStorage)
- Bookmarks: key `vibe-cerberus-bookmarks`
- i18n language: key `i18nextLng`
- Managed via custom hooks

### Static Data
- Projects array from Vite glob
- Categories array (5 entries)
- Never changes at runtime

---

## Styling Architecture

### Framework: Tailwind CSS 3.4
- Utility-first CSS
- 3,000+ pre-defined classes
- Custom theme in tailwind.config.ts

### UI Primitives: shadcn/ui
- 53 Radix UI components
- Unstyled by default, styled with Tailwind
- Key components: Button, Card, Dialog, Form, Input, Select

### Color Theme
```javascript
colors: {
  primary: "hsl(347 77% 50%)",   // Crimson red
  secondary: "hsl(0 0% 15%)",     // Near black
  accent: "hsl(0 0% 100%)",       // White
  background: "hsl(0 0% 5%)",     // Very dark
  foreground: "hsl(0 0% 90%)",    // Light gray
  // ... 20+ semantic colors
}
```

### Design Pattern: cn() Utility
```typescript
import { cn } from "@/lib/utils";

// Merge Tailwind classes with conditional overrides
<button className={cn(
  "px-4 py-2 bg-primary",
  active && "bg-secondary"
)}>
```

---

## TypeScript Configuration

### File: tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": false,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Philosophy:** Lenient config allows rapid prototyping without type overhead.

---

## Testing Setup

### Framework: Vitest 4.1 + Testing Library
- Unit tests in `src/test/`
- Component testing with React Testing Library
- E2E testing with Playwright (separate config)

### Example Test
```typescript
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/ProjectCard";

test("renders project name", () => {
  const project = { name: "Test App", ... };
  render(<ProjectCard project={project} />);
  expect(screen.getByText("Test App")).toBeInTheDocument();
});
```

---

## Build & Deployment

### Vite Configuration
```typescript
export default defineConfig({
  plugins: [react()],
  server: { port: 8080 },
  build: { outDir: "dist", minify: "esbuild" },
});
```

### Build Steps
1. TypeScript compilation check
2. Vite bundles React + dependencies
3. Tailwind CSS purging (unused classes removed)
4. Minification & tree-shaking
5. Static assets optimization

### Output
- `dist/index.html` — HTML entry
- `dist/assets/*.js` — Code chunks (lazy-loaded)
- `dist/assets/*.css` — Styles
- Total size: ~300-400 KB gzipped

---

## Performance Characteristics

| Metric | Value | Strategy |
|--------|-------|----------|
| **Build Time** | ~20s | Vite dev, fast rebuild |
| **Lazy Load (JS)** | 100-150 KB | Code-split mini-apps |
| **LCP (Largest Contentful Paint)** | < 2s | Pre-load critical CSS |
| **CLS (Cumulative Layout Shift)** | 0.05 | Fixed dimensions |
| **Code Splitting** | Per-app chunks | Vite auto-chunks |

---

## Development Workflow

### File Organization Rules
1. **Naming:** kebab-case (e.g., `project-card.tsx`)
2. **Size:** Keep under 200 LOC; split if larger
3. **Imports:** Use @/* path alias from tsconfig
4. **Styling:** Tailwind utilities + cn() for merges

### Common Tasks

**Add a new page:**
```bash
npm run create:page
```

**Add a new app:**
1. Create `src/apps/{slug}/meta.ts`
2. Optionally create `src/apps/{slug}/index.tsx`
3. Run `npm run build`

**Add i18n translation:**
1. Edit `src/i18n/locales/en.json` or `vi.json`
2. Use `useTranslation()` hook in component

**Run tests:**
```bash
npm run test          # Once
npm run test:watch    # Watch mode
```

---

## Key Dependencies & Versions

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.3.1 | UI framework |
| typescript | 5.8.3 | Type safety |
| vite | 8.0.0 | Build tool |
| tailwindcss | 3.4.17 | Styling |
| react-router-dom | 6.30.1 | Routing |
| i18next | 25.8.18 | Internationalization |
| react-hook-form | 7.61.1 | Form handling |
| zod | 3.25.76 | Schema validation |
| vitest | 4.1.0 | Test runner |

---

## Known Patterns & Anti-Patterns

### ✅ Recommended Patterns
- Use `useTranslation()` hook for i18n (not string literals)
- Store persistent state in localStorage via hooks
- Lazy-load mini-app components with dynamic import
- Use Tailwind utilities + cn() instead of CSS modules
- Keep components under 200 LOC

### ❌ Avoid
- Global state (Redux/Zustand) — use React Context sparingly
- Server API calls — data is static at build time
- CSS-in-JS or inline styles — use Tailwind
- Complex nested components — extract to separate files
- Manual date handling — use date-fns

---

## Extension Points

1. **New App Submission:** Create `src/apps/{slug}/meta.ts` + optional `index.tsx`
2. **New Page:** Create `src/pages/{PageName}.tsx`, add route in App.tsx
3. **New Hook:** Create `src/hooks/use{HookName}.ts`, export from hooks dir
4. **New Translation:** Add keys to `src/i18n/locales/{en,vi}.json`
5. **UI Component:** Extend shadcn/ui or create custom in `src/components/`
