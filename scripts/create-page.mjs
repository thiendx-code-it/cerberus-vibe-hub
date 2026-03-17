#!/usr/bin/env node
/**
 * create-page – Interactive scaffold for a new app under src/apps/<slug>/
 *
 * Usage:
 *   npm run create:page [slug]
 *   node scripts/create-page.mjs [slug]
 */

import { createInterface } from "readline";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPS_DIR = join(ROOT, "src", "apps");

const CATEGORIES = ["game", "tool", "fun", "app", "other"];
const TODAY = new Date().toISOString().slice(0, 10);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function generateMeta({ name, description, author_name, author_url, category_slug }) {
  return `import type { AppMeta } from "@/lib/types";

export const meta: AppMeta = {
  name: ${JSON.stringify(name)},
  description: ${JSON.stringify(description)},
  author_name: ${JSON.stringify(author_name)},
  author_url: ${author_url ? JSON.stringify(author_url) : "null"},
  category_slug: ${JSON.stringify(category_slug)},
  created_at: "${TODAY}T00:00:00Z",
};
`;
}

function generateIndex({ name, slug }) {
  const componentName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

  return `import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ${componentName}App() {
  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Link to="/">
        <Button variant="ghost" size="sm" className="gap-2 mb-8 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Button>
      </Link>

      <div className="glass rounded-xl p-8 text-center">
        <h1 className="font-display text-3xl font-bold text-gradient mb-4">${name} 🚀</h1>
        <p className="text-muted-foreground">Your app goes here. Happy building!</p>
      </div>
    </div>
  );
}
`;
}

async function main() {
  console.log("\n🔥 Cerberus Vibe Hub – Create New App\n");

  // Slug: from CLI arg or prompt
  let slug = process.argv[2] ? toSlug(process.argv[2]) : "";
  if (!slug) {
    slug = toSlug(await ask("App slug (e.g. my-cool-app): "));
  }
  if (!slug) {
    console.error("❌ Slug is required.");
    process.exit(1);
  }

  const appDir = join(APPS_DIR, slug);
  if (existsSync(appDir)) {
    console.error(`❌ App "${slug}" already exists at src/apps/${slug}/`);
    process.exit(1);
  }

  const name = (await ask("Display name: ")) || slug;
  const description = (await ask("Description: ")) || `${name} – a mini app for Cerberus Vibe Hub.`;
  const author_name = (await ask("Author name: ")) || "Anonymous";
  const author_url = await ask("Author URL (GitHub, website – leave blank to skip): ");

  console.log(`\nCategories: ${CATEGORIES.join(" | ")}`);
  let category_slug = (await ask("Category [fun]: ")).toLowerCase();
  if (!CATEGORIES.includes(category_slug)) category_slug = "fun";

  const wantIndex = (await ask("Include index.tsx starter template? [Y/n]: ")).toLowerCase();
  const includeIndex = wantIndex !== "n";

  rl.close();

  // Write files
  mkdirSync(appDir, { recursive: true });

  const meta = generateMeta({ name, description, author_name, author_url, category_slug });
  writeFileSync(join(appDir, "meta.ts"), meta, "utf8");

  if (includeIndex) {
    const index = generateIndex({ name, slug });
    writeFileSync(join(appDir, "index.tsx"), index, "utf8");
  }

  console.log(`\n✅ Created src/apps/${slug}/`);
  console.log(`   📄 meta.ts`);
  if (includeIndex) console.log(`   ⚛️  index.tsx`);
  console.log(`\n🌐 Your app will appear on the hub automatically!`);
  if (includeIndex) console.log(`🚀 Launch at: http://vibe.cerberuslab.pro/apps/${slug}`);
  console.log(`\nNext steps:`);
  console.log(`  1. git checkout -b feat/${slug}`);
  console.log(`  2. Edit src/apps/${slug}/index.tsx`);
  console.log(`  3. git add . && git commit -m "feat: add ${slug}"`);
  console.log(`  4. Open a Pull Request 🎉\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

