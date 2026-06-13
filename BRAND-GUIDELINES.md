# Orchid Tree — Brand & Design System

*A boutique nature resort near Bangalore. This document captures the complete design language of the website as built: colour, type, components, voice, imagery, motion, and the technical patterns that hold it together. Treat it as the single source of truth. When in doubt, match what is already on the live site.*

Live site: `https://orchid-sigma.vercel.app`

---

## 1. Brand foundation

**Who we are.** A small, architect-designed estate in a living forest, forty-five minutes from Whitefield. Eleven rooms, a restaurant, a pool, and a forest. Boutique is not size, it is soul. The whole brand sells *calm*, not features.

**Positioning line:** A boutique resort, near Bangalore.

**Signature tagline:** *The art of doing nothing.* (used as the footer sign-off under the name)

**Name lockup.** Always write the brand as **Orchid Tree** (two words). In running copy, in titles, in alt text. The footer of every page closes with the script wordmark **Orchid Tree** in gold, with **THE ART OF DOING NOTHING** beneath it. The name is woven into the home hero and an About-page "why the name" story so visitors remember it, not just see a logo.

**Brand personality:** calm, premium, natural, editorial, restrained, warm. Never loud, never template-y, never salesy.

**The "only Orchid Tree" test.** Before publishing any line, ask: *could this sentence appear on any other resort's site?* If yes, rewrite it until it could only be us (the forest, the eleven rooms, the open-to-sky baths, Mary the host, the farm, the bonfire).

---

## 2. Logo

- The mark is `images/logo.png` (the orchid-tree spiral + "Orchid Tree / Nature Leisure Stays").
- **On dark / over photos:** `filter: brightness(0) invert(1)` (renders it white) with a soft drop shadow.
- **On light / solid nav:** full-colour, no filter.
- Nav size: ~72px over hero, shrinks to ~52px when the nav solidifies on scroll. Footer logo ~64px, inverted white.
- A scripted **"Orchid Tree"** wordmark (Sacramento) is used as a secondary signature in footers and brand moments. It complements the logo, it does not replace it.

---

## 3. Colour

The palette is warm and earthy: a cream field, a deep olive brand colour, and a gold accent, all anchored by a **family of warm browns** that do most of the quiet work, the headings, the dark bands, every photo scrim, and the body text. Gold and olive are the jewellery, cream is the air, brown is the earth. Use CSS variables, never hard-coded hex in new work.

| Token | Hex | Role |
|---|---|---|
| `--cream` | `#f7f3ea` | Primary background |
| `--cream-deep` | `#efe7d6` | Alternate warm section background |
| `--card` | `#ffffff` | Cards, raised surfaces |
| `--green` | `#3c4a16` | **Brand colour.** A deep rich olive. CTAs, footer, accents, links |
| `--green` hover | `#2c3810` | Pressed / hover state of the brand colour |
| `--ink` | `#43382b` | Headings, dark bands, the deepest brown |
| `--body` | `#6e675d` | Body text |
| `--gold` | `#c9a23c` | Eyebrows, signature wordmark, hairlines, accents |
| `--gold-soft` | `#d8bd76` | Gold on dark backgrounds |
| `--line` | `#ece6da` | Hairlines, borders, dividers |
| `--media` | `#e7e1d4` | Image placeholder fill |
| `--media-tx` | `#b3a994` | Muted labels, captions |
| `--media-dark` | `#8c8275` | Image loading fill (dark) |

**rgba forms of the brand olive** (for soft fills/borders/underlines): `rgba(60,74,22,.08)`, `rgba(60,74,22,.3)`, etc. `#3c4a16` = `rgb(60,74,22)`.

**The warm brown family (the anchor).** Brown is not a single token, it is the ground the whole site stands on. It is the heading colour, the dark bands and the Stays footer, the near-black behind the cinematic sections, the translucent wash over every hero and card photo, the taupe of placeholders and captions, and the soft brown of body text. By volume it is one of the most-used colours on the site, the photo and nav scrims alone run to dozens of uses per page. Document and reuse these:

