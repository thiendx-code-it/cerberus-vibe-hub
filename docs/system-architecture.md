# Cerberus Vibe Hub — System Architecture

**Last Updated:** 2026-03-17
**Architecture Pattern:** Micro-Frontend Hub with Static Data

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           React Router SPA                       │   │
│  │  ┌──────────┬──────────┬──────────┬───────────┐ │   │
│  │  │ Home     │ Project  │Bookmarks │ Submit    │ │   │
│  │  │ Page     │ Detail   │ Page     │ Page      │ │   │
│  │  │(search)  │(demo)    │(saved)   │(guide)    │ │   │
│  │  └──────────┴──────────┴──────────┴───────────┘ │   │
│  │                                                  │   │
│  │  ┌────────────────────────────────────────────┐ │   │
│  │  │      App Renderer (Lazy Loading)           │ │   │
│  │  │  Loads /apps/{slug}/index.tsx on demand   │ │   │
│  │  └────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   Component Layer (56+ components)             │   │
│  │   ├─ Header (nav + language switcher)          │   │
│  │   ├─ ProjectCard (reusable card)               │   │
│  │   └─ UI Primitives (53 shadcn/ui components)  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   State & Hooks Layer                          │   │
│  │   ├─ useState (local UI state)                 │   │
│  │   ├─ useBookmarks (localStorage persistence)  │   │
│  │   ├─ useProjects (static data loader)         │   │
│  │   └─ useTranslation (i18next)                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   Static Data Layer (Vite Glob)                │   │
│  │   ├─ projects: Project[]                       │   │
│  │   ├─ categories: Category[]                    │   │
│  │   └─ i18n: translations (en, vi)              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │   Persistent Storage                           │   │
│  │   ├─ localStorage: bookmarks                   │   │
│  │   └─ localStorage: i18nextLng                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

BUILD TIME (Vite)
├─ Discover apps: import.meta.glob("src/apps/*/meta.ts")
├─ Build metadata: projects array with slug + has_local_app
├─ Generate bundles: index.html + chunks
├─ Optimize: minify, tree-shake, split lazy chunks
└─ Output: dist/ (ready for deployment)
```

---

## Core Subsystems

### 1. Micro-Frontend Plugin System

**How It Works:**

1. **Discovery Phase (Build Time)**
   - Vite scans `src/apps/*/meta.ts` files
   - Extracts AppMeta for each app
   - Checks if `src/apps/{slug}/index.tsx` exists
   - Builds `projects` array with auto-sorted entries

2. **Registration Phase (Runtime)**
   - `App.tsx` imports all app modules via `import.meta.glob()`
   - Stores module references in `appComponents` map
   - No manual registration needed

3. **Loading Phase (On Route)**
   - User navigates to `/apps/{slug}`
   - `AppRenderer` looks up key `./apps/{slug}/index.tsx`
   - Dynamically imports component (code split)
   - Renders in isolation or shows error

**Code:**
```typescript
// Build time: src/data/projects.ts
const metaModules = import.meta.glob("../apps/*/meta.ts", { eager: true });
const appModules = import.meta.glob("../apps/*/index.tsx");

export const projects: Project[] = Object.entries(metaModules)
  .map(([path, module]) => {
    const slug = path.split("/").slice(-2)[0];
    return {
      ...module.meta,
      id: slug,
      has_local_app: `../apps/${slug}/index.tsx` in appModules,
    };
  });

// Runtime: src/App.tsx
const appComponents = import.meta.glob("./apps/*/index.tsx");

