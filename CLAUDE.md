# vibe.cerberus — Claude Rules

## Project Rules (MANDATORY)

### 1. Scope — ONLY work inside `src/apps/{slug}/`

When a developer asks to submit, add, or build a new app:
- **ONLY create or edit files inside `src/apps/{slug}/`**
- **NEVER touch** any other project file (components, pages, hooks, config, etc.)
- If unsure, ask — do not modify files outside the apps folder

### 2. No Database

This hub is **100% db-less**.
- Do NOT add Supabase queries, REST API calls, or any database access
- Do NOT add new backend routes or API files
- Projects are discovered automatically via `import.meta.glob("../apps/*/meta.ts")` in `src/data/projects.ts`

### 3. Submission Pattern

Every new app requires **only these files**:

```
src/apps/{slug}/
├── meta.ts        ← required (AppMeta export)
└── index.tsx      ← optional (embedded mini-app)
```

Use the `vibe-submit` skill for full spec and templates.

### 4. Submit via Pull Request

- Never push directly to `main`
- Create a feature branch: `feat/{slug}`
- Open a GitHub PR for review

## Available Skills

- **`vibe-submit`** — Full guide for submitting a new app (AppMeta spec, index.tsx template, checklist)
