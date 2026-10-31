# Decision Log

Data-backed decisions for this repo. Newest first.

## 2026-10-24 — Fine dining, dark-first

- **Direction:** the fourth template in the series answers the first
  three (light grounds: gray, greige, cream) with a dark one: deep
  green-black `#14201b`, bone `#efe7d7`, gold `#c8a24a` (7.1:1 on the
  ground — passes AA for the small mono labels and prices, verified by
  a computed-contrast unit test over the shipped config).
- **Signature device:** the menus are set on a bone-colored "paper"
  panel on the dark page — the printed-menu metaphor. Course lists are
  centered serif with dotted leaders, straight from classic menu
  typography.
- **Data model:** the central list is `menus` (title, price, note,
  summary, courses[]) generating one page each; "services" became
  experiences; press quotes replaced the portfolio series' commission
  list (quote + source).
- **Type:** Bodoni Moda display (the Didone reads instantly as fine
  dining), Archivo for reading, IBM Plex Mono for prices and notes.
  Self-hosted woff2, same as the rest of the series.
- **Imagery:** all AI-generated — candlelit duck hero, a 2×2 dish
  sheet cut into four menu photos, chef's-hands story shot, and a
  green-and-brass dining room for the Visit page. Originals in
  `source-images/`.
- **Heading-order fix:** menu cards used `h3` before any `h2` existed
  on the Menus page; Lighthouse flagged heading-order (a11y 98 → 100)
  after adding an "All menus" section label. Lesson carried from the
  series: card titles need a section heading above them.
- **Test-writing lesson:** build-output assertions must decode HTML
  entities first — config copy with `&` and `'` renders as `&amp;` /
  `&#39;`, and a mid-line italic word breaks contiguous-string matches
  in raw HTML. The suite now decodes entities and strips tags for
  headline comparisons.
- **Scrub rule (standing, from the series owner):** shipped templates
  carry no reference to any design source or platform they were
  inspired by — no names, no credits, no links. The text tree is
  grepped for platform names before every push; this repo is clean.
- **Pipeline carry-overs from the series:** Node pinned to 22.23.4 in
  workflows (Astro 7.4.2 needs ≥22.23.4); SITE/BASE scoped to the
  deploy build job only; the subpath integration suite builds with a
  deliberately clean env; reveal animations never fade opacity (axe
  contrast snapshots), hidden state is `visibility: hidden`, JS marks
  only below-the-fold elements `.pre`; `imgSrcset` resolves `public/`
  from `process.cwd()` because Vite relocates the module at build
  time.

## 2026-10-30 — Micro-interactions pass

- CSS-only motion layer appended to `src/styles/global.css` (one marked
  section, removable as a block): nav underline sweeps, image zooms
  inside their frames (`a:has(> img)` + overflow hidden), index-row
  name/arrow slides, pill lifts with a press settle, chip rises, row
  leans, next-link arrows, footer-email underline sweeps, accent text
  selection, and visible focus rings.
- Hero motion is a slow transform-only "ken burns" drift (14–18s,
  alternate) — composited, no layout shift, no Lighthouse CLS cost.
- Hard rules kept from the series: no opacity fades on content (axe
  snapshots mid-fade report phantom contrast failures), and a
  `prefers-reduced-motion` block stills every new animation/transition.
- Verified: full test suites green and Lighthouse Accessibility /
  Best Practices / SEO still 100 after the change.
