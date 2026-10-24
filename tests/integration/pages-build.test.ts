import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

/**
 * GitHub Pages preview build: the site must be fully functional when
 * served from a subpath (BASE=/velvet-hour), because that is how
 * ctrimm.github.io/velvet-hour serves it. Builds into dist-pages with
 * an intentionally clean environment — inherited SITE/BASE in a dirty
 * shell can silently swallow the explicit ones.
 */
const DIST = join(process.cwd(), "dist-pages");

beforeAll(() => {
  const env: Record<string, string> = {
    PATH: process.env.PATH ?? "",
    HOME: process.env.HOME ?? "",
    SITE: "https://ctrimm.github.io",
    BASE: "/velvet-hour",
  };
  const r = spawnSync("npx", ["astro", "build", "--outDir", "dist-pages"], {
    cwd: process.cwd(),
    encoding: "utf-8",
    timeout: 180_000,
    env,
  });
  if (r.status !== 0) {
    throw new Error(`pages build failed:\n${r.stdout}\n${r.stderr}`);
  }
}, 200_000);

describe("GitHub Pages subpath build", () => {
  const home = () => readFileSync(join(DIST, "index.html"), "utf-8");

  it("emits the core pages and menu detail pages", () => {
    for (const p of [
      "index.html",
      "menus/index.html",
      "story/index.html",
      "visit/index.html",
      "the-tasting-menu/index.html",
      "sweet-finishes/index.html",
      "sitemap.xml",
      "llms.txt",
    ]) {
      expect(existsSync(join(DIST, p)), p).toBe(true);
    }
  });
  it("prefixes nav links with the base path", () => {
    const h = home();
    expect(h).toContain('href="/velvet-hour/menus"');
    expect(h).toContain('href="/velvet-hour/story"');
    expect(h).toContain('href="/velvet-hour/visit"');
    expect(h).toContain('href="/velvet-hour/"');
  });
  it("prefixes the hero image and its srcset with the base path", () => {
    const h = home();
    expect(h).toContain('src="/velvet-hour/images/hero.jpg"');
    expect(h).toContain("/velvet-hour/images/hero-960.jpg 960w");
  });
  it("prefixes font URLs and the favicon with the base path", () => {
    const h = home();
    expect(h).toContain('url("/velvet-hour/fonts/bodoni-moda-normal.woff2")');
    expect(h).toContain('href="/velvet-hour/favicon.svg"');
  });
  it("menu detail pages prefix their next-menu link", () => {
    const h = readFileSync(join(DIST, "the-tasting-menu", "index.html"), "utf-8");
    expect(h).toContain('href="/velvet-hour/a-la-carte"');
  });
});
