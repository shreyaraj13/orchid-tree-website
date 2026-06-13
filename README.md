# Orchid Tree — Website

The website for **Orchid Tree**, a boutique nature resort and private forest estate about forty-five minutes from Whitefield, near Bangalore.

**Live:** https://orchid-sigma.vercel.app

## About

A fast, static, mobile-first marketing site built as hand-written HTML, CSS, and vanilla JavaScript on a shared design system. No build step, no framework. Content for rooms and dining is data-driven from small shared modules so a value is edited once.

## Structure

- **Public pages:** `home.html`, `stays.html`, `experiences.html`, `restaurant.html`, `weddings.html`, `corporate.html`, `host-with-us.html`, `about.html`, `faq.html`, `privacy-policy.html`
- **Journal (blog):** `blog.html` and `blog-*.html` articles, built for local SEO
- **Guest and booking flows:** `guest.html`, `book-packages.html`, `plan-your-dining.html`
- **Staff tools:** `admin.html`, `restaurant-dashboard.html`
- **Shared data and helpers:** `shared/` (`catalog.js` rooms, `menu.js` dining, plus store/otp/content/packages)
- **Images:** `images/`

## Design system and SEO

- `BRAND-GUIDELINES.md` and the living style guide at `brand.html`, `brand-components.html`, `brand-voice.html`
- `SEO.md`, the SEO handover and guide

## Deploy

Hosted on Vercel. To publish:

```bash
./deploy.sh
```

It syncs the production pages and `shared/*.js` into the linked `.deploy/` folder, sets `/` to the latest home page, and ships to production at https://orchid-sigma.vercel.app.

## Notes

- Brand colour is a deep olive (`#3c4a16`) on cream, with gold accents and warm browns. Typography is Cormorant Garamond, Mulish, and a Sacramento script signature.
- House voice rules: no exclamation marks, no em dashes, and the brand is always written "Orchid Tree".
