# Cerberus Vibe Hub — Code Standards & Conventions

**Last Updated:** 2026-03-17
**Version:** 1.0.0
**Philosophy:** YAGNI, KISS, DRY — simplicity and pragmatism over perfectionism.

---

## File Organization & Naming

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Files/Folders** | kebab-case | `project-card.tsx`, `use-bookmarks.ts` |
| **Components** | PascalCase | `ProjectCard`, `Header` |
| **Hooks** | camelCase with `use` prefix | `useBookmarks`, `useProjects` |
| **Constants** | UPPER_SNAKE_CASE | `API_BASE_URL`, `CATEGORIES_LIMIT` |
| **Functions** | camelCase | `formatDate()`, `validateEmail()` |
| **Interfaces/Types** | PascalCase | `AppMeta`, `Project`, `Category` |
| **CSS Classes** | kebab-case (Tailwind) | `bg-primary`, `text-muted-foreground` |

### File Size Guidelines

**Target:** Keep individual files under 200 LOC for optimal context management.

```
< 50 LOC   — Simple utilities, small components
50-150 LOC — Standard components, hooks, utilities
150-200 LOC — Complex pages or containers
> 200 LOC  — REFACTOR (split into smaller modules)
```

**Split Strategy:**
- Extract reusable sub-components to separate files
- Move business logic to custom hooks
- Extract utility functions to lib/
- Create composition hierarchy for complex pages

### Directory Structure Rules

```
src/
├── apps/          # Mini-app submissions
├── components/    # Shared UI components
│   └── ui/        # shadcn/ui primitives (don't edit)
├── data/          # Static data & generators
├── hooks/         # Custom React hooks
├── i18n/          # Internationalization
├── lib/           # Utilities & types
├── pages/         # Route-level components
└── test/          # Test files
```

---

## React Component Patterns

### Functional Components Only
All components must be functional with hooks (no class components).

```typescript
// ✅ GOOD
export function ProjectCard({ project }: { project: Project }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  return <div>...</div>;
}

// ❌ BAD
class ProjectCard extends React.Component {
  // ...
}
```

### Props & TypeScript

```typescript
// ✅ GOOD — Define inline for simple components
export function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ ALSO GOOD — Extract interface for complex components
interface ProjectCardProps {
  project: Project;
  onBookmark?: (id: string) => void;
  isLoading?: boolean;
}

export function ProjectCard({ project, onBookmark, isLoading }: ProjectCardProps) {
  // ...
}

// ❌ BAD — PropTypes in 2026
// PropTypes are for runtime checking; TypeScript is compile-time safety
```

### Hooks Usage

```typescript
// ✅ GOOD — Create custom hooks for reusable logic
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vibe-cerberus-bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  return {
    bookmarks,
    addBookmark: (id: string) => { /* ... */ },
    removeBookmark: (id: string) => { /* ... */ },
  };
}

// ✅ USAGE in component
function Bookmarks() {
  const { bookmarks } = useBookmarks();
  return <div>{bookmarks.map(...)}</div>;
}

// ❌ BAD — Inline localStorage logic in component
function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("...");
    // ... repeated in multiple components
  }, []);
}
```

### State Management Escalation

```
Local state (useState)
    ↓ (if used in 2+ components)
Custom hook (useX)
    ↓ (if needed across entire app)
localStorage / React Context
    ↓ (rarely needed)
Global state (only if absolutely necessary)
```

**Rule:** Start with useState, elevate only when needed.

### External Links & Images

```typescript
// ✅ GOOD — Always use security attributes
<a href={url} target="_blank" rel="noopener noreferrer">
  Link
</a>

// ✅ GOOD — Always lazy-load images
<img src={url} loading="lazy" alt="description" />

// ❌ BAD
<a href={url}>Link</a>  // No security attrs; could be exploited
<img src={url} alt="..." /> // Eager loading; bad for performance
```

---

## TypeScript Guidelines

### Configuration Philosophy
TypeScript is configured **leniently** to balance type safety with rapid development:

```json
{
  "strict": false,
  "strictNullChecks": false,
  "noImplicitAny": false
}
```

