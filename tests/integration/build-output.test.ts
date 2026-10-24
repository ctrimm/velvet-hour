import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { config } from "../../site.config";
import { slugify } from "../../src/data/site";

const DIST = join(process.cwd(), "dist");
const slugs = config.menus.map((p) => p.slug ?? slugify(p.title));

/** Astro HTML-escapes text (& → &amp;, ' → &#39;); decode so assertions
 *  can compare against the plain-language config values. */
const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function html(path: string): string {
  const file = join(DIST, path);
  expect(existsSync(file), `dist/${path} should exist`).toBe(true);
  return decode(readFileSync(file, "utf-8"));
}

beforeAll(() => {
  const r = spawnSync("npm", ["run", "build"], {
    cwd: process.cwd(),
    encoding: "utf-8",
    timeout: 180_000,
  });
  if (r.status !== 0) {
    throw new Error(`build failed:\n${r.stdout}\n${r.stderr}`);
  }
}, 200_000);

describe("pages are emitted", () => {
  it.each(["index.html", "menus/index.html", "story/index.html", "visit/index.html"])(
    "dist has %s",
    (page) => {
      expect(existsSync(join(DIST, page))).toBe(true);
    }
  );
  it("emits one page per menu slug plus sitemap, llms.txt, favicon", () => {
    for (const slug of slugs) {
      expect(existsSync(join(DIST, slug, "index.html")), slug).toBe(true);
    }
    expect(existsSync(join(DIST, "sitemap.xml"))).toBe(true);
    expect(existsSync(join(DIST, "llms.txt"))).toBe(true);
    expect(existsSync(join(DIST, "favicon.svg"))).toBe(true);
  });
  it("emits images and fonts into dist", () => {
    const images = readdirSync(join(DIST, "images")).filter((f) => f.endsWith(".jpg"));
    expect(images.length).toBeGreaterThanOrEqual(10);
    const fonts = readdirSync(join(DIST, "fonts")).filter((f) => f.endsWith(".woff2"));
    expect(fonts.length).toBeGreaterThanOrEqual(7);
  });
});

