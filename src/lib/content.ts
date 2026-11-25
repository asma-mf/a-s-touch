import { useEffect, useState } from "react";
import type { Product, SiteConfig } from "../types";

export const defaultSite: SiteConfig = {
  brand: { name: "A.S. Touch", tagline: "Hand-painted & hand-knotted bags" },
  contact: {
    email: "astouch@gmail.com",
    phone: "0772409504",
    instagram: "a.s.touch",
    whatsapp: "",
  },
  discordWebhookUrl: "",
  announcement: "Every piece is made by hand, to order. Worldwide enquiries welcome.",
  testimonials: [],
  faq: [],
};

/** Image paths in the JSON are relative to the site root (e.g. "images/bag.jpg"). */
export function asset(path: string): string {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return path.replace(/^\.?\//, "");
}

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v.trim() : fallback;
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-");

/** Defensive normalisation so a typo in the JSON never crashes the site. */
export function normalizeProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    if (r.hidden === true) continue;
    const name = str(r.name);
    const image = str(r.image);
    if (!name) continue;
    let slug = slugify(str(r.slug) || name) || `piece-${out.length + 1}`;
    while (seen.has(slug)) slug += "-2";
    seen.add(slug);
    out.push({
      slug,
      name,
      category: str(r.category, "Handmade"),
      tagline: str(r.tagline),
      description: str(r.description),
      image,
      gallery: strList(r.gallery),
      alt: str(r.alt, name),
      technique: str(r.technique),
      materials: strList(r.materials),
      colors: strList(r.colors),
      availability: str(r.availability, "Made to order"),
      price: str(r.price),
      badge: str(r.badge),
      featured: r.featured === true,
    });
  }
  return out;
}

export function normalizeSite(raw: unknown): SiteConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>;
  const faq = Array.isArray(r.faq)
    ? r.faq
        .filter((f: any) => f && typeof f.q === "string" && typeof f.a === "string")
        .map((f: any) => ({ q: f.q, a: f.a }))
    : defaultSite.faq;
  const testimonials = Array.isArray(r.testimonials)
    ? r.testimonials
        .filter((t: any) => t && typeof t.quote === "string" && typeof t.name === "string")
        .map((t: any) => ({
          quote: t.quote,
          name: t.name,
          location: typeof t.location === "string" ? t.location : undefined,
        }))
    : [];
  return {
    brand: { ...defaultSite.brand, ...(r.brand ?? {}) },
    contact: { ...defaultSite.contact, ...(r.contact ?? {}) },
    discordWebhookUrl:
      (import.meta.env.VITE_DISCORD_WEBHOOK_URL as string | undefined) ||
      str(r.discordWebhookUrl),
    announcement: str(r.announcement, defaultSite.announcement),
    testimonials,
    faq,
  };
}

export type LoadState = "loading" | "ready" | "error";

export function useContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [site, setSite] = useState<SiteConfig>(defaultSite);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const [p, s] = await Promise.all([
          fetch("data/products.json", { cache: "no-cache", signal: ctrl.signal }),
          fetch("data/site.json", { cache: "no-cache", signal: ctrl.signal }).catch(() => null),
        ]);
        if (!p.ok) throw new Error(`products.json ${p.status}`);
        setProducts(normalizeProducts(await p.json()));
        if (s && s.ok) {
          try {
            setSite(normalizeSite(await s.json()));
          } catch {
            /* keep defaults */
          }
        }
        setState("ready");
      } catch (e) {
        if ((e as Error).name !== "AbortError") setState("error");
      }
    })();
    return () => ctrl.abort();
  }, []);

  return { products, site, state };
}
