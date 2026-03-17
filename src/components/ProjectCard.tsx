import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Rocket, ExternalLink, Github } from "lucide-react";
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
      className="glass rounded-lg p-4 group animate-fade-in transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_20px_-4px_hsl(189_100%_50%/0.15)]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded font-mono font-bold text-xs text-muted-foreground/60 bg-secondary/60 border border-border/60">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <Link to={`/project/${project.id}`} className="block">
              <h3 className="font-mono font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                {project.name}
              </h3>
            </Link>
            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 font-sans leading-relaxed">
              {project.description}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground/70">
                {categoryIcon} {project.category_slug}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/50">
                {t("project.by")} {project.author_name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer hover:text-primary transition-colors duration-200"
            onClick={(e) => { e.preventDefault(); onToggleBookmark(project.id); }}
            aria-label="Bookmark"
          >
            <Heart className={cn("h-3.5 w-3.5", isBookmarked && "fill-primary text-primary")} />
          </Button>
          {project.has_local_app && (
            <Link to={`/apps/${project.id}`} onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer hover:text-primary transition-colors duration-200" aria-label="Launch app">
                <Rocket className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer hover:text-primary transition-colors duration-200" aria-label="View demo">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
          {project.source_url && (
            <a href={project.source_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer hover:text-primary transition-colors duration-200" aria-label="Source code">
                <Github className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