function AppRenderer() {
  const { slug } = useParams<{ slug: string }>();
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    const key = `./apps/${slug}/index.tsx`;
    const loader = appComponents[key];
    if (!loader) return setNotFound(true);

    loader().then(m => setComponent(() => m.default));
  }, [slug]);

  return Component ? <Component /> : <NotFound />;
}
```

**Benefits:**
- Zero central registry → no bottleneck
- Apps can be added by creating a directory + meta.ts
- Lazy loading reduces main bundle size
- Automatic discovery via glob patterns

---

### 2. Routing & Navigation

**Route Map:**
```
/                  → Index (home feed with search & filter)
/project/:id       → ProjectDetail (single project view)
/apps/:slug        → AppRenderer (embedded mini-app, lazy-loaded)
/bookmarks         → Bookmarks (saved projects)
/leaderboard       → Leaderboard (top projects ranking)
/submit            → SubmitProject (submission guide)
/*                 → NotFound (404)
```

**Navigation Flow:**
```
Browser URL Change
        ↓
React Router parses URL
        ↓
Renders corresponding page component
        ↓
If /apps/:slug: AppRenderer triggers lazy load
        ↓
Component renders or error shown
        ↓
Cached for future visits (Vite module cache)
```

**Code:**
```typescript
// src/App.tsx
const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/apps/:slug" element={<AppRenderer />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/submit" element={<SubmitProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);
```

---

### 3. State Management Architecture

**Layered Approach:**

```
Layer 1: COMPONENT LOCAL STATE (useState)
├─ Search query
├─ Category filter
├─ Loading flags
├─ Modal open/close
└─ Form values
    ↓ (escalate only if 2+ components need same state)

Layer 2: CUSTOM HOOKS (useX)
├─ useBookmarks() → localStorage persistence
├─ useProjects() → static data with filtering
└─ useTranslation() → i18next language
    ↓ (escalate only if needed globally)

Layer 3: BROWSER STORAGE (localStorage)
├─ vibe-cerberus-bookmarks (JSON array of project IDs)
├─ i18nextLng (language code: "en" or "vi")
└─ Custom user settings (if added later)
    ↓ (escalate only if app grows significantly)

Layer 4: GLOBAL STATE (never for this project)
└─ No Redux/Zustand needed — keep it simple
```

**Example: Bookmark State**

```typescript
// Custom hook (Layer 2)
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Sync from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vibe-cerberus-bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  // Persist on change
  const addBookmark = (id: string) => {
    const updated = [...bookmarks, id];
    setBookmarks(updated);
    localStorage.setItem("vibe-cerberus-bookmarks", JSON.stringify(updated));
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(bid => bid !== id);
    setBookmarks(updated);
    localStorage.setItem("vibe-cerberus-bookmarks", JSON.stringify(updated));
  };

  return { bookmarks, addBookmark, removeBookmark };
}

// Usage in component (Layer 1)
function ProjectCard({ project }: { project: Project }) {
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const isBookmarked = bookmarks.includes(project.id);

  return (
    <button
      onClick={() =>
        isBookmarked ? removeBookmark(project.id) : addBookmark(project.id)
      }
    >
      {isBookmarked ? "Saved" : "Save"}
    </button>
  );
}
```

---

### 4. Internationalization (i18n) System

**Architecture:**

```
i18next Library
├─ Language Detector
│   ├─ Check localStorage (i18nextLng)
│   ├─ Check browser language (navigator.language)
│   └─ Fallback: "en"
├─ Resources (translations)
│   ├─ en.json (English)
│   └─ vi.json (Vietnamese)
└─ React Integration
    └─ useTranslation() hook in components

User Language Selection
├─ Browser detects on first visit → auto-switch
├─ User manually switches → save to localStorage
└─ Persist across sessions
```

**Configuration:**
```typescript
// src/i18n/config.ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });
```

**Usage in Components:**
```typescript
import { useTranslation } from "react-i18next";

export function Header() {
  const { t, i18n } = useTranslation();

  return (
    <header>
      <h1>{t("nav.title")}</h1>
      <button onClick={() => i18n.changeLanguage("vi")}>
        {t("language.vietnamese")}
      </button>
    </header>
  );
}
```

**Language Detection Order:**
1. localStorage key `i18nextLng` (user preference)
2. navigator.language (browser setting)
3. Fallback: English

---

### 5. Data Flow & Project Discovery

**Static Data Pipeline:**

```
GitHub Repository
    ↓
src/apps/hello-world/
├─ meta.ts (AppMeta definition)
└─ index.tsx (optional React component)
    ↓
Vite Build (npm run build)
    ↓
import.meta.glob("apps/*/meta.ts", { eager: true })
    ↓
projects.ts generates Project[] array
├─ name, description, author, category
├─ id = slug (extracted from path)
├─ has_local_app = boolean (index.tsx exists?)
└─ sorted by created_at (newest first)
    ↓
projects array available at runtime
    ↓
Pages consume via useProjects() hook
    ↓
UI renders ProjectCard components
```

**No External API Calls:**
- All data pre-computed at build time
- Zero network latency for project list
- Instant search & filtering
- Fast initial page load

---

### 6. Styling Architecture

**Tailwind CSS + shadcn/ui Stack:**

```
Tailwind Config (tailwind.config.ts)
├─ Color Theme (dark + semantic colors)
├─ Typography (IBM Plex Sans body + JetBrains Mono headings/code)
├─ Spacing (8px baseline grid)
└─ Animations (fade, slide, accordion)
    ↓
shadcn/ui Components (53 Radix UI primitives)
├─ Unstyled by default
├─ Compose with Tailwind utilities
└─ Variants via class merging (cn())
    ↓
