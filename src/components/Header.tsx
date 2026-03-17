import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { to: "/", label: t("nav.feed"), icon: Flame },
    { to: "/bookmarks", label: t("nav.favorites"), icon: Heart },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi");
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-gradient">vibe.cerberus</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 text-muted-foreground hover:text-foreground",
                  location.pathname === item.to && "text-foreground bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
          <Link to="/submit">
            <Button size="sm" className="gap-2 ml-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.submit")}</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="ml-1 text-xs font-semibold text-muted-foreground hover:text-foreground w-10"
          >
            {i18n.language === "vi" ? t("language.en") : t("language.vi")}
          </Button>
        </nav>
      </div>
    </header>
  );
}
