# index.tsx Guide — Embedded Mini-App

## When to create it

Create `index.tsx` only if the app should be **launchable from inside the hub** (renders at `/apps/{slug}`).
If you only want to list the project on the hub (with demo/source links), `meta.ts` alone is sufficient.

## Minimal template

```tsx
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyApp() {
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      <h1 className="font-mono text-3xl font-bold text-gradient mb-2">My App</h1>
      {/* Your app content here */}
    </div>
  );
}
```

## Rules

- **Must have a default export** — the hub lazy-loads `m.default`
- **Back button required** — link back to `"/"` so users can exit the app
- **Use `@/components/ui/*`** — all shadcn primitives are available
- **Use `@/lib/utils`** — `cn()` for class merging
- **Self-contained** — do not import from other apps' folders
- **No new routes** — the app renders at `/apps/{slug}`, no sub-routes
- **Keep under 150 lines** — split into sub-components in the same folder if needed

## Available UI primitives (shadcn)

```
Button, Input, Textarea, Select, Dialog, Badge,
Card, Separator, Tabs, ScrollArea, Tooltip, ...
```
Import from `@/components/ui/{component-name}`.

## Styling conventions

- Dark glass card: `className="glass rounded-xl p-6"`
- Heading: `className="font-mono font-bold text-gradient"`
- Muted text: `className="text-muted-foreground text-sm"`
- Primary neon accent via `text-primary` / `bg-primary`

## Multi-file apps

For larger apps, create sub-components in the same folder:

```
src/apps/my-app/
├── meta.ts
├── index.tsx       ← entry point, composes sub-components
├── GameBoard.tsx
└── useGameState.ts
```

Import relatively: `import { GameBoard } from "./GameBoard"`