| Token / value | Hex | Role |
|---|---|---|
| `--ink` | `#43382b` | Headings, dark-band backgrounds, the Stays footer, the core brown |
| near-black | `#1c1813` | Behind the cinematic Stays sections |
| photo scrim | `rgba(40,33,25, .x)` ≈ `#282119` | The brown gradient over hero and card images |
| nav / veil | `rgba(20,16,12, .x)` ≈ `#14100c` | Nav top gradient and the cinematic image veils |
| shadow | `rgba(67,56,43, .x)` | Soft brown shadows and hairline tints |
| `--body` | `#6e675d` | Body text, a warm grey-brown |
| `--media-dark` | `#8c8275` | Image loading fill |
| `--media-tx` | `#b3a994` | Muted taupe labels and captions |

Most "dark" surfaces on the site are not black, they are one of these browns. Reach for brown, not grey or black, for any shade, scrim, or shadow.

**Colour history / rationale.** The brand colour started as a deep forest green (`#15583a`), which read cool and clinical against the warm cream. It moved to **olive `#3c4a16`** for warmth and, importantly, contrast: white text on it is ~9.6:1 (well past WCAG AA). Do not return to the cool green.

**Status / utility colours** (used sparingly, only where meaning requires it):
- Veg dot `#3c7a2e` · Non-veg dot `#9a3328` · Vegan dot `#1f6f6b` (dining)
- "Not included" cross `#b9532f` (a muted brick, the only red on the site)

**Dark bands** use `--ink` (`#43382b`) or near-black `#1c1813` (cinematic sections) with white text and gold accents.

---

## 4. Typography

Three families, loaded once from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Mulish:wght@400;500;600;700&family=Sacramento&display=swap" rel="stylesheet">
```

| Token | Family | Use |
|---|---|---|
| `--serif` | **Cormorant Garamond**, Georgia, serif | All headings (h1–h3), pull quotes, room names, menu dish names. Often italic for emotion. |
| `--sans` | **Mulish** (with Avenir Next / system fallback) | All body text, eyebrows, buttons, labels, UI. |
| `--script` | **Sacramento**, cursive | The "Orchid Tree" signature and rare brand accents only. Never for body. |

**Type scale (fluid, `clamp()`):**
- Hero H1: `clamp(54px, 9.5vw, 138px)` (cinematic) or 38–64px on simpler heroes, weight 400–600, line-height ~1.0–1.06, serif, white over photos.
- Section H2: `clamp(30px, 4.6vw, 56px)`, serif, `--ink`, line-height ~1.12.
- H3 / card titles: 19–26px serif.
- Body: 15–18px sans, line-height 1.65–1.85, `--body`.
- Lead paragraphs: 17–18px.

**Eyebrow (the signature small label).** Gold, uppercase, `font-size:11px; letter-spacing:4px; font-weight:700; color:var(--gold)`. Often preceded by a 34px gold hairline (`::before`). This sits above most section headings.

**Italic.** Cormorant italic is used generously for warmth, pull-quotes, taglines, and image captions.

**Numerals — important rule.** Cormorant's figures are thin verticals, so **"11" reads as "II" / "2"**. For any prominent number (stat bands, counts), either spell the word ("Eleven") or set the number in the **sans** (`--sans`, weight 700). Do not show a bare multi-digit number in big Cormorant.

---

## 5. Spacing, layout & shape

- `--pad: clamp(24px, 6.5vw, 110px)` — the standard horizontal page padding / gutter.
- Content max width: `1320px` (`.wrap`), centred.
- Section vertical rhythm: `96px` desktop, `60px` mobile. Editorial sections breathe more (`clamp(80px,14vh,160px)`).
- Radius: `--radius:12px` (cards, media), `--radius-sm:8px` (buttons, chips). Cinematic pages use a tighter `4–6px`.
- **Generous negative space is part of the brand.** When unsure, add air.
- **Asymmetry over symmetry.** Splits are intentionally uneven (e.g. media `46–52%`, text fills the rest). Headlines left, paragraphs offset down-right.
- **Mobile-first.** Everything collapses to a single column at `820px`. Touch targets ≥ 44px.

---

## 6. Components

The reusable building blocks, all built on the tokens above. Reuse these verbatim across pages — consistency is the point.

**Navigation (`.nav`).** Fixed, transparent over the hero with a top-down dark gradient; **solidifies on scroll** to cream with a blur and shadow (`.nav.solid`). Links: uppercase 11px, letter-spacing 2.5px, weight 600, with an **animated gold/ink underline that grows from the left on hover** (`::after`, `scaleX`). Active page: `aria-current="page"` turns the link gold (or green on solid). The right-most item is the **WhatsApp pill** (bordered, see CTAs).

**Hero.** Full-bleed image (or video) with a layered dark scrim, content bottom-left in a ladder: eyebrow → serif H1 → sub → optional gold rule. Staggered fade-up on load. Cinematic variants add a slow Ken Burns zoom and a scroll cue.

**Eyebrow.** See Typography. The connective tissue of the whole site.

**Buttons / CTAs.**
- *Primary:* background `--green`, white text, uppercase 11px letter-spacing 2px weight 700, padding ~16×30px, radius 8px, hover `#2c3810`.
- *Ghost:* 1px border (`--green` on light, white on dark), transparent, inverts on hover.
- *Text link / inline:* `--green`, weight 700, gold-tinted underline that solidifies on hover.
- *WhatsApp pill (the main reserve CTA):* in the nav, a bordered pill labelled "WhatsApp" linking to `wa.me/918088251913` with a prefilled message. The floating **book-fab** (bottom-right, appears past the hero) is the same idea with the WhatsApp glyph.

