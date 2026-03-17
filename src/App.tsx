import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import Bookmarks from "./pages/Bookmarks";
import SubmitProject from "./pages/SubmitProject";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

// Auto-discover all embedded mini-apps at build time
const appComponents = import.meta.glob("./apps/*/index.tsx") as Record<
  string,
  () => Promise<{ default: React.ComponentType }>
>;

function AppRenderer() {
  const { slug } = useParams<{ slug: string }>();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    const key = `./apps/${slug}/index.tsx`;
    const loader = appComponents[key];
    if (!loader) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    loader()
      .then((m) => {
        setComponent(() => m.default);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading)
    return (
      <div className="container py-16 text-center text-muted-foreground">Loading…</div>
    );
  if (notFound || !Component) return <NotFound />;
  return <Component />;
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/apps/:slug" element={<AppRenderer />} />
        <Route path="/bookmarks" element={<Bookmarks />} />          <Route path="/leaderboard" element={<Leaderboard />} />        <Route path="/submit" element={<SubmitProject />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
