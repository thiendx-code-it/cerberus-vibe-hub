import type { Project, AppMeta } from "@/lib/types";

// Auto-discover all app meta files at build time via Vite glob
const metaModules = import.meta.glob("../apps/*/meta.ts", {
  eager: true,
}) as Record<string, { meta: AppMeta }>;

// Discover which apps have a local index.tsx (lazy — keys are available immediately)
const appModules = import.meta.glob("../apps/*/index.tsx");

export const projects: Project[] = Object.entries(metaModules)
  .map(([path, module]) => {
    const slug = path.split("/").slice(-2)[0];
    const hasLocalApp = `../apps/${slug}/index.tsx` in appModules;
    return {
      author_url: null,
      has_local_app: hasLocalApp,
      ...module.meta,
      id: slug,
    } satisfies Project;
  })
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