Component Styling (src/components/*.tsx)
├─ Use className prop with Tailwind
├─ Conditional classes via cn()
├─ No CSS modules or styled-components
└─ No inline styles
    ↓
Runtime
├─ Tailwind purges unused classes
├─ Minimal CSS output (~40-50 KB)
└─ Zero layout shift (fixed dimensions)
```

**Example Component:**
```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProjectCard({ project, isActive }: Props) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className={cn(
        "text-lg font-semibold",
        isActive && "text-primary"
      )}>
        {project.name}
      </h3>
      <p className="text-sm text-muted-foreground">{project.description}</p>
      <Button variant="outline" className="mt-4">
        Learn More
      </Button>
    </div>
  );
}
```

**Color Palette:**
```
Primary: hsl(347 77% 50%)    — Crimson red (actions)
Secondary: hsl(0 0% 15%)     — Dark gray (secondary actions)
Accent: hsl(0 0% 100%)       — White (highlights)
Background: hsl(0 0% 5%)     — Near black (page bg)
Foreground: hsl(0 0% 90%)    — Light gray (text)
Card: hsl(0 0% 10%)          — Dark card bg
Muted: hsl(0 0% 45%)         — Muted text
Border: hsl(0 0% 20%)        — Border color
```

---

### 7. Build & Deployment Pipeline

**Build Process:**

```
npm run build
    ↓
1. TypeScript Compilation
   └─ Check for type errors (tsconfig: lenient)
    ↓
2. Vite Bundle
   ├─ Discover apps via glob patterns
   ├─ Build projects array
   └─ Generate chunks (code splitting)
    ↓
3. Asset Processing
   ├─ Optimize images
   ├─ Inline small assets
   └─ Hash filenames
    ↓
4. Tailwind Purging
   └─ Remove unused CSS classes
    ↓
5. Output Minification
   ├─ Minify JavaScript (esbuild)
   ├─ Minify CSS
   └─ Compress assets
    ↓
dist/ Directory
├─ index.html (entry point)
├─ assets/
│   ├─ main.[hash].js (~200 KB gzipped)
│   ├─ style.[hash].css (~40 KB gzipped)
│   └─ app-hello-world.[hash].js (lazy, ~20 KB)
└─ public/ (static assets)
```

**Deployment Targets:**
- Vercel (recommended, auto-deploy on push)
- GitHub Pages (free, static hosting)
- Netlify (alternative)
- Any static host (S3, CloudFlare Pages)

---

## Data Models

### AppMeta (Required for every app)
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
  created_at: string; // ISO 8601 date
}
```

### Project (Derived from AppMeta)
```typescript
interface Project {
  // Inherited from AppMeta
  name: string;
  description: string;
  author_name: string;
  author_url: string | null;
  category_slug: string;
  demo_url: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  created_at: string;

  // Computed at build time
  id: string;                    // slug (from dir name)
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
  created_at: string;
}
```

---

## Security Considerations

### XSS Protection
- React escapes HTML by default
- Use `rel="noopener noreferrer"` on external links
- Validate metadata via Zod (if adding user input)
- Never use `dangerouslySetInnerHTML` without sanitization

### CSRF Protection
- No form submissions to external APIs (static data only)
- GitHub PR process handles authentication

### Data Validation
- TypeScript interfaces enforce shape
- Zod schemas for user submissions (future)
- Build-time validation of app metadata

### Content Security Policy (CSP)
- Default-src 'self' (restrict external resources)
- Script-src 'self' (no inline scripts)
- Style-src 'self' 'unsafe-inline' (Tailwind requires inline for themes)

---

## Performance Optimization

| Strategy | Implementation | Impact |
|----------|----------------|--------|
| **Code Splitting** | Lazy load mini-apps via route | -100-200 KB from main bundle |
| **Image Optimization** | loading="lazy" on all images | Deferred image fetch |
| **CSS Purging** | Tailwind removes unused classes | -60% CSS size |
| **Tree Shaking** | ES modules + esbuild | -30-40% bundle |
| **Compression** | gzip at deploy (Vercel) | -70% transfer size |
| **Caching** | Static hosting with long TTLs | No refresh needed |
| **Static Data** | No API calls, instant loads | < 2s FCP |

**Targets:**
- Bundle size: < 500 KB gzipped
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 2s
- Cumulative Layout Shift: < 0.05

---

## Scaling Considerations

**Current Capacity:**
- 2 embedded apps (hello-world, cerberus-calculator)
- 5 categories
- ~100 projects (estimated)

**Future Scaling (Q2-Q4 2026):**
- 50+ apps (refactor app folder structure if needed)
- Tags system (add metadata field)
- Ratings/comments (consider lightweight DB: Supabase)
- Analytics (client-side event tracking via Plausible/Vercel Analytics)

**When to Add Backend:**
- User accounts (saved settings per user)
- Real-time notifications
- Moderation dashboard
- Usage analytics
- Search ranking (personalization)
