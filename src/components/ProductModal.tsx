import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Mail, X } from "lucide-react";
import type { Product } from "../types";
import { asset } from "../lib/content";

interface Props {
  product: Product;
  products: Product[];
  onClose: () => void;
  onNavigate: (p: Product) => void;
  onEnquire: (p: Product) => void;
  email: string;
}

export function ProductModal({ product, products, onClose, onNavigate, onEnquire, email }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState(0);
  const images = useMemo(() => [product.image, ...product.gallery].filter(Boolean), [product]);
  const idx = products.findIndex((p) => p.slug === product.slug);

  useEffect(() => setActive(0), [product.slug]);

  const step = (d: number) => {
    if (products.length < 2) return;
    onNavigate(products[(idx + d + products.length) % products.length]);
  };

  // focus management, scroll lock, keyboard
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return step(1);
      if (e.key === "ArrowLeft") return step(-1);
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const details: [string, string][] = [
    ["Technique", product.technique],
    ["Materials", product.materials.join(" · ")],
    ["Colours", product.colors.join(" · ")],
    ["Availability", product.availability],
  ].filter(([, v]) => v) as [string, string][];

  const mail = `mailto:${email}?subject=${encodeURIComponent("Enquiry: " + product.name)}`;

  return (
    <div
      className="fade-in fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className="dialog-in relative grid max-h-[94dvh] w-full max-w-6xl overflow-y-auto rounded-t-[2rem] bg-ivory sm:rounded-[2rem] md:grid-cols-[1.1fr_1fr] md:overflow-hidden"
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-ivory/95 shadow-md transition hover:bg-clay hover:text-ivory"
        >
          <X size={20} />
        </button>

        {/* gallery */}
        <div className="relative bg-cream md:max-h-[94dvh]">
          <div className="aspect-[4/5] md:aspect-auto md:h-full">
            <img
              key={images[active]}
              src={asset(images[active])}
              alt={active === 0 ? product.alt : `${product.name} — detail ${active}`}
              className="fade-in h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 px-4">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-current={i === active}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                    i === active ? "border-ivory" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img src={asset(src)} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div className="flex flex-col p-6 sm:p-8 md:max-h-[94dvh] md:overflow-y-auto md:p-12">
          <p className="eyebrow">{product.category}</p>
          <h2 id="product-title" className="mt-3 text-4xl font-light md:text-5xl">
            {product.name}
          </h2>
          {product.tagline && <p className="mt-3 font-display text-xl italic text-clay-deep">{product.tagline}</p>}
          <p className="mt-6 text-ink-soft">{product.description}</p>

          <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-[0.95rem]">
            {details.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
              <dt className="text-muted">Price</dt>
              <dd>{product.price || "On request — we’ll quote you personally"}</dd>
            </div>
          </dl>

          <div className="mt-6 md:sticky md:bottom-0 md:-mx-12 md:mt-auto md:border-t md:border-ink/10 md:bg-ivory md:px-12 md:pb-4 md:pt-5">
            <div className="rounded-2xl bg-cream p-4 text-sm text-ink-soft">
            <strong className="font-medium text-ink">Not sold online.</strong> Each piece is handmade, so we like to
            talk first. Message us to discuss colours, details, delivery to your country and your order.
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button className="btn btn-primary flex-1" onClick={() => onEnquire(product)}>
              Enquire about this piece
            </button>
            <a href={mail} className="btn btn-ghost" aria-label={`Email us about ${product.name}`}>
              <Mail size={18} /> Email
            </a>
            </div>
          </div>

          {products.length > 1 && (
            <div className="flex items-center justify-between pt-6 text-sm">
              <button onClick={() => step(-1)} className="flex items-center gap-1 text-muted hover:text-clay">
                <ChevronLeft size={18} /> Previous
              </button>
              <span className="text-muted">
                {idx + 1} / {products.length}
              </span>
              <button onClick={() => step(1)} className="flex items-center gap-1 text-muted hover:text-clay">
                Next <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
