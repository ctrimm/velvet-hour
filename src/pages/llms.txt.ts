import type { APIRoute } from "astro";
import { site, menus, url } from "../data/site";

/** /llms.txt — a plain-text map of the site for AI assistants,
 *  generated from the same config as the pages themselves. */
export const GET: APIRoute = () => {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is a ${site.role.toLowerCase()} based in ${site.location}. This site presents the restaurant's menus, story and reservation details.`,
    "",
    `Reservations: ${site.email}`,
    "",
    "## Pages",
    "",
    `- [Home](${url("/")}): Hero, philosophy and numbers, the experiences, featured menus, an evening hour by hour, and press.`,
    `- [Menus](${url("/menus")}): Every menu printed in full, plus the experiences in detail.`,
    `- [Story](${url("/story")}): The restaurant's story, principles and booking notes.`,
    `- [Visit](${url("/visit")}): Address, opening hours, seatings and good-to-know notes.`,
    "",
    "## Menus",
    "",
    ...menus.map(
      (m) => `- [${m.title}](${url(`/${m.slug}`)}): ${m.note}, ${m.price}. ${m.courses.length} courses/items listed.`
    ),
    "",
    "## Experiences",
    "",
    ...site.services.map((s) => `- ${s.title}: ${s.summary}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