**Asymmetric split (`.split` / `.split.reverse`).** Image (~46–52%) beside centred text. Image zooms slightly on hover. The workhorse layout.

**Dark band (`.honesty` / `.settings`).** `--ink` or near-black section, white text, gold eyebrow, for emotional or contrast moments (the mandap, the cottages, two settings).

**Stat band (`.statband`).** Dark, 4 columns of big number + uppercase label, separated by faint hairlines. **Numbers in sans** (see numerals rule).

**Model band (`.model-band`).** A slim cream strip stating facts plainly, serif items separated by gold diamonds (◆), with an italic fine-print line.

**Cards.** Photo-led. Variants: room cards, feature cards (`.fcard`), path/tile cards (image + scrim + caption overlay), gallery figures, menu category cards, dish cards (photo, name, short desc, diet dot, price). All minimal text, photo first.

**Cinematic room "chapters"** (Stays page). Full-bleed parallax image with a frosted cream panel floating over it: oversized italic serif name, script tagline, a fact list with gold hairline dividers, big ghosted chapter number. The premium pattern.

**Gallery.** Either a uniform grid or an **asymmetric mosaic** (varied tile sizes) with captions revealing on hover.

**FAQ accordion (`.faq`).** Serif questions, a gold `+` that rotates to `×`, smooth max-height reveal. **Single-open** (opening one closes the others). The visible Q&As auto-generate `FAQPage` JSON-LD.

**Enquiry / CTA card.** Cream card with a left olive rule, heading + lead + WhatsApp and email buttons, plus an internal-links line. The estate uses **enquiry, not instant-book**, for weddings, events and hosting.

**Footer.** Olive (or ink) field. Three columns (logo + tagline + socials · Explore links · Connect/contact), then the centred **script "Orchid Tree" signature + "THE ART OF DOING NOTHING"**, then a bottom row (© + Privacy Policy · Terms links). Social icons are centred. Identical on every page.

---

## 7. Motion & interaction

Motion is calm and purposeful, never busy.

- **Scroll reveal.** Elements fade and rise in (`.reveal` → `.in`) via IntersectionObserver. Cascading groups stagger their children (~0.09s steps). Always include a **failsafe** that reveals anything still hidden ~1.5s after load, so a missed observer never leaves a section blank.
- **Parallax.** Full-bleed images drift on scroll (`data-parallax` + speed). Read all positions first, then write all transforms (no layout thrash). Skip far-offscreen elements.
- **Ken Burns.** Slow infinite zoom on key hero images.
- **Hover.** Image zoom (`scale(1.04–1.07)`), nav underline grow, CTA arrow nudge, caption reveals.
- **Scroll-progress bar.** A 2px gold line at the top of long cinematic pages.
- **Page-load.** One well-orchestrated staggered hero reveal beats scattered micro-animations.
- **Reduced motion.** Every animation must respect `prefers-reduced-motion: reduce` (no Ken Burns, no parallax, instant reveals).

