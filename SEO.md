# Orchid Tree — SEO Handover & Guide

*Everything needed to understand, maintain, and grow the search performance of the Orchid Tree website. Hand this to any marketer, SEO, or developer. Last reviewed: June 2026.*

Production site: `https://orchid-sigma.vercel.app`
Hosting: Vercel (static HTML). Deploy with `./deploy.sh`.

---

## 1. Goal

Rank for **local, high-intent searches near Bangalore** (weekend getaways, resorts, farm-to-table dining, intimate weddings, corporate offsites, things to do) and convert that traffic into enquiries and bookings. The strategy is: a fast, well-structured, mobile-first site, one strong landing page per intent, supported by a content engine (the Journal) that captures informational searches and links into the money pages.

---

## 2. Business facts (NAP) — keep identical everywhere

Search engines and local listings must see the **same Name, Address, Phone** wherever they appear (website, Google, Maps, directories). Use this exact format:

- **Name:** Orchid Tree
- **Address:** Survey No. 7/2, Yelachamanahalli Village, Hoskote, Bangalore Rural, Karnataka 562114, India
- **Phone / WhatsApp:** +91 80882 51913
- **Email:** orchidtree.blr@gmail.com
- **Rating shown:** 4.4 from 615+ guests
- **Socials:** instagram.com/orchidtree.in · facebook.com/orchidtree.in · linkedin.com/company/orchid-tree-wellness-retreat

> **Important domain note.** All canonical URLs, Open Graph URLs, and structured-data URLs currently point to `orchid-sigma.vercel.app` (the Vercel address). Before or at launch on the real domain (for example `orchidtree.in` or a subdomain), do a find-and-replace of `orchid-sigma.vercel.app` to the live domain across every page, regenerate the sitemap, and set up 301 redirects. Running two near-identical sites (this one and the existing `orchidtree.in`) at the same time risks duplicate-content dilution; decide which is canonical and 301-redirect the other.

---

## 3. Indexable page map

These 13 pages are open to Google. Each has a unique title, description, canonical, and structured data.

| Page | URL (path) | Primary keyword | Structured data |
|---|---|---|---|
| Home | `/` (home.html) | boutique resort near Bangalore | *see gap in §9* |
| Stays | `/stays.html` | rooms / stays / garden cottages near Bangalore | Resort + LodgingBusiness |
| Experiences | `/experiences.html` | things to do at a nature resort near Bangalore | Resort, FAQPage |
| Restaurant | `/restaurant.html` | farm-to-table restaurant near Bangalore | Restaurant |
| Weddings | `/weddings.html` | intimate wedding venue near Bangalore | Resort + LodgingBusiness, Service, FAQPage |
| Corporate | `/corporate.html` | corporate offsite venue near Bangalore | LodgingBusiness, Service |
| Host with Us | `/host-with-us.html` | private event venue near Bangalore | LodgingBusiness, Service, FAQPage |
| About | `/about.html` | architect-designed nature retreat near Bangalore | Resort |
| FAQ | `/faq.html` | Orchid Tree FAQ, pet policy, location | LodgingBusiness, FAQPage |
| Journal (blog) | `/blog.html` | Orchid Tree stories | Blog |
| Blog: Weekend getaways | `/blog-weekend-getaways-near-bangalore.html` | weekend getaways near Bangalore | BlogPosting, BreadcrumbList, FAQPage |
| Blog: Farm-to-table | `/blog-farm-to-table-dining-near-bangalore.html` | farm-to-table near Bangalore | BlogPosting, BreadcrumbList, FAQPage |
| Blog: Intimate weddings | `/blog-intimate-wedding-venues-near-bangalore.html` | intimate wedding venues near Bangalore | BlogPosting, BreadcrumbList, FAQPage |
| Privacy & Terms | `/privacy-policy.html` | (legal, low priority) | none needed |

**Intentionally hidden from search (`noindex`)** — correct as-is: `plan-your-dining.html`, `restaurant-dashboard.html`, `brand.html`, `brand-components.html`, `brand-voice.html`.

**Currently indexable but should probably be `noindex`** (thin or app pages, see §9): `guest.html`, `book-packages.html`, `admin.html`.

---

## 4. On-page SEO standards (apply to every new page)

