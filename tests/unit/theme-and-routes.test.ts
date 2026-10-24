import { describe, it, expect } from "vitest";
import {
  getFontPreset,
  themeCssVars,
  FONT_PRESETS,
  DEFAULT_FONT_PRESET,
  menus,
  menuRoutes,
  nextMenu,
  mailto,
  imgSrcset,
} from "../../src/data/site";
import { config } from "../../site.config";

describe("font presets", () => {
  it("returns the default preset for undefined", () => {
    expect(getFontPreset(undefined)).toBe(FONT_PRESETS[DEFAULT_FONT_PRESET]);
  });
  it("returns the default preset for an unknown name", () => {
    expect(getFontPreset("nope")).toBe(FONT_PRESETS[DEFAULT_FONT_PRESET]);
  });
  it("returns each named preset", () => {
    for (const name of Object.keys(FONT_PRESETS)) {
      expect(getFontPreset(name)).toBe(FONT_PRESETS[name]);
    }
  });
  it("every preset has serif/sans/mono stacks and self-hosted font files", () => {
    for (const preset of Object.values(FONT_PRESETS)) {
      expect(preset.serif).toMatch(/serif/);
      expect(preset.sans).toMatch(/sans-serif/);
      expect(preset.mono).toMatch(/monospace/);
      expect(preset.serifFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(preset.sansFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
      expect(preset.monoFile).toMatch(/^\/fonts\/[a-z0-9-]+\.woff2$/);
    }
  });
});

describe("themeCssVars", () => {
  const css = themeCssVars(config.theme);
  it("emits the configured colors", () => {
    expect(css).toContain(`--bg: ${config.theme.background};`);
    expect(css).toContain(`--surface: ${config.theme.surface};`);
    expect(css).toContain(`--ink: ${config.theme.ink};`);
    expect(css).toContain(`--deep: ${config.theme.deep};`);
    expect(css).toContain(`--accent: ${config.theme.accent};`);
    expect(css).toContain(`--deep-ink: ${config.theme.deepInk};`);
    expect(css).toContain(`--deep-text: ${config.theme.deepText};`);
  });
  it("emits the configured font stacks", () => {
    const preset = getFontPreset(config.theme.fonts);
    expect(css).toContain(`--serif: ${preset.serif};`);
    expect(css).toContain(`--sans: ${preset.sans};`);
    expect(css).toContain(`--mono: ${preset.mono};`);
  });
  it("is a single :root block", () => {
    expect(css.startsWith(":root {")).toBe(true);
    expect(css.trimEnd().endsWith("}")).toBe(true);
  });
});

describe("palette contrast (WCAG AA, computed from the shipped config)", () => {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  it("bone ink on the deep green ground passes AA for normal text", () => {
    expect(ratio(config.theme.ink, config.theme.background)).toBeGreaterThanOrEqual(4.5);
  });
  it("gold accent (prices, labels) on the dark ground passes AA", () => {
    expect(ratio(config.theme.accent, config.theme.background)).toBeGreaterThanOrEqual(4.5);
  });
  it("dark ink on the bone menu paper passes AA", () => {
    expect(ratio(config.theme.deepInk, config.theme.surface)).toBeGreaterThanOrEqual(4.5);
  });
  it("footer text on the near-black deep passes AA", () => {
    expect(ratio(config.theme.deepText, config.theme.deep)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("menu routes", () => {
  it("generates one route per menu, in config order", () => {
    const routes = menuRoutes();
    expect(routes).toHaveLength(config.menus.length);
    expect(routes.map((r) => r.params.slug)).toEqual(menus.map((p) => p.slug));
  });
  it("every route's next menu wraps around", () => {
    const routes = menuRoutes();
    routes.forEach((r, i) => {
      expect(r.props.menu).toBe(menus[i]);
      expect(r.props.next).toBe(menus[(i + 1) % menus.length]);
    });
    expect(routes[routes.length - 1].props.next).toBe(menus[0]);
  });
  it("all slugs are unique", () => {
    expect(new Set(menus.map((p) => p.slug)).size).toBe(menus.length);
  });
  it("no menu slug collides with a fixed page route", () => {
    const fixed = ["menus", "story", "visit"];
    for (const p of menus) expect(fixed).not.toContain(p.slug);
  });
});

describe("nextMenu", () => {
  it("returns the following menu", () => {
    expect(nextMenu(menus[0].slug)).toBe(menus[1]);
  });
  it("wraps from last to first", () => {
    expect(nextMenu(menus[menus.length - 1].slug)).toBe(menus[0]);
  });
  it("throws for an unknown slug", () => {
    expect(() => nextMenu("no-such-menu")).toThrow(/Unknown menu slug/);
  });
});

describe("mailto", () => {
  it("prefixes an email address", () => {
    expect(mailto("a@b.co")).toBe("mailto:a@b.co");
  });
});

describe("imgSrcset", () => {
  it("includes existing hero variants plus the original, sorted by width", () => {
    const srcset = imgSrcset("/images/hero.jpg", [640, 960, 1440], 1920);
    expect(srcset).toBe(
      "/images/hero-640.jpg 640w, /images/hero-960.jpg 960w, /images/hero-1440.jpg 1440w, /images/hero.jpg 1920w"
    );
  });
  it("includes menu variants at their real widths", () => {
    const srcset = imgSrcset("/images/menu-tasting.jpg", [480, 960], 904);
    expect(srcset).toBe(
      "/images/menu-tasting-480.jpg 480w, /images/menu-tasting.jpg 904w, /images/menu-tasting-960.jpg 960w"
    );
  });
  it("skips variants that don't exist on disk", () => {
    expect(imgSrcset("/images/hero.jpg", [123], 1920)).toBeUndefined();
  });
  it("returns undefined for an image with no variants at all", () => {
    expect(imgSrcset("/images/story.jpg", [999], 1280)).toBeUndefined();
  });
});
