import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { rankContributors } from "@/lib/scoring";

const RANK_ICONS = [
  <Trophy key={1} className="h-5 w-5 text-yellow-400" />,
  <Medal key={2} className="h-5 w-5 text-slate-300" />,
  <Medal key={3} className="h-5 w-5 text-amber-600" />,
];

export default function Leaderboard() {
  const { t } = useTranslation();
  const { data: projects = [] } = useProjects();

  const contributors = useMemo(() => rankContributors(projects), [projects]);

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <h1 className="font-display text-3xl font-bold text-gradient">
            {t("leaderboard.title")}
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">{t("leaderboard.subtitle")}</p>
      </div>

      {contributors.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>{t("leaderboard.empty")}</p>
          <Link to="/submit">
            <Button variant="outline" className="mt-4">{t("leaderboard.submit")}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contributors.map((c, i) => (
            <div key={c.author_name} className="glass rounded-xl p-4 flex items-center gap-4">
              {/* Rank */}
              <div className="w-8 flex-shrink-0 flex items-center justify-center">
                {i < 3 ? (
                  RANK_ICONS[i]
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
                {c.author_name.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                {c.author_url ? (
                  <a
                    href={c.author_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-semibold hover:text-primary transition-colors truncate block"
                  >
                    {c.author_name}
                  </a>
                ) : (
                  <span className="font-display font-semibold truncate block">{c.author_name}</span>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.projects.map((p) => p.name).join(", ")}
                </p>
              </div>

              {/* Count badge */}
              <div className="flex-shrink-0 text-right">
                <span className="font-display text-2xl font-bold text-primary leading-none">
                  {c.projectCount}
                </span>
                <p className="text-xs text-muted-foreground">{t("leaderboard.projects")}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
