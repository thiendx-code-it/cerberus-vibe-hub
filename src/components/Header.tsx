import { Link, useLocation } from "react-router-dom";
import { Heart, Plus, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Feed", icon: Flame },
    { to: "/bookmarks", label: "Yêu thích", icon: Heart },
  ];

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
              <span className="hidden sm:inline">Submit</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
