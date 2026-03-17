import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  categoryIcon?: string;
}

export function ProjectCard({ project, index, isBookmarked, onToggleBookmark, categoryIcon }: ProjectCardProps) {
  const { t } = useTranslation();
  return (
    <div
      className="glass rounded-xl p-5 transition-all duration-150 hover:border-primary/40 hover:glow-primary group animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-muted-foreground font-display font-bold text-sm">
            {index + 1}
          </span>
          <div className="min-w-0">
            <Link to={`/project/${project.id}`} className="block">
              <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {project.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span>{categoryIcon} {project.category_slug}</span>
              <span>{t("project.by")} {project.author_name}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => { e.preventDefault(); onToggleBookmark(project.id); }}
          >
            <Heart className={cn("h-4 w-4", isBookmarked && "fill-primary text-primary")} />
          </Button>
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          {project.source_url && (
            <a href={project.source_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Github className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
