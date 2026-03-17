import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, useCategories } from "@/hooks/useProjects";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ProjectCard } from "@/components/ProjectCard";

const Bookmarks = () => {
  const { t } = useTranslation();
  const { data: projects = [] } = useProjects();
  const { data: categories = [] } = useCategories();
  const { bookmarks, toggle, isBookmarked } = useBookmarks();

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => (map[c.slug] = c.icon));
    return map;
  }, [categories]);

  const bookmarkedProjects = useMemo(
    () => projects.filter((p) => bookmarks.includes(p.id)),
    [projects, bookmarks]
  );

  return (
    <div className="container py-8">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("bookmarks.backButton")}
        </Button>
      </Link>

      <h1 className="font-display text-2xl font-bold mb-6">{t("bookmarks.title")}</h1>

      {bookmarkedProjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <HeartOff className="h-12 w-12 mx-auto mb-4 opacity-40" />
          <p>{t("bookmarks.empty")}</p>
          <Link to="/"><Button variant="outline" className="mt-4">{t("bookmarks.explore")}</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarkedProjects.map((project, i) => (
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
    </div>
  );
};

export default Bookmarks;
