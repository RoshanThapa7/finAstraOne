# Fin Astra — Website

**Lawyer-led financial advisory firm. Premium multi-page site.**

---

## Tech Stack

- Vanilla HTML / CSS / JS (no build step, no npm)
- GSAP + ScrollTrigger (CDN) — scroll animations, reveals
- Lenis (CDN) — smooth scroll
- Web3Forms — contact form (static-compatible)
- WhatsApp deep links — primary conversion path
- Google Fonts — Fraunces (display), Inter (body)

---

## File Structure

```
/
├── index.html              Home
├── practice-areas.html     Practice Areas (accordion)
├── resources.html          Resources (tabbed: Blog / Articles / Useful Links)
├── about.html              About + Team + Values
├── contact.html            Contact form + WhatsApp + Map
├── /blog/
│   └── [slug].html         Individual blog posts
├── /assets/
│   ├── /css/
│   │   ├── style.css       Design tokens, base reset, typography
│   │   ├── components.css  All UI components
│   │   └── animations.css  Motion states, cursor styles
│   ├── /js/
│   │   ├── main.js         Lenis, nav, mobile menu, accordion, tabs, form
│   │   ├── animations.js   GSAP ScrollTrigger setups
│   │   ├── cursor.js       Custom cursor + magnetic buttons
│   │   ├── resources-data.js     Blog/article data (edit to add posts)
│   │   ├── useful-links-data.js  Useful links data
│   │   └── resources-render.js   Renders resource cards from data
│   └── /images/            (add partner photos, OG image here)
├── sitemap.xml
├── robots.txt
└── README.md
```

---

## Deployment: Cloudflare Pages

1. Push repository to GitHub/GitLab
2. In Cloudflare Pages dashboard: Connect to Git → select repo
3. Build settings: **none required** (static site — no build command, no output directory transformation needed)
4. Set root directory to `/` (default)
5. Deploy

No server-side code. No API routes. Fully static.

---

## Pre-Launch Checklist

### Content Replacements (search for `<!-- REPLACE:` in all files)

| Item | File(s) | Notes |
|------|---------|-------|
| WhatsApp number | All pages | Replace `15550000000` with real number (no +, no spaces) |
| Office address | index.html, contact.html, footer sections | Physical address |
| Phone number | All pages | Click-to-call `href="tel:..."` |
| Email address | All pages | |
| Web3Forms access key | contact.html | Get from web3forms.com |
| Partner names | index.html, about.html | Legal names |
| Partner photos | index.html, about.html | Replace placeholder SVGs |
| Bar admissions | index.html, about.html | Actual bar memberships |
| Founding year | about.html | |
| Founding narrative | about.html | Real story |
| Google Map embed | contact.html | Real office coordinates |
| Domain | sitemap.xml, robots.txt, all OG tags | Actual domain |
| OG image | All pages | 1200×630 branded image |

### Technical

- [ ] Add real OG image to `/assets/images/og-image.jpg`
- [ ] Update all `https://finastra.com` references to real domain
- [ ] Replace Web3Forms `YOUR_WEB3FORMS_ACCESS_KEY_HERE` with real key from [web3forms.com](https://web3forms.com)
- [ ] Replace WhatsApp number in all `wa.me/` links
- [ ] Update Google Maps embed with real office coordinates
- [ ] Add partner headshots to `/assets/images/` and update `src` attributes
- [ ] Add `sitemap.xml` URL to Google Search Console after deployment
- [ ] Test contact form submission end-to-end
- [ ] Test WhatsApp deep links on mobile

### Adding New Blog Posts

1. Add entry to `assets/js/resources-data.js` with `category: "blog"` and a `slug`
2. Create `/blog/[slug].html` using `blog/understanding-fiduciary-duty.html` as template
3. Update `sitemap.xml` with new URL

---

## Design System

See `assets/css/style.css` for full CSS custom properties (palette, typography, spacing).

Key tokens:
- `--bg-primary: #FCFAF4` — whitish warm ivory
- `--bg-secondary: #F4EEE0` — soft champagne
- `--gold: #9C7A1E` / `--gold-bright: #C9A227` — primary gold accents (aliased as `--terracotta` for backwards compatibility)
- `--charcoal: #2A251F` — primary text / contrast bands
- `--font-display: 'Fraunces'` — headings
- `--font-body: 'Inter'` — UI text

---

## Financial Advisory Disclaimer

The footer disclaimer reads:

> "Fin Astra provides financial advisory services. Nothing on this website constitutes formal legal advice, investment advice, or a solicitation to buy or sell any financial instrument. Past outcomes do not guarantee future results. Please consult directly with our team regarding your specific circumstances. Attorney-client privilege applies only upon formal engagement."

Have this reviewed by the firm's legal team before launch.
