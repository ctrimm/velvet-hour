/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  YOUR RESTAURANT — EDIT THIS FILE ONLY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  This is the only file you need to touch to make this template yours.
 *  Change the words between the quotes, save, and rebuild / redeploy:
 *
 *      npm run dev        → preview your changes live
 *      npm run deploy     → publish them
 *
 *  Rules of thumb:
 *  • Keep the quotes " " around text and keep commas where you find them.
 *  • Images live in `public/images/` — put a photo there and write its
 *    path below, for example "/images/dish.jpg".
 *  • A menu's `slug` is its web address: "the-tasting-menu" becomes
 *    yoursite.com/the-tasting-menu. Lowercase letters, numbers and
 *    dashes only. Leave it out and one is made from the title.
 *  • Colors are hex codes like "#c8a24a". Search "hex color picker" if
 *    you want a different palette.
 *
 *  If something here is invalid — a bad email, a missing field, two
 *  menus with the same slug — the build stops and tells you exactly
 *  what to fix, in plain language.
 */

export const config = {
  // ── The restaurant ───────────────────────────────────────────────────────
  identity: {
    name: "Velvet Hour",
    shortName: "Velvet Hour",
    role: "Fine Dining Restaurant",
    email: "reservations@velvethournola.com",
    // Your site's address once it is live, e.g. "https://velvethour.com".
    // Used for search engines and AI assistants. Leave "" until you have one.
    siteUrl: "",
    location: "New Orleans, Louisiana",
    founded: "2019",
    // Shown in the footer. Set to "" to hide the credit line.
    credit: "Made with Astro + SST",
  },

  // ── Social / contact links (footer) ──────────────────────────────────────
  socials: [
    { label: "Instagram", href: "#" },
    { label: "Journal", href: "#" },
    { label: "Email", href: "mailto:reservations@velvethournola.com" },
  ],

  // ── Look & feel ──────────────────────────────────────────────────────────
  theme: {
    background: "#14201b", // deep green-black — the page ground
    surface: "#efe7d7", // warm bone — the printed-menu paper
    ink: "#efe7d7", // bone — text on the dark ground
    deep: "#0b120e", // near-black green — the footer and darkest bands
    accent: "#c8a24a", // muted gold — rules, prices, small highlights
    // Body text color on the bone paper. Kept separate so small text
    // always has enough contrast on whichever ground it sits.
    deepInk: "#1e2a24",
    // Text color on the near-black footer.
    deepText: "#efe7d7",
    // One preset: "supper" — a high-contrast Didone serif for headlines,
    // a clean sans for reading, and a monospace for prices and notes.
    fonts: "supper",
  },

  // ── Home page ────────────────────────────────────────────────────────────
  home: {
    eyebrow: "New Orleans · Dinner, Tuesday to Saturday",
    // The giant headline over the hero photograph. Mark a word with
    // *asterisks* to set it in italic.
    headline: ["Dinner, after", "the *velvet* hour"],
    heroImage: "/images/hero.jpg",
    heroImageAlt:
      "Sliced duck breast with glossy sauce and edible flowers on a dark plate, beside a candle and a glass of red wine",
    manifesto: [
      "Velvet Hour is a thirty-two-seat dining room for the unhurried evening: two seatings a night, a menu that follows the Gulf and the garden, and a cellar built for lingering. There is no music above a murmur and no course in a hurry.",
      "Chef Adeline Moreau cooks the food she grew up around — French technique, Louisiana ingredients, and a Gulf fish course that regulars cross the city for.",
    ],
    stats: [
      { value: "09", label: "Courses on the tasting menu" },
      { value: "400+", label: "Bottles in the cellar" },
      { value: "32", label: "Seats, two seatings nightly" },
    ],
  },

  // ── The experiences ──────────────────────────────────────────────────────
  // The home page shows the titles; the Menus page shows everything.
  services: [
    {
      title: "The tasting menu",
      summary:
        "Nine courses at the table, the whole room on the same journey. The menu changes with the market; the pacing never does.",
      items: ["Nine courses", "Optional wine pairing", "Two seatings nightly", "Vegetal menu on request"],
    },
    {
      title: "À la carte",
      summary:
        "A shorter evening in the front room: the signatures, a raw bar, and the duck for two that built our name.",
      items: ["Raw bar & oysters", "Signatures from the tasting", "Duck for two", "Walk-ins at the bar"],
    },
    {
      title: "The cellar room",
      summary:
        "A private room beneath the restaurant for ten guests, around one oak table, with the cellar at your elbow.",
      items: ["Seats ten", "Dedicated sommelier", "Bespoke menus", "Cellar access"],
    },
    {
      title: "The chef's counter",
      summary:
        "Four stools at the pass. The cooks plate in front of you and talk you through every course — questions encouraged.",
      items: ["Four seats nightly", "One seating only", "Kitchen conversation", "Chef's extras"],
    },
  ],

  // ── An evening, hour by hour ─────────────────────────────────────────────
  process: [
    {
      step: "5:30p",
      title: "Doors & aperitif",
      text: "The room opens; the first seating takes an aperitif while the kitchen sends out the bread course.",
    },
    {
      step: "6:00p",
      title: "First seating",
      text: "Nine courses over two unhurried hours. Phones away is a suggestion, not a rule — the food makes the case.",
    },
    {
      step: "8:30p",
      title: "Second seating",
      text: "The room resets, the candles are replaced, and the evening begins again for the night owls.",
    },
    {
      step: "Late",
      title: "Digestif",
      text: "The bar stays open after the last course. Amaro, aged rum, and whatever the sommelier is excited about.",
    },
  ],

  // ── The menus ────────────────────────────────────────────────────────────
  // Add, remove or reorder freely — the home page, the Menus page and
  // each menu's own page are all generated from this list.
  menus: [
    {
      slug: "the-tasting-menu",
      title: "The Tasting Menu",
      price: "$165",
      note: "Nine courses · per guest",
      image: "/images/menu-tasting.jpg",
      imageAlt: "Seared scallops with a golden crust on a dark plate",
      summary:
        "The full evening: nine courses moving from the Gulf to the garden to the fire, paced over two hours and finished with something from the cellar's sweet shelf. Wine pairing available; the vegetal menu runs alongside it, always.",
      courses: [
        { name: "Gulf oyster", description: "Champagne mignonette, finger lime, a single tear of shiso" },
        { name: "Hokkaido scallop", description: "Brown butter, cauliflower silk, trout roe" },
        { name: "Bread course", description: "Grilled sourdough, cultured butter, smoked salt" },
        { name: "Garden beets", description: "Whipped goat cheese, pistachio, sherry caramel" },
        { name: "Gulf fish", description: "The morning's catch, sauce vin blanc, sea herbs" },
        { name: "Duck breast", description: "Cherry gastrique, parsnip, thyme jus — the signature" },
        { name: "Aged ribeye", description: "For the table: pommes purée, bone-marrow crumb" },
        { name: "Cheese", description: "A single farmhouse cheese, honeycomb, walnut bread" },
        { name: "Chocolate & gold", description: "Dark chocolate, olive oil, sea salt, vanilla bean" },
      ],
    },
    {
      slug: "a-la-carte",
      title: "À La Carte",
      price: "From $24",
      note: "Front room & bar",
      image: "/images/menu-duck.jpg",
      imageAlt: "Sliced roasted duck breast fanned on a dark plate with thyme jus",
      summary:
        "For shorter evenings: the raw bar, the signatures, and the duck for two, carved at the table. Served in the front room and at the bar, where walk-ins are welcome and the full cellar list applies.",
      courses: [
        { name: "Oysters", description: "Half dozen, champagne mignonette — $24" },
        { name: "Scallop crudo", description: "Yuzu kosho, cucumber, avocado — $26" },
        { name: "Beet tartare", description: "Smoked yolk, rye crisp, horseradish — $21" },
        { name: "Gulf fish", description: "The morning's catch, vin blanc — $38" },
        { name: "Duck for two", description: "Cherry gastrique, carved at the table — $92" },
        { name: "Ribeye", description: "45-day aged, pommes purée — $68" },
        { name: "Chocolate & gold", description: "Olive oil, sea salt — $16" },
      ],
    },
    {
      slug: "the-cellar",
      title: "The Cellar",
      price: "From $18",
      note: "By the glass & bottle",
      image: "/images/menu-cellar.jpg",
      imageAlt: "Red wine being poured into a glass in a candlelit cellar",
      summary:
        "Four hundred bottles deep and deliberately unhurried: grower Champagne, aged Bordeaux, and a by-the-glass list the sommelier rewrites weekly. Ask for the cellar book — it is longer than this menu and proud of it.",
      courses: [
        { name: "Grower Champagne", description: "Rotating growers, always one blanc de blancs — from $18" },
        { name: "White Burgundy", description: "Mâcon to Meursault, eight by the bottle — from $22" },
        { name: "Aged Bordeaux", description: "Library vintages back to 1996 — from $28" },
        { name: "Louisiana pairing", description: "The tasting menu's nine pours, narrated — $95" },
        { name: "Amaro & digestif", description: "A short, serious shelf for after dinner — from $14" },
      ],
    },
    {
      slug: "sweet-finishes",
      title: "Sweet Finishes",
      price: "From $14",
      note: "Dessert & the cheese course",
      image: "/images/menu-dessert.jpg",
      imageAlt: "Dark chocolate dessert with gold leaf and a quenelle of cream by candlelight",
      summary:
        "The last word: a dark chocolate dessert with gold leaf that the whole room orders by the second seating, a farmhouse cheese course, and whatever the pastry kitchen is testing this week.",
      courses: [
        { name: "Chocolate & gold", description: "Dark chocolate, olive oil, sea salt, vanilla bean — $16" },
        { name: "Burnt honey tart", description: "Bee pollen, crème fraîche — $14" },
        { name: "Cheese course", description: "One farmhouse cheese, honeycomb, walnut bread — $19" },
        { name: "Sorbet", description: "Seasonal, churned daily — $12" },
      ],
    },
  ],

  // ── Story page ───────────────────────────────────────────────────────────
  story: {
    image: "/images/story.jpg",
    imageAlt: "A chef's hands placing micro herbs on a plated dish with tweezers in a dark kitchen",
    heading: "A dining room built for the evening's slow hours",
    paragraphs: [
      "Velvet Hour opened in 2019 in a former Garden District carriage house — thirty-two seats, green walls, brass and candlelight, and a kitchen that Adeline Moreau designed around a single wood-fired hearth.",
      "Adeline trained in Lyon and cooked in New Orleans for a decade before opening her own room. Her cooking is French in its bones and Louisiana in its accent: Gulf fish, garden vegetables, duck with cherries, and sauces that take two days and no shortcuts.",
    ],
    principles: [
      {
        title: "Two seatings, never three",
        text: "The evening has a pace and we protect it. Nobody is ever rushed toward the digestif.",
      },
      {
        title: "The Gulf first",
        text: "The menu starts at the dock each morning. What the boats bring decides what the kitchen cooks.",
      },
      {
        title: "Candlelight is lighting design",
        text: "Low light, low music, warm room. The food is the brightest thing on the table, as it should be.",
      },
    ],
    availability: "Reservations open thirty days ahead and the chef's counter goes first — book early.",
  },

  // ── Kind words (home page list) ──────────────────────────────────────────
  press: [
    { quote: "The most exciting room in the city right now.", source: "The Ledger — Dining Review" },
    { quote: "Nine courses, zero misses. The duck alone is worth the trip.", source: "Gulf Coast Table" },
    { quote: "A cellar list with a point of view and the patience to pour it.", source: "The Wine Quarterly" },
    { quote: "Candlelit, unhurried, exact. Book the counter if you can.", source: "City Eats Magazine" },
  ],

  // ── Visit page ───────────────────────────────────────────────────────────
  visit: {
    heading: "Reserve your evening",
    text: "You will find us behind a green door on Prytania Street — no sign, just the glow. Reservations are recommended for the dining room; the bar keeps a few stools for walk-ins.",
    image: "/images/room.jpg",
    imageAlt:
      "The Velvet Hour dining room: green walls, brass sconces, candlelit marble tables and a glowing back bar",
    address: ["2727 Prytania Street", "New Orleans, Louisiana 70130"],
    hours: [
      { days: "Tuesday – Saturday", time: "5:30p – 10:30p" },
      { days: "First seating", time: "6:00p" },
      { days: "Second seating", time: "8:30p" },
      { days: "Sunday & Monday", time: "Closed — the kitchen rests" },
    ],
    notes: [
      "Reservations open thirty days ahead, online and by email",
      "Tell us about allergies when you book — the kitchen plans around them gladly",
      "Smart dress; jackets admired but never required",
    ],
  },
};

export default config;
