import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Shuffle, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjects, useCategories } from "@/hooks/useProjects";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

const Index = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: projects = [], isLoading } = useProjects();
  const { data: categories = [] } = useCategories();
  const { toggle, isBookmarked } = useBookmarks();

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => (map[c.slug] = c.icon));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    let list = projects;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category_slug === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author_name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, activeCategory, search]);

  const pickRandom = () => {
    if (projects.length === 0) return;
    const random = projects[Math.floor(Math.random() * projects.length)];
    window.location.href = `/project/${random.id}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container max-w-3xl">
          {/* Terminal prompt */}
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm mb-4">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary">~</span>
            <span className="text-muted-foreground/60">$</span>
            <span>what did you build?</span>
            <span className="w-2 h-4 bg-primary/80 animate-pulse inline-block ml-0.5" />
          </div>

          <h1 className="font-mono text-5xl md:text-7xl font-bold leading-none">
            <span className="text-gradient">vibe.cerberus</span>
          </h1>

          <p className="mt-5 text-base text-muted-foreground max-w-lg font-sans leading-relaxed">
            {t("home.tagline")}
          </p>

          <div className="flex items-center gap-4 mt-7">
            <Link to="/submit">
              <Button
                className="gap-2 font-mono text-sm cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_20px_-2px_hsl(189_100%_50%/0.4)]"
              >
                {t("home.submitProject")} →
              </Button>
            </Link>
            <span className="font-mono text-xs text-muted-foreground/60 border border-border/50 px-2 py-1 rounded">
              {t("home.projectCount", { count: projects.length })}
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container max-w-3xl pb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-primary/60 select-none">&gt;</span>
            <Input
              placeholder={t("home.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-secondary/60 border-border/60 font-mono text-sm placeholder:text-muted-foreground/50 focus-visible:ring-primary/50 focus-visible:border-primary/40 transition-colors duration-200"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={pickRandom}
            title={t("home.shuffleTitle")}
            className="cursor-pointer border-border/60 hover:border-primary/40 hover:text-primary transition-colors duration-200"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        {/* Category / Vibe tags */}
        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "flex-shrink-0 px-3 py-1 rounded-full font-mono text-xs border transition-all duration-200 cursor-pointer",
              activeCategory === "all"
                ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_10px_-2px_hsl(189_100%_50%/0.3)]"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            {t("home.allCategories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                "flex-shrink-0 px-3 py-1 rounded-full font-mono text-xs border transition-all duration-200 cursor-pointer gap-1 inline-flex items-center",
                activeCategory === cat.slug
                  ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_10px_-2px_hsl(189_100%_50%/0.3)]"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Project Grid */}
      <section className="container max-w-5xl pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-lg p-5 h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground font-mono">
            <p className="text-sm text-primary/60">{"// no results"}</p>
            <p className="text-lg mt-2">{t("home.noProjects")}</p>
            <p className="text-sm mt-1 text-muted-foreground/60">{t("home.beFirst")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                isBookmarked={isBookmarked(project.id)}
                onToggleBookmark={toggle}
                categoryIcon={categoryMap[project.category_slug]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
