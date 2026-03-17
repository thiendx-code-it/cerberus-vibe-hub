import { projects } from "@/data/projects";
import { categories } from "@/data/categories";
import type { Project, Category } from "@/lib/types";

export function useProjects() {
  return { data: projects as Project[], isLoading: false };
}

export function useCategories() {
  return { data: categories as Category[], isLoading: false };
}

export function useProject(id: string) {
  const project = projects.find((p) => p.id === id) ?? null;
  return { data: project as Project | null, isLoading: false };
}
