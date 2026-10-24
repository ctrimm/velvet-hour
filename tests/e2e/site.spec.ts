import { test, expect } from "@playwright/test";
import { config } from "../../site.config";
import { slugify } from "../../src/data/site";

const slugs = config.menus.map((m) => m.slug ?? slugify(m.title));

test.describe("home page", () => {
  test("hero shows the headline lines and the hero image", async ({ page }) => {
    await page.goto("/");
    for (const line of config.home.headline) {
      await expect(page.locator(".hero-headline")).toContainText(line.replaceAll("*", ""));
    }
    await expect(page.locator(".hero-headline em")).toHaveCount(1);
    const heroImg = page.locator(".hero-photo img");
    await expect(heroImg).toHaveAttribute("alt", config.home.heroImageAlt);
    await expect(heroImg).toHaveAttribute("src", /hero\.jpg/);
  });
  test("manifesto, stats, experiences and featured menus all render", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".manifesto p").first()).toContainText(config.home.manifesto[0].slice(0, 30));
    await expect(page.locator(".stat")).toHaveCount(config.home.stats.length);
    await expect(page.locator(".service-rows li")).toHaveCount(config.services.length);
    await expect(page.locator(".feature-row")).toHaveCount(3);
    await expect(page.locator(".process-step")).toHaveCount(config.process.length);
    await expect(page.locator(".press-row")).toHaveCount(config.press.length);
  });
  test("clicking a service row goes to the menus page", async ({ page }) => {
    await page.goto("/");
    await page.locator(".service-rows a").first().click();
    await expect(page).toHaveURL(/\/menus$/);
    await expect(page.locator("h1")).toHaveText("Printed nightly");
  });
  test("clicking a featured menu link opens that menu's page", async ({ page }) => {
    await page.goto("/");
    await page.locator(".feature-meta .text-link").first().click();
    await expect(page).toHaveURL(new RegExp(`/${slugs[0]}$`));
    await expect(page.locator("h1")).toHaveText(config.menus[0].title);
  });
  test("hero headline fits the viewport at desktop width", async ({ page }) => {
    await page.goto("/");
    const widths = await page.evaluate(() => {
      const el = document.querySelector(".hero-headline")!;
      return { scroll: el.scrollWidth, client: el.clientWidth, vw: window.innerWidth };
    });
    expect(widths.scroll).toBeLessThanOrEqual(widths.client);
    expect(widths.client).toBeLessThanOrEqual(widths.vw);
  });
});

test.describe("menus page", () => {
  test("shows every menu card and the service details", async ({ page }) => {
    await page.goto("/menus");
    await expect(page.locator(".menu-card")).toHaveCount(config.menus.length);
    await expect(page.locator(".service-detail")).toHaveCount(config.services.length);
    for (const s of config.services) {
      await expect(page.locator(".service-detail-list")).toContainText(s.title);
    }
  });
});

test.describe("menu detail page", () => {
  test("shows the printed menu: courses, price and next-menu link", async ({ page }) => {
    await page.goto(`/${slugs[0]}`);
    await expect(page.locator(".course")).toHaveCount(config.menus[0].courses.length);
    await expect(page.locator(".course h3").first()).toHaveText(config.menus[0].courses[0].name);
    await expect(page.locator(".paper-price")).toHaveText(config.menus[0].price);
    await expect(page.locator(".menu-next a")).toHaveAttribute("href", `/${slugs[1]}`);
  });
  test("clicking next menu advances through the list", async ({ page }) => {
    await page.goto(`/${slugs[0]}`);
    await page.locator(".menu-next a").click();
    await expect(page).toHaveURL(new RegExp(`/${slugs[1]}$`));
    await expect(page.locator("h1")).toHaveText(config.menus[1].title);
  });
});

test.describe("story page", () => {
  test("shows the story photo, principles and press", async ({ page }) => {
    await page.goto("/story");
    await expect(page.locator(".story-photo img")).toHaveAttribute("alt", config.story.imageAlt);
    await expect(page.locator(".principle")).toHaveCount(config.story.principles.length);
    await expect(page.locator(".press-row")).toHaveCount(config.press.length);
    await expect(page.locator("h1")).toHaveText(config.story.heading);
  });
});

test.describe("visit page", () => {
  test("shows the dining room photo, hours, notes and email", async ({ page }) => {
    await page.goto("/visit");
    const photo = page.locator(".visit-photo img");
    await expect(photo).toHaveAttribute("alt", config.visit.imageAlt);
    await expect(photo).toHaveAttribute("src", /room\.jpg/);
    await expect(page.locator(".hours-row")).toHaveCount(config.visit.hours.length);
    await expect(page.locator(".note-list li")).toHaveCount(config.visit.notes.length);
    await expect(page.locator(".visit-email")).toHaveText(config.identity.email);
    await expect(page.locator("h1")).toHaveText(config.visit.heading);
  });
});

test.describe("chrome (header + footer)", () => {
  test("nav marks the current page and links home from the title", async ({ page }) => {
    await page.goto("/story");
    await expect(page.locator(".site-nav a.active")).toHaveText("Story");
    await page.locator(".site-title").click();
    await expect(page).toHaveURL(/\/$/);
  });
  test("footer shows the name, location, email and socials", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator(".site-footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator(".footer-name")).toHaveText(config.identity.name);
    await expect(footer).toContainText(config.identity.location);
    await expect(footer.locator(".footer-email")).toHaveText(config.identity.email);
    await expect(footer.locator(".footer-socials a")).toHaveCount(config.socials.length);
  });
  test("footer background is the deep theme color", async ({ page }) => {
    await page.goto("/");
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    const bg = await page.locator(".site-footer").evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(11, 18, 14)"); // theme.deep #0b120e
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("home has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return { scroll: el.scrollWidth, client: el.clientWidth };
    });
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
  });
  test("menus page has no horizontal overflow", async ({ page }) => {
    await page.goto("/menus");
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return { scroll: el.scrollWidth, client: el.clientWidth };
    });
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
  });
});