**Why?** Rapid prototyping without type annotation overhead. Use TS to catch obvious mistakes, not as a compiler prison.

### Type Annotations

```typescript
// ✅ GOOD — Annotate function parameters
function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// ✅ GOOD — Annotate return types for exported functions
export function getProjects(): Project[] {
  return projects;
}

// ✅ OKAY — Inference is fine for local variables
const name = "Cerberus"; // string inferred
const count = projects.length; // number inferred

// ✅ GOOD — Use interfaces for object shapes
interface AppMeta {
  name: string;
  description: string;
  // ...
}

// ❌ AVOID — Overly strict type gymnastics
type DeepReadonly<T> = {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
}; // Not needed for this codebase
```

### Union & Nullable Types

```typescript
// ✅ GOOD — Use union types for alternatives
type Category = "game" | "tool" | "fun" | "app" | "other";

// ✅ GOOD — Explicit nullable (with lenient TS config)
interface Project {
  demo_url: string | null;
  source_url: string | null;
}

// ✅ GOOD — Optional props
interface ProjectCardProps {
  onBookmark?: (id: string) => void;
  isLoading?: boolean;
}

// ❌ AVOID — `any` type (unless absolutely necessary)
function processData(data: any) {} // Too permissive
```

---

## Styling Guidelines

### Tailwind CSS: Utility-First

```typescript
// ✅ GOOD — Use Tailwind utilities
<div className="flex items-center gap-4 rounded-lg bg-card p-4">
  <img src={url} alt="..." className="h-16 w-16 rounded object-cover" />
  <div>
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
</div>

// ✅ GOOD — Conditional classes with cn()
<button
  className={cn(
    "px-4 py-2 rounded-lg font-medium transition",
    isActive ? "bg-primary text-white" : "bg-secondary text-gray-400"
  )}
>
  Click me
</button>

// ❌ BAD — CSS modules or styled-components
import styles from "./project.module.css";
// These add unnecessary complexity

// ❌ BAD — Inline styles
<div style={{ backgroundColor: "red", padding: "16px" }}>
  // No type safety, hard to maintain
```

### Color & Semantic Classes

```typescript
// ✅ USE SEMANTIC COLORS
className="bg-primary text-white"        // Main action
className="bg-secondary text-foreground"  // Secondary action
className="bg-accent text-accent-foreground" // Accent
className="text-muted-foreground"         // Disabled/hint text
className="border-border"                 // Dividers

// ❌ AVOID HARDCODED COLORS
className="bg-red-500 text-blue-200"      // Can't be themed
```

### Component Styling

```typescript
// ✅ GOOD — Let shadcn/ui components handle styling
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return <Button variant="outline">Click</Button>;
}

// SHADCN VARIANTS
// Button: default, destructive, outline, secondary, ghost, link
// Input: default (unstyled base)
// Dialog: auto-styles with backdrop blur
```

---

## State Management Rules

### Rule 1: React Hooks for Local State
```typescript
function ProjectCard({ project }: { project: Project }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  // No external state needed
}
```

### Rule 2: Custom Hooks for Reusable Stateful Logic
```typescript
// hooks/useBookmarks.ts
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("vibe-cerberus-bookmarks");
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  return { bookmarks, addBookmark, removeBookmark };
}

// Used in multiple pages/components
```

### Rule 3: localStorage for Persistence
```typescript
// Bookmarks, language preference, user settings
useEffect(() => {
  localStorage.setItem("vibe-cerberus-bookmarks", JSON.stringify(bookmarks));
}, [bookmarks]);
```

### Rule 4: Static Data from Vite Glob (Never Changes)
```typescript
// src/data/projects.ts
export const projects: Project[] = [ /* auto-discovered at build */ ];

// Used directly, no hook needed
```

### Rule 5: No Global State (Redux, Zustand)
Unless the problem has been unsolved for 6+ months, assume useState + custom hooks are sufficient.

---

## Error Handling & Security

