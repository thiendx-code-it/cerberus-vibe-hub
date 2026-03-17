import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "1", name: "Game", slug: "game", icon: "🎮", sort_order: 1, created_at: "2025-01-01T00:00:00Z" },
  { id: "2", name: "Tool", slug: "tool", icon: "🔧", sort_order: 2, created_at: "2025-01-01T00:00:00Z" },
  { id: "3", name: "Fun", slug: "fun", icon: "🎉", sort_order: 3, created_at: "2025-01-01T00:00:00Z" },
  { id: "4", name: "App", slug: "app", icon: "📱", sort_order: 4, created_at: "2025-01-01T00:00:00Z" },
  { id: "5", name: "Other", slug: "other", icon: "✨", sort_order: 5, created_at: "2025-01-01T00:00:00Z" },
];