- **Title tag**, unique, ~50 to 60 characters, primary keyword near the front, end with ` | Orchid Tree`. (Use a vertical bar, not a dash.)
- **Meta description**, unique, ~140 to 158 characters, includes the keyword and a reason to click. Not used for ranking directly, but drives click-through.
- **One `<h1>`** per page containing the topic, then a logical `<h2>` / `<h3>` outline.
- **Canonical tag** on every indexable page, pointing to its own absolute URL.
- **Descriptive, keyword-rich, hyphenated file names** as the URL slug (for example `blog-weekend-getaways-near-bangalore.html`). Do not change a published slug without a 301 redirect.
- **Internal links** in the body from blog posts and supporting pages into the money pages (Stays, Restaurant, Weddings, Corporate). This is already done and is one of the strongest levers here.
- **Descriptive alt text** on every meaningful image.
- **Open Graph + Twitter** tags so shared links look good on WhatsApp, Instagram, and Facebook.

---

## 5. Structured data (rich results)

Structured data is implemented as JSON-LD and makes pages eligible for rich results (stars, FAQs, breadcrumbs, business info). What is in place:

- **LodgingBusiness / Resort** on the property and landing pages, with address, phone, rating, rooms, amenities, check-in/out.
- **Restaurant** on the dining page (cuisines, price range, address).
- **Service** on Weddings, Corporate, and Host with Us (the offering, area served, provider).
- **FAQPage** auto-generated from the visible Q&As on Experiences, Weddings, Host with Us, FAQ, and every blog post. It is generated from the on-page text, so it can never disagree with what users read.
- **BlogPosting + BreadcrumbList** on every Journal article (headline, image, dates, author, publisher, breadcrumb trail).
- **Blog** on the Journal index.

**Test after any change:** Google Rich Results Test (`search.google.com/test/rich-results`) and the Schema Markup Validator (`validator.schema.org`). Paste the page URL, confirm zero errors.

---

## 6. Technical SEO

Already in good shape:
- **HTTPS** by default (Vercel).
- **Mobile-first**, responsive, 44px touch targets.
- **Fast**: optimised images (`loading="lazy"` below the fold, `decoding="async"`, `fetchpriority="high"` on heroes), no heavy blocking scripts, smooth scroll performance.
- **Semantic HTML** (`header`, `nav`, `main`, `section`, `article`, `figure`), correct heading order.
- **Clean URLs** with keyword slugs.
- **Reduced-motion** support (accessibility, which Google rewards).

To add (see §9 action items): `sitemap.xml`, `robots.txt`, Google Search Console, and analytics.

---

## 7. Local SEO (this matters most for a resort near Bangalore)

1. **Google Business Profile** is the single highest-impact action. Claim/verify the listing, set the exact NAP above, primary category "Resort" (plus "Wedding venue", "Restaurant" as secondary), add real photos, hours, the website link, and the WhatsApp number. Reply to every review.
2. **NAP consistency** across the website footer, Google, Maps, JustDial, MakeMyTrip/Booking listings, and social profiles. Inconsistent address/phone hurts local ranking.
3. **Reviews**: keep gathering them (currently 4.4 from 615+). Volume and recency of Google reviews directly affect the local pack.
4. **Local keywords** are already targeted ("near Bangalore", "near Whitefield", "Hoskote", "Bangalore Rural"). Keep using them naturally in titles, H1s, and body.
5. **Local content** in the Journal (getaways near Bangalore, things to do near Whitefield, etc.) builds topical authority for the area.

---

## 8. Content / blog strategy (the Journal)

The Journal at `/blog.html` is the content engine. Three posts are live (weekend getaways, farm-to-table, intimate weddings), each targeting a real keyword and linking into a money page.

- **Cadence:** aim for 2 to 4 quality posts a month. Consistency matters more than volume.
- **Each post should:** target one keyword/question, be genuinely useful (800 to 1200 words), have a unique title + description + canonical, BlogPosting + Breadcrumb structured data, a short FAQ, internal links to the relevant landing page, descriptive alt text, and a CTA.
- **High-value keyword ideas to write next:**
  - pet-friendly resorts near Bangalore
  - monsoon getaways near Bangalore
  - resorts near Whitefield for couples
  - corporate offsite venues near Bangalore
  - best time to visit / what to pack for a forest stay
  - anniversary / proposal ideas near Bangalore
  - day outing / one-night getaways from Bangalore