### Try-Catch Pattern
```typescript
// ✅ GOOD
useEffect(() => {
  const loadApp = async () => {
    try {
      const module = await import(`./apps/${slug}/index.tsx`);
      setComponent(() => module.default);
    } catch (error) {
      console.error(`Failed to load app: ${slug}`, error);
      setNotFound(true);
    }
  };

  loadApp();
}, [slug]);

// ❌ BAD — Silent failures
const loader = appComponents[key]; // What if undefined?
loader().then(m => setComponent(m.default)); // No error boundary
```

### Data Validation with Zod
```typescript
// ✅ GOOD — Validate external data
import { z } from "zod";

const AppMetaSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  author_name: z.string(),
  category_slug: z.enum(["game", "tool", "fun", "app", "other"]),
  created_at: z.string().datetime(),
});

const validated = AppMetaSchema.parse(incomingData);

// ❌ BAD — Trust untrusted input
const meta = JSON.parse(userInput); // No validation
```

### XSS Prevention
```typescript
// ✅ GOOD — React escapes by default
<div>{userInput}</div> // Safe from XSS

// ✅ GOOD — Use dangerouslySetInnerHTML only if necessary + sanitize
import DOMPurify from "dompurify";
<div
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(userHTML),
  }}
/>

// ❌ BAD — Trust HTML directly
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // XSS vulnerability
```

---

## Testing Standards

### Test Structure
```typescript
// ✅ GOOD — Clear test names, arrange-act-assert
describe("ProjectCard", () => {
  test("renders project name", () => {
    const project = { name: "Test", ... };
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  test("calls onBookmark when bookmark button clicked", () => {
    const onBookmark = vi.fn();
    const project = { ... };
    render(<ProjectCard project={project} onBookmark={onBookmark} />);

    user.click(screen.getByRole("button", { name: /bookmark/i }));
    expect(onBookmark).toHaveBeenCalledWith(project.id);
  });
});

// ❌ BAD — Vague test names
test("works", () => {
  // What does "works" mean?
});

// ❌ BAD — No assertions
test("renders", () => {
  render(<Component />);
  // Where's the assertion?
});
```

### Coverage Goals

| Module | Target |
|--------|--------|
| **Core hooks** | 80%+ |
| **Utilities** | 90%+ |
| **Pages** | 60%+ |
| **UI components** | 50%+ (less critical) |
| **Overall** | 60%+ |

**Rule:** Prioritize critical paths over 100% coverage.

---

## Git & Commit Standards

### Commit Message Format (Conventional Commits)
```
<type>: <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore

```bash
# ✅ GOOD
git commit -m "feat: add bookmark persistence to localStorage"
git commit -m "fix: handle missing app metadata gracefully"
git commit -m "docs: add codebase summary"

# ❌ BAD
git commit -m "update stuff"
git commit -m "fix bug"
git commit -m "WIP"
```

### Branch Naming
```
feature/project-search
fix/missing-translations
docs/setup-guide
```

### PRs
- Keep focused on a single feature/fix
- Include descriptive title and body
- Link related issues
- Pass ESLint + tests before merge

---

## Common Gotchas & Solutions

| Issue | Solution |
|-------|----------|
| **Import paths are long** | Use `@/*` alias from tsconfig |
| **Component prop drilling** | Extract sub-components or use context |
| **useState causing re-renders** | Move state up or use useCallback |
| **Tailwind classes not applying** | Use cn() to merge; check class names |
| **i18n keys undefined** | Add to src/i18n/locales/{en,vi}.json |
| **Lazy loading fails silently** | Add try-catch, error logging |
| **localStorage key conflicts** | Use prefixed keys: `vibe-cerberus-*` |

---

## Code Quality Checklist

Before committing, verify:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] No console.log statements (except for debugging)
- [ ] Components under 200 LOC
- [ ] Imports use @/* alias
- [ ] File names in kebab-case
- [ ] No hardcoded colors (use Tailwind semantic classes)
- [ ] External links use `target="_blank" rel="noopener noreferrer"`
- [ ] Images use `loading="lazy"`
- [ ] i18n strings used instead of hardcoded text
- [ ] No commented-out code (delete or explain)
- [ ] Meaningful commit message
