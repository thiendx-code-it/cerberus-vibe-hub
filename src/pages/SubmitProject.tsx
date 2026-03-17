import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, GitBranch, GitPullRequest, FolderPlus, FileCode2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const REPO_URL = "https://github.com/thiendx-code-it/cerberus-vibe-hub";

type Pkg = "npm" | "pnpm";

const install = (pkg: Pkg) => (pkg === "pnpm" ? "pnpm install" : "npm install");
const run = (pkg: Pkg, script: string) =>
  pkg === "pnpm" ? `pnpm ${script}` : `npm run ${script}`;

const getSteps = (pkg: Pkg) => [
  {
    icon: GitBranch,
    titleKey: "submit.steps.fork.title",
    descKey: "submit.steps.fork.desc",
    code: `git clone ${REPO_URL}.git\ncd cerberus-vibe-hub\n${install(pkg)}`,
  },
  {
    icon: FolderPlus,
    titleKey: "submit.steps.folder.title",
    descKey: "submit.steps.folder.desc",
    code: `src/apps/your-app-slug/\n├── meta.ts      # Project info (required)\n└── index.tsx    # Mini-app component (optional)`,
  },
  {
    icon: FileCode2,
    titleKey: "submit.steps.meta.title",
    descKey: "submit.steps.meta.desc",
    code: `import type { AppMeta } from "@/lib/types";\n\nexport const meta: AppMeta = {\n  name: "Your App Name",\n  description: "What does your app do?",\n  author_name: "Your Name",\n  author_url: "https://github.com/yourname", // optional\n  category_slug: "fun", // game | tool | fun | app | other\n  created_at: "${new Date().toISOString().slice(0, 10)}T00:00:00Z",\n};`,
  },
  {
    icon: Code2,
    titleKey: "submit.steps.app.title",
    descKey: "submit.steps.app.desc",
    code: `# Scaffold a new app interactively:\n${run(pkg, "create:page")}\n\n# Or create the files manually:\n// src/apps/your-app-slug/index.tsx\nexport default function YourApp() {\n  return <div>Your App 🚀</div>;\n}`,
  },
  {
    icon: GitPullRequest,
    titleKey: "submit.steps.pr.title",
    descKey: "submit.steps.pr.desc",
    code: `git checkout -b feat/your-app-slug\ngit add .\ngit commit -m "feat: add your-app-slug"\ngit push origin feat/your-app-slug\n# Then open a Pull Request on GitHub!`,
  },
];

const SubmitProject = () => {
  const { t } = useTranslation();
  const [pkg, setPkg] = useState<Pkg>("npm");
  const steps = getSteps(pkg);

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-6 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> {t("submit.backButton")}
        </Button>
      </Link>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">{t("submit.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("submit.subtitle")}</p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 flex-shrink-0">
          {(["npm", "pnpm"] as Pkg[]).map((p) => (
            <button
              key={p}
              onClick={() => setPkg(p)}
              className={[
                "px-3 py-1 rounded-md text-xs font-semibold transition-colors",
                pkg === p
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="glass rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <step.icon className="h-4 w-4" />
              </div>
              <h3 className="font-display font-semibold">{t(step.titleKey)}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t(step.descKey)}</p>
            <pre className="bg-secondary rounded-lg p-4 text-xs overflow-x-auto text-foreground/80 leading-relaxed">
              <code>{step.code}</code>
            </pre>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
          <Button className="gap-2">
            <GitPullRequest className="h-4 w-4" />
            {t("submit.openRepo")}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default SubmitProject;