**Performance rules (learned the hard way):**
- **No `mix-blend-mode`** on full-screen overlays — it repaints the whole page every frame.
- **Avoid stacking `backdrop-filter: blur`** over moving parallax (use near-opaque fills instead).
- Use `content-visibility:auto` on heavy offscreen image sections.
- `decoding="async"` on images; `loading="lazy"` below the fold; `fetchpriority="high"` on the hero only.
- A single `requestAnimationFrame` loop for all scroll work; passive listeners.

---

## 8. Photography & imagery

Photography carries the brand. It must feel real, warm, and unstaged.

- **Use Orchid Tree's own licensed photos** wherever possible (room galleries, the estate, the farm, the real staff group photo, the plated food).
- **Placeholders, when needed,** come only from **free, properly-licensed libraries (Unsplash / Pexels)**. **Never Pinterest or any unlicensed source.** Every placeholder is a clearly-commented, one-line-swap slot, labelled with the search mood and a note to replace it with a real Orchid Tree photo.
- **Lean into real people and real emotion** over staged venue shots (a couple laughing, a sunrise meditation, a candle-lit table, the staff photo). Reject loud, gold-foil, beach-cliché, or generic-stock frames.
- **Food is photo-led:** big appetising images, minimal text. No PDF menus, no tables.
- Treatment: warm tones, soft dark scrims for text legibility, gentle hover zoom. A faint film grain is used on the most cinematic page for an analog feel (without blend modes).
- Always provide descriptive, specific **alt text**.

---

## 9. Voice & tone

Write like a calm, confident host, never a marketer.

**Hard rules:**
- **No exclamation marks. Anywhere.**
- **No em dashes or en dashes (— –).** Use commas and periods.
- Always **"Orchid Tree"** (two words).

**Principles:**
- **Feeling before facts.** Open a section with the emotion, then the detail.
- **One specific, sensory idea per section.** ("Wake to the pool and a skylight full of morning.")
- **Sparse.** Short sentences. Cut adjectives. Trust the photos.
- **The "only Orchid Tree" test** (see §1).
- Calm, warm, a little dry. Confident, not boastful.

**Food model (must always be accurate):** breakfast is included with overnight stays; lunch and dinner are plated, farm-to-table and pre-ordered (never buffet); proudly BYOB. **Never claim** "all meals included," "all-inclusive," or "nightly massage." A massage can be added "whenever you like."

**Other facts:** a child is **age up to 6**. Up to 34 guests overnight, up to 60 for a day event. The estate is a **full buyout** for weddings/events. Weddings and events are **enquiry, not instant-book**.

---

## 10. Iconography

- Line icons, 1.6–1.8px stroke, round caps/joins, currentColor, ~18–24px. Simple and consistent (calendar, pin, leaf, clock, cup, etc.).
- Social icons: filled glyphs in circular outlined buttons; hover fills gold.
- Diet dots (dining): small filled circles, veg/non-veg/vegan colours from §3.
- Cross / "not included": a thin X in a soft brick circle.

---

## 11. SEO & technical standards

Every public page must have:
- A **unique** `<title>` and `<meta name="description">`, targeting the page's real search intent (e.g. "intimate wedding venue near Bangalore," "farm-to-table restaurant near Bangalore").
- `<link rel="canonical">`, `robots index,follow` (guest flows and dashboards use `noindex`).
- Full **Open Graph + Twitter** card tags with a representative image.
- **JSON-LD structured data**, matched to the page: `Resort`/`LodgingBusiness` (the property), `Restaurant`, `Service` (weddings, corporate, hosting), and an auto-generated `FAQPage` built from the visible Q&As (so it can never drift from the copy).
- **Semantic HTML** (`header`, `nav`, `main`, `section[aria-label]`, `article`, `figure`/`figcaption`), correct heading order, descriptive alt text.

