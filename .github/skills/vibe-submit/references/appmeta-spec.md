# AppMeta Interface Spec

```ts
// src/lib/types.ts
export interface AppMeta {
  name: string;         // Display name on hub card
  description: string;  // Short description (≥10, ≤160 chars recommended)
  author_name: string;  // Your name / team name
  author_url?: string | null;  // GitHub/portfolio link (optional)
  category_slug: string;       // Must be one of valid slugs below
  created_at: string;           // ISO-8601: "2026-03-17T00:00:00Z"
}
```

## Valid category_slug values

| slug   | label  | icon |
|--------|--------|------|
| game   | Game   | 🎮   |
| tool   | Tool   | 🔧   |
| fun    | Fun    | 🎉   |
| app    | App    | 📱   |
| other  | Other  | ✨   |

## Full example

```ts
import type { AppMeta } from "@/lib/types";

export const meta: AppMeta = {
  name: "Pixel Clock",
  description: "A retro pixel-art clock that displays current time with a CRT effect.",
  author_name: "ThienDX",
  author_url: "https://github.com/thiendx-code-it",
  category_slug: "fun",
  created_at: "2026-03-17T00:00:00Z",
};
```

## Common mistakes

- `category_slug` must be lowercase, exact match — no plurals, no spaces
- `created_at` must be a full ISO string with `T` and `Z`
- Named export: `export const meta` (not `export default`)
- Import path must be `@/lib/types` (not relative)
