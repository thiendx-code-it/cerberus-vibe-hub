import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Flame, Trophy, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { to: "/", label: t("nav.feed"), icon: Flame },
    { to: "/leaderboard", label: t("nav.leaderboard"), icon: Trophy },
    { to: "/bookmarks", label: t("nav.favorites"), icon: Heart },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <span className="font-mono text-sm text-primary/60 group-hover:text-primary transition-colors duration-200">~/</span>
          <span className="font-mono text-base font-bold text-gradient">vibe.cerberus</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 text-sm cursor-pointer transition-colors duration-200",
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-3.5 w-3.5", isActive && "text-primary")} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}

          <Link to="/submit">
            <Button
              size="sm"
              className="gap-2 ml-2 cursor-pointer font-mono text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_16px_-2px_hsl(189_100%_50%/0.5)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("nav.submit")}</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="ml-1 font-mono text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-transparent transition-colors duration-200 cursor-pointer w-9 px-0"
          >
            {i18n.language === "vi" ? "EN" : "VI"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
