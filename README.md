# A.S. Touch — hand-painted & hand-knotted bags

A premium, frontend-only showcase website (React + Vite + Tailwind CSS). There is **no backend, database, cart, checkout or payment** — customers browse, then enquire or leave feedback, which is delivered to a Discord channel.

```bash
npm install
npm run dev      # local development
npm run build    # production build -> dist/
```

Deploy the contents of `dist/` to any static host (GitHub Pages, Netlify, Cloudflare Pages, Vercel…).

## Managing products (no code changes)

Everything lives in **`public/data/products.json`** — edit it and refresh; no rebuild of the app code is needed if you edit the deployed file.

```json
{
  "slug": "my-new-bag",              // optional – used in the share link (#piece=my-new-bag)
  "name": "My New Bag",              // required
  "category": "Hand-painted",        // any text; filter buttons are generated automatically
  "tagline": "One short line.",
  "description": "A longer description.",
  "image": "images/my-new-bag.jpg",  // main photo (file in public/images/)
  "gallery": ["images/detail-1.jpg"],// optional extra photos (shown as thumbnails)
  "alt": "Describe the photo for screen readers & SEO",
  "technique": "Painted freehand",
  "materials": ["Cotton canvas", "Fabric paints"],
  "colors": ["Terracotta", "Sage"],
  "availability": "Made to order",   // or "One of a kind", "Sold", ...
  "price": "",                       // leave empty to show "Price on request", or e.g. "$85"
  "badge": "New",                    // optional label on the photo
  "featured": false,
  "hidden": false                    // set true to hide a product without deleting it
}
```

- **Add** a product → add an object. **Remove** → delete it (or set `"hidden": true`). **Edit** → change the fields.
- **Use your real photos:** put them in `public/images/` and point `image` / `gallery` at them (e.g. `images/my-bag.jpg`). Replacing a file with the same name also works. Square or 4:5 portrait photos, ~1200 px wide, JPG, look best.
- Site-wide text (announcement bar, FAQ, testimonials, contact details) is in **`public/data/site.json`**. Add real customer quotes to `testimonials` (`{ "quote", "name", "location" }`) and a "Kind words" section appears automatically.

## Customer enquiries & feedback → Discord

The form offers three types: *Product enquiry*, *Custom order* and *Feedback* (with star rating). Messages arrive as tidy embeds in your Discord channel.

**Setup (2 minutes)**
1. In Discord: *Server Settings → Integrations → Webhooks → New Webhook*, choose a **private** channel, copy the URL.
2. Paste it into `public/data/site.json` → `"discordWebhookUrl"` **or** set `VITE_DISCORD_WEBHOOK_URL` at build time.

If no webhook is configured, the form gracefully falls back to opening the visitor's email app, addressed to `contact.email`.

**Security — please read.** A frontend-only site cannot keep a secret: the webhook URL is visible to anyone who inspects the page. A Discord webhook can only *post to one channel* (it cannot read messages or access your server), so the realistic risk is spam. Built-in protections: URL format validation, structured length-limited embeds, **all @mentions disabled**, a hidden honeypot field, and client-side rate limiting (30 s between messages, 4 per hour). Use a dedicated private channel; if it is ever abused, delete the webhook in Discord and create a new one. If you ever need stronger protection, put a tiny serverless proxy (e.g. a Cloudflare Worker) in front of the webhook — that is intentionally *not* included to keep the site backend-free.

## Before you launch

- In `index.html` change `og:image` / `twitter:image` to the **absolute** URL of your hero image (e.g. `https://yourdomain.com/images/hero.jpg`) so link previews work, and optionally add `<link rel="canonical">`.
- Confirm contact details in `site.json` (add `"whatsapp": "94771234567"` in international format to show a WhatsApp link).
- Review product descriptions/materials so they match your real pieces.