**Business facts for structured data & footers:**
- Name: Orchid Tree
- Address: Survey No. 7/2, Yelachamanahalli Village, Hoskote, Bangalore Rural, Karnataka 562114, IN
- Phone / WhatsApp: +91 80882 51913 (`wa.me/918088251913`)
- Email: orchidtree.blr@gmail.com
- Rating: 4.4 from 615+ guests
- Socials: instagram.com/orchidtree.in · facebook.com/orchidtree.in · linkedin.com/company/orchid-tree-wellness-retreat

---

## 12. Content & data architecture

The site is static HTML, but content is data-driven from shared modules so a value is edited once:
- **`shared/catalog.js`** — the rooms. One source of truth for the 11 rooms across 4 types (copy, facts, amenities, photo galleries, price). Edit a type once, every room updates.
- **`shared/menu.js`** — the dining single source. Categories, dishes, today's specials, seasonal, always-available, signature beverages, celebration add-ons, preferences. Powers the Restaurant page, the Plan-Your-Dining flow, and the Kitchen dashboard.
- *Production direction:* these front-end modules should be backed by a real backend (e.g. Supabase) so the team updates once and the website, the guest pre-order link, and the kitchen dashboard sync automatically.

---

## 13. Pages & navigation

**Main nav (left to right):** Stays · Experiences · Restaurant · Weddings · Corporate · About · **WhatsApp** (pill).
**Footer "Explore":** Our Stays · Experiences · Restaurant · Weddings · About · Corporate · Host with Us · FAQ. **Host with Us lives in the footer, not the main nav.**

| Page | File | Purpose |
|---|---|---|
| Home | `home.html` | The estate overview |
| Stays | `stays.html` | Cinematic rooms page (the premium showpiece) |
| Experiences | `experiences.html` | A day on the estate |
| Restaurant | `restaurant.html` | Photo-led dining (drives 40%+ of revenue) |
| Weddings | `weddings.html` | Intimate full-buyout weddings |
| Corporate | `corporate.html` | Offsites and retreats |
| Host with Us | `host-with-us.html` | Light umbrella that routes to the right page |
| About | `about.html` | Story, architect, the real team, "why the name," film |
| FAQ | `faq.html` | Questions |
| Plan Your Dining | `plan-your-dining.html` | Guest dining pre-order flow (noindex) |
| Privacy / Terms | `privacy-policy.html` | Legal |
| Booking / app | `guest.html`, `book-packages.html`, `admin.html`, `restaurant-dashboard.html` | App-style flows and staff tools |

---

## 14. Accessibility

- Colour contrast meets WCAG AA (white on olive ≈ 9.6:1; ink on cream is strong).
- Visible focus states; keyboard-operable nav, accordions, and panels (Escape closes overlays; focus is managed).
- `aria-current`, `aria-label`, `aria-hidden` used correctly; alt text on every meaningful image.
- All motion respects `prefers-reduced-motion`.
- Real semantic landmarks and heading order.

---

## 15. Do & don't (quick reference)

**Do**
- Lead with a feeling, then one sensory detail.
- Use the tokens and the existing components; match the live site.
- Let photos carry the page; keep text sparse.
- Spell big numbers or set them in sans.
- Give every placeholder image a swap comment.
- Respect reduced motion and keep scroll smooth.

**Don't**
- No exclamation marks, no em/en dashes, never "Orchidtree" as one word.
- No buffet / all-inclusive / nightly-massage claims.
- No Pinterest or unlicensed images.
- No PDF menus, no data tables, no long paragraphs.
- No cool forest green (`#15583a`), no big Cormorant "11".
- No `mix-blend-mode` or stacked `backdrop-filter` over parallax.
- No loud, gold-foil, banquet-factory, or generic-stock energy. Restraint is the brand.

---

## 16. Deployment

- Hosted on **Vercel**, production alias `https://orchid-sigma.vercel.app`.
- `./deploy.sh` syncs the listed pages and `shared/*.js` into the linked `.deploy/` folder, sets `/` to the latest home page, and ships to production. Add any new page to the `PAGES` array in `deploy.sh`.
- A visual companion to this document lives at **`brand.html`** (the living style guide).

*Restraint is the brand. When a choice is between more and less, choose less, and make the less beautiful.*
