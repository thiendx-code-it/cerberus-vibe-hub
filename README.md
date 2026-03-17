# vibe.cerberus 🔥

> Nơi chia sẻ những dự án sáng tạo từ cộng đồng **Cerberus Team**.

A community-driven project showcase platform where members of the Cerberus Team can share, discover, and bookmark their vibe-coded creations.

---

## ✨ Features

- **Project Feed** — Browse all community projects sorted by newest first
- **Search & Filter** — Search by name, description, or author; filter by category
- **Random Discovery** — Hit the shuffle button to explore a random project
- **Project Detail** — Full project page with demo link, source code, author info, and category
- **Submit Project** — Community members can submit their own projects for review
- **Bookmarks** — Save favourite projects locally (persisted in `localStorage`)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase (PostgreSQL) |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Routing | React Router v6 |
| Fonts | Space Grotesk + Inter (Google Fonts) |
| Testing | Vitest + Testing Library |

---

## 🗄 Database Schema

### `projects`

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Project name |
| `description` | text | Project description |
| `author_name` | text | Author display name |
| `author_url` | text \| null | Author profile link |
| `category_slug` | text | FK → categories.slug |
| `demo_url` | text \| null | Live demo URL |
| `source_url` | text \| null | Source code URL (e.g. GitHub) |
| `thumbnail_url` | text \| null | Preview image URL |
| `is_approved` | boolean | Moderation flag (default false) |
| `created_at` | timestamptz | Auto-set on insert |
| `updated_at` | timestamptz | Auto-updated |

### `categories`

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | text | Display name |
| `slug` | text | Unique identifier |
| `icon` | text | Emoji icon |
| `sort_order` | integer | Display order |
| `created_at` | timestamptz | Auto-set on insert |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Supabase](https://supabase.com) project

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd cerberus-vibe-hub

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file at the project root:

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build        # Production build
npm run preview      # Preview production build locally
```

### Testing

```bash
npm run test         # Run tests once
npm run test:watch   # Watch mode
```

---

## 📁 Project Structure

```
src/
├── components/       # Shared UI components (Header, ProjectCard, NavLink)
│   └── ui/           # shadcn/ui primitives
├── hooks/            # Custom React hooks (useProjects, useBookmarks)
├── integrations/
│   └── supabase/     # Supabase client & generated types
├── lib/              # Utilities and shared types
├── pages/            # Route-level page components
│   ├── Index.tsx         # Home / project feed
│   ├── ProjectDetail.tsx # Single project view
│   ├── Bookmarks.tsx     # Saved projects
│   ├── SubmitProject.tsx # Submission form
│   └── NotFound.tsx      # 404
└── test/             # Test setup and example specs
```

---

## 🎨 Design

- **Color scheme:** Dark mode with a crimson/red primary (`hsl(347 77% 50%)`)
- **Effect:** Glassmorphism cards with backdrop blur
- **Typography:** Space Grotesk (headings) + Inter (body)

---

## 👤 Author

**ThienDX** — Cerberus Team

---

## 📄 License

MIT
