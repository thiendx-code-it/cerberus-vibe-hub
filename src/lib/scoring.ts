import type { Project } from "@/lib/types";

export interface ContributorRank {
  author_name: string;
  author_url: string | null;
  projectCount: number;
  projects: Project[];
}

export function rankContributors(projects: Project[]): ContributorRank[] {
  const map = new Map<string, ContributorRank>();

  for (const p of projects) {
    const key = p.author_name;
    if (!map.has(key)) {
      map.set(key, {
        author_name: p.author_name,
        author_url: p.author_url,
        projectCount: 0,
        projects: [],
      });
    }
    const entry = map.get(key)!;
    entry.projectCount += 1;
    entry.projects.push(p);
  }

  return [...map.values()].sort((a, b) => b.projectCount - a.projectCount);
}
