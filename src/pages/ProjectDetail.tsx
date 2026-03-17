import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Github, Heart, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject, useCategories } from "@/hooks/useProjects";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";

const REPO_URL = "https://github.com/thiendx-code-it/cerberus-vibe-hub";

const ProjectDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useProject(id!);
  const { data: categories = [] } = useCategories();
  const { toggle, isBookmarked } = useBookmarks();

  if (isLoading) {
    return (
      <div className="container py-16">
        <div className="glass rounded-xl p-8 max-w-2xl mx-auto h-64 animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">{t("project.notFound")}</p>
        <Link to="/"><Button variant="outline" className="mt-4">{t("project.backButton")}</Button></Link>
      </div>
    );
  }

  const category = categories.find((c) => c.slug === project.category_slug);

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("project.backButton")}
        </Button>
      </Link>

      <div className="glass rounded-xl p-6 md:p-8">
        {project.thumbnail_url && (
          <img
            src={project.thumbnail_url}
            alt={project.name}
            className="w-full h-48 md:h-64 object-cover rounded-lg mb-6"
            loading="lazy"
          />
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              {category && <span>{category.icon} {category.name}</span>}
              <span>
                {t("project.by")}{" "}
                {project.author_url ? (
                  <a href={project.author_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {project.author_name}
                  </a>
                ) : (
                  project.author_name
                )}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggle(project.id)}
          >
            <Heart className={cn("h-4 w-4", isBookmarked(project.id) && "fill-primary text-primary")} />
          </Button>
        </div>

        <p className="mt-6 text-foreground/90 leading-relaxed whitespace-pre-wrap">{project.description}</p>

        <div className="flex flex-wrap gap-3 mt-8">
          {project.has_local_app && (
            <Link to={`/apps/${project.id}`}>
              <Button className="gap-2">
                <Rocket className="h-4 w-4" /> {t("project.launchApp")}
              </Button>
            </Link>
          )}
          <a
            href={`${REPO_URL}/tree/main/src/apps/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" /> {t("project.sourceCode")}
            </Button>
          </a>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          {t("project.createdAt", { date: new Date(project.created_at).toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US") })}
        </p>
      </div>
    </div>
  );
};

export default ProjectDetail;