describe("home page output", () => {
  const home = () => html("index.html");
  it("shows restaurant name, hero image and email", () => {
    const h = home();
    expect(h).toContain(config.identity.name);
    expect(h).toContain(config.identity.email);
    expect(h).toMatch(/<img[^>]+src="\/images\/hero\.jpg"/);
    expect(h).toContain(config.home.heroImageAlt);
  });
  it("renders the hero headline lines with an italic word", () => {
    const h = home();
    const textOnly = h.replace(/<[^>]+>/g, "");
    for (const line of config.home.headline) {
      expect(textOnly).toContain(line.replaceAll("*", ""));
    }
    expect(h).toMatch(/<em>[^<]+<\/em>/);
  });
  it("h1 renders the configured headline (the site title is a link, not the h1)", () => {
    const h = home();
    const h1 = (h.match(/<h1 class="hero-headline">([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(
      /<[^>]+>/g,
      ""
    );
    for (const line of config.home.headline) {
      expect(h1).toContain(line.replaceAll("*", ""));
    }
  });
  it("renders the manifesto and stats from the config", () => {
    const h = home();
    expect(h).toContain(config.home.manifesto[0].slice(0, 40));
    for (const s of config.home.stats) {
      expect(h).toContain(s.value);
      expect(h).toContain(s.label);
    }
  });
  it("renders every service title as an index row linking to the menus page", () => {
    const h = home();
    for (const s of config.services) {
      expect(h).toContain(s.title);
    }
    expect(h).toContain('href="/menus"');
  });
  it("features the first three menus with photos, prices and links", () => {
    const h = home();
    for (const m of config.menus.slice(0, 3)) {
      expect(h).toContain(m.title);
      expect(h).toContain(m.price);
      expect(h).toContain(`href="/${m.slug ?? slugify(m.title)}"`);
      expect(h).toContain(m.imageAlt);
    }
  });
  it("does not feature the fourth menu (home shows three)", () => {
    if (config.menus.length > 3) {
      const fourth = config.menus[3];
      const h = home();
      expect(h).not.toContain(`href="/${fourth.slug ?? slugify(fourth.title)}"`);
    }
  });
  it("renders the evening steps and the press quotes", () => {
    const h = home();
    for (const p of config.process) {
      expect(h).toContain(p.title);
      expect(h).toContain(p.step);
    }
    expect(h).toContain(config.press[0].quote);
    expect(h).toContain(config.press[0].source);
  });
});

describe("site chrome (header nav + footer)", () => {
  it("every top page has the primary nav and a footer with the email", () => {
    for (const page of ["index.html", "menus/index.html", "story/index.html", "visit/index.html"]) {
      const h = html(page);
      expect(h, page).toContain('aria-label="Primary"');
      expect(h, page).toContain('href="/menus"');
      expect(h, page).toContain('href="/story"');
      expect(h, page).toContain('href="/visit"');
      expect(h, page).toContain(`mailto:${config.identity.email}`);
    }
  });
  it("JSON-LD identifies the business as a Restaurant", () => {
    const h = html("index.html");
    expect(h).toContain('"@type":"Restaurant"');
    expect(h).toContain(`"name":"${config.identity.name}"`);
    expect(h).toContain('"servesCuisine"');
  });
  it("footer shows name, role, location and founded year", () => {
    const h = html("index.html");
    expect(h).toContain(config.identity.location);
    expect(h).toContain(config.identity.founded);
  });
});

describe("menus page output", () => {
  it("lists every menu with its price, note and photo", () => {
    const h = html("menus/index.html");
    for (const m of config.menus) {
      expect(h).toContain(m.title);
      expect(h).toContain(m.price);
      expect(h).toContain(m.note);
      expect(h).toContain(m.imageAlt);
      expect(h).toContain(`href="/${m.slug ?? slugify(m.title)}"`);
    }
  });
  it("shows the service details with items as chips", () => {
    const h = html("menus/index.html");
    for (const s of config.services) {
      expect(h).toContain(s.summary.slice(0, 30));
      for (const item of s.items) {
        expect(h).toContain(item);
      }
    }
  });
});

describe("menu detail pages", () => {
  it.each(config.menus.map((m) => [m.title, m.slug ?? slugify(m.title)] as const))(
    "menu page: %s shows price, courses and reserve CTA",
    (_title, slug) => {
      const h = html(join(slug, "index.html"));
      const menu = config.menus.find((m) => (m.slug ?? slugify(m.title)) === slug)!;
      expect(h).toContain(menu.price);
      expect(h).toContain(menu.note);
      expect(h).toContain(menu.summary.slice(0, 40));
      for (const c of menu.courses) {
        expect(h).toContain(c.name);
        expect(h).toContain(c.description);
      }
      expect(h).toContain('href="/visit"');
    }
  );
  it("first menu page links onward to the second menu", () => {
    const h = html(join(slugs[0], "index.html"));
    expect(h).toContain(`href="/${slugs[1]}"`);
  });
});

describe("story page output", () => {
  it("shows the story image, heading, paragraphs and principles", () => {
    const h = html("story/index.html");
    expect(h).toContain(config.story.heading);
    expect(h).toContain(config.story.imageAlt);
    for (const p of config.story.paragraphs) {
      expect(h).toContain(p.slice(0, 40));
    }
    for (const pr of config.story.principles) {
      expect(h).toContain(pr.title);
      expect(h).toContain(pr.text.slice(0, 30));
    }
    expect(h).toContain(config.story.availability);
  });
});

describe("visit page output", () => {
  it("shows the room photo, address, hours, notes and email", () => {
    const h = html("visit/index.html");
    expect(h).toContain(config.visit.heading);
    expect(h).toContain(config.visit.imageAlt);
    for (const line of config.visit.address) {
      expect(h).toContain(line);
    }
    for (const hr of config.visit.hours) {
      expect(h).toContain(hr.days);
      expect(h).toContain(hr.time);
    }
    for (const n of config.visit.notes) {
      expect(h).toContain(n);
    }
    expect(h).toContain(config.identity.email);
    expect(h).toContain('class="hours-row"');
  });
});

describe("AI discoverability artifacts", () => {
  it("llms.txt names the business, pages, menus and reservation email", () => {
    const llms = readFileSync(join(DIST, "llms.txt"), "utf-8");
    expect(llms).toContain(`# ${config.identity.name}`);
    expect(llms).toContain(config.identity.email);
    for (const m of config.menus) {
      expect(llms).toContain(m.title);
    }
    for (const s of config.services) {
      expect(llms).toContain(s.title);
    }
    expect(llms).toContain("/menus");
  });
  it("sitemap lists the pages and every menu slug", () => {
    const sitemap = readFileSync(join(DIST, "sitemap.xml"), "utf-8");
    for (const path of ["/", "/menus", "/story", "/visit"]) {
      expect(sitemap).toContain(path);
    }
    for (const slug of slugs) {
      expect(sitemap).toContain(`/${slug}`);
    }
  });
  it("homepage meta description and Open Graph tags are present", () => {
    const h = html("index.html");
    expect(h).toMatch(/<meta name="description" content="[^"]{40,}"/);
    expect(h).toContain('property="og:title"');
    expect(h).toContain('property="og:image"');
  });
});
