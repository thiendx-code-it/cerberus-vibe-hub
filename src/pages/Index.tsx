import { useState, useMemo } from "react";
import { Search, Shuffle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjects, useCategories } from "@/hooks/useProjects";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

const Index = () => {
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
      <section className="py-16 md:py-24 text-center">
        <div className="container">
          <h1 className="font-display text-4xl md:text-6xl font-bold">
            <span className="text-gradient">vibe.cerberus</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Nơi chia sẻ những dự án sáng tạo từ cộng đồng Cerberus Team 🔥
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link to="/submit">
              <Button className="gap-2">Submit Project</Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              {projects.length} dự án
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container pb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm project, tác giả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={pickRandom} title="Ngẫu nhiên">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Link to="/bookmarks">
              <Button variant="outline" size="icon" title="Yêu thích">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="flex-shrink-0"
          >
            Tất cả
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.slug}
              variant={activeCategory === cat.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.slug)}
              className="flex-shrink-0 gap-1"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Button>
          ))}
        </div>
      </section>

      {/* Project Grid */}
      <section className="container pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Không tìm thấy project nào 😢</p>
            <p className="text-sm mt-2">Hãy là người đầu tiên submit!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
