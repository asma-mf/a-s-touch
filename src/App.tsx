import { useCallback, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero, Marquee } from "./components/Hero";
import { Collection } from "./components/Collection";
import { ProductModal } from "./components/ProductModal";
import { Craft } from "./components/Craft";
import { Story } from "./components/Story";
import { Faq, Order, Testimonials } from "./components/Order";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { asset, useContent } from "./lib/content";
import { useReveal } from "./lib/useReveal";
import type { InquiryKind, InquiryPrefill, Product } from "./types";

const BASE_TITLE = document.title;
const HASH_PREFIX = "#piece=";

export default function App() {
  const { products, site, state } = useContent();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<InquiryPrefill>({ kind: "product", product: "", nonce: 0 });

  useReveal([state, products.length, site.testimonials.length, site.faq.length]);

  const product = products.find((p) => p.slug === openSlug) ?? null;

  // deep links: #piece=slug
  useEffect(() => {
    const read = () => {
      const h = decodeURIComponent(window.location.hash);
      setOpenSlug(h.startsWith(HASH_PREFIX) ? h.slice(HASH_PREFIX.length) : null);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const open = useCallback((p: Product) => {
    history.replaceState(null, "", `${HASH_PREFIX}${p.slug}`);
    setOpenSlug(p.slug);
  }, []);

  const close = useCallback(() => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setOpenSlug(null);
  }, []);

  const startInquiry = useCallback(
    (kind: InquiryKind, productName = "") => {
      setPrefill({ kind, product: productName, nonce: Date.now() });
      history.replaceState(null, "", "#contact");
      setOpenSlug(null);
      requestAnimationFrame(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }));
    },
    [],
  );

  // links with data-kind (e.g. "Request a custom piece") pre-select the form type
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("a[data-kind]");
      if (!el) return;
      e.preventDefault();
      startInquiry(el.dataset.kind as InquiryKind);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [startInquiry]);

  // document title per open piece
  useEffect(() => {
    document.title = product ? `${product.name} — A.S. Touch` : BASE_TITLE;
  }, [product]);

  // structured data for the collection (SEO) — rebuilt from the JSON
  useEffect(() => {
    if (!products.length) return;
    const abs = (p: string) => new URL(asset(p), window.location.href).href;
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "A.S. Touch collection",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          description: p.description || p.tagline,
          image: abs(p.image),
          category: p.category,
          brand: { "@type": "Brand", name: "A.S. Touch" },
          material: p.materials.join(", ") || undefined,
        },
      })),
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "ld-products";
    s.text = JSON.stringify(ld);
    document.getElementById("ld-products")?.remove();
    document.head.appendChild(s);
    return () => s.remove();
  }, [products]);

  return (
    <div className="grain">
      <a
        href="#collection"
        className="sr-only z-[200] rounded-full bg-ink px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Header announcement={site.announcement} />
      <main>
        <Hero />
        <Marquee />
        <Collection products={products} state={state} onOpen={open} />
        <Craft />
        <Story />
        <Order />
        <Testimonials items={site.testimonials} />
        <Faq items={site.faq} />
        <Contact site={site} products={products} prefill={prefill} />
      </main>
      <Footer site={site} />

      {product && (
        <ProductModal
          product={product}
          products={products}
          onClose={close}
          onNavigate={open}
          onEnquire={(p) => startInquiry("product", p.name)}
          email={site.contact.email}
        />
      )}
    </div>
  );
}