- **Internal linking:** every new post links to at least one money page, and older related posts link to the new one. The "Keep reading" block on each post handles part of this.
- **How to publish:** duplicate any `blog-*.html`, change the head metadata, JSON-LD, body, and slug, add a card to `blog.html`, add the file to `deploy.sh`, then deploy.

---

## 9. Gaps and action items (prioritised)

**P1 — do first**
1. **Home page is under-optimised.** It is the most important page but is missing a canonical tag, a meta description, and structured data, and its `<title>` uses a dash. Add: a canonical, a keyword-rich meta description, `Resort`/`LodgingBusiness` JSON-LD (like the other pages), and switch the title to ` | Orchid Tree` style.
2. **Add `sitemap.xml` and `robots.txt`** (ready-to-use content in the appendix). Submit the sitemap in Search Console.
3. **Set up Google Search Console** (verify the domain, submit sitemap, monitor coverage, queries, and Core Web Vitals) and **Google Business Profile** (see §7).
4. **Decide the live domain** and update all `orchid-sigma.vercel.app` URLs + canonicals + sitemap to it, with 301 redirects from the old site/domain.

**P2 — soon**
5. **`noindex` the app/thin pages**: `admin.html` (definitely), and most likely `guest.html` and `book-packages.html`, so booking-flow and admin URLs do not compete in search.
6. **Add web analytics** (Google Analytics 4 or a privacy-friendly tool like Plausible) to measure traffic, sources, and conversions.
7. **Image file names + sizes:** where possible, serve appropriately sized images and give files descriptive names (some hero/room images are large; compressing them improves Core Web Vitals).

**P3 — ongoing**
8. Publish Journal posts on a regular cadence (§8).
9. Build a few quality local backlinks (Bangalore travel/wedding/food blogs, listing sites, partner mentions).
10. Re-test rich results after any template change.

---

## 10. Tools & ongoing checklist

**Tools:** Google Search Console, Google Business Profile, Google Rich Results Test, Schema Validator, PageSpeed Insights, an analytics tool, and (optional) an SEO suite (Ahrefs / Semrush / Ubersuggest) for keyword and rank tracking.

**Monthly check:**
- [ ] Search Console: any coverage errors, what queries are growing, click-through on key pages
- [ ] Core Web Vitals still passing
- [ ] New Journal post(s) published, internally linked, and structured-data-valid
- [ ] Google Business Profile: new photos, reviews replied to, info accurate
- [ ] NAP still identical across website, Google, and listings
- [ ] Rich results still valid on the main landing pages

---

## Appendix A — `robots.txt` (ready to add)

Place at the site root (`/robots.txt`). Replace the domain when the live domain is set.

```
User-agent: *
Allow: /

# Keep app, staff, and internal pages out of search
Disallow: /admin.html
Disallow: /guest.html
Disallow: /book-packages.html
Disallow: /plan-your-dining.html
Disallow: /restaurant-dashboard.html
Disallow: /brand.html
Disallow: /brand-components.html
Disallow: /brand-voice.html

Sitemap: https://orchid-sigma.vercel.app/sitemap.xml
```

## Appendix B — `sitemap.xml` (ready to add)

List only indexable pages. Update the domain and `lastmod` dates as needed.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://orchid-sigma.vercel.app/home.html</loc><priority>1.0</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/stays.html</loc><priority>0.9</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/restaurant.html</loc><priority>0.9</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/weddings.html</loc><priority>0.9</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/corporate.html</loc><priority>0.8</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/experiences.html</loc><priority>0.8</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/host-with-us.html</loc><priority>0.7</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/about.html</loc><priority>0.7</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/faq.html</loc><priority>0.6</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/blog.html</loc><priority>0.7</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/blog-weekend-getaways-near-bangalore.html</loc><priority>0.6</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/blog-farm-to-table-dining-near-bangalore.html</loc><priority>0.6</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/blog-intimate-wedding-venues-near-bangalore.html</loc><priority>0.6</priority></url>
  <url><loc>https://orchid-sigma.vercel.app/privacy-policy.html</loc><priority>0.2</priority></url>
</urlset>
```

---

*Prepared as a handover reference for the Orchid Tree team. The website foundations are strong, well-structured, fast, mobile-first, and rich in structured data. The biggest wins from here are off the page: Google Business Profile, Search Console, a live domain decision, and a steady stream of Journal content.*
