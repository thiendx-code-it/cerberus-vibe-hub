import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelloWorldApp() {
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Button>
      </Link>

      <div className="glass rounded-xl p-12 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-5xl">
            👋
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold text-gradient mb-4">Hello World!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to <span className="text-foreground font-semibold">vibe.cerberus</span> — a
          community hub for creative mini-apps built by the Cerberus Team.
        </p>

        <div className="bg-secondary rounded-lg p-4 text-left text-sm font-mono text-muted-foreground mb-8">
          <span className="text-primary">// </span>Create your own app:
          <br />
          <span className="text-primary">mkdir</span> src/apps/your-app-name
          <br />
          <span className="text-primary">touch</span> src/apps/your-app-name/meta.ts
          <br />
          <span className="text-primary">touch</span> src/apps/your-app-name/index.tsx
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Your app will appear on the hub automatically!</span>
        </div>
      </div>
    </div>
  );
}
