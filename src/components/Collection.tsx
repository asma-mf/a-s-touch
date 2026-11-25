import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../types";
import { asset, type LoadState } from "../lib/content";

function ProductCard({ p, index, onOpen }: { p: Product; index: number; onOpen: (p: Product) => void }) {
  const tall = index % 3 === 1;
  return (
    <li className="reveal" style={{ "--d": `${(index % 3) * 90}ms` } as React.CSSProperties}>
      <button
        onClick={() => onOpen(p)}
        className="group block w-full text-left"
        aria-label={`View ${p.name} — ${p.category}`}
      >
        <div
          className={`relative overflow-hidden rounded-[1.75rem] bg-cream ${
            tall ? "aspect-[4/5] md:aspect-[4/5.6]" : "aspect-[4/5]"
          }`}
        >
          <img
            src={asset(p.image)}
            alt={p.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {p.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-ivory/90 px-3.5 py-1.5 text-xs font-medium tracking-wide text-ink backdrop-blur">
              {p.badge}
            </span>
          )}
          <span className="absolute bottom-4 right-4 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-ivory text-ink opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow !text-[0.7rem]">{p.category}</p>
            <h3 className="mt-2 text-2xl transition-colors group-hover:text-clay">{p.name}</h3>
            {p.tagline && <p className="mt-1.5 text-[0.95rem] text-muted">{p.tagline}</p>}
          </div>
          <p className="mt-1 shrink-0 text-right text-sm text-ink-soft">{p.price || "Price on request"}</p>
        </div>
      </button>
    </li>
  );
}

export function Collection({
  products,
  state,
  onOpen,
}: {
  products: Product[];
  state: LoadState;
  onOpen: (p: Product) => void;
}) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const shown = filter === "All" ? products : products.filter((p) => p.category === filter);

  return (
    <section id="collection" className="container-x py-24 md:py-32" aria-labelledby="collection-title">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">The collection</p>
          <h2 id="collection-title" className="mt-4 text-4xl font-light md:text-6xl">
            Pieces made to be <em className="italic">noticed</em>
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            Browse our current designs. Love one? Tell us — we’ll make yours by hand, in the colours and details you
            choose.
          </p>
        </div>

        {categories.length > 2 && (
          <div className="reveal -mx-1 flex flex-wrap gap-2" role="group" aria-label="Filter by technique">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                aria-pressed={filter === c}
                className={`rounded-full border px-5 py-2.5 text-sm transition-all ${
                  filter === c
                    ? "border-ink bg-ink text-ivory"
                    : "border-ink/20 text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {state === "loading" && (
        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="aspect-[4/5] animate-pulse rounded-[1.75rem] bg-cream" />
          ))}
        </ul>
      )}
      {state === "error" && (
        <p className="mt-14 rounded-2xl bg-cream p-8 text-center" role="alert">
          Our collection is taking a moment to load. Please refresh the page — or message us and we’ll send you our
          latest pieces directly.
        </p>
      )}
      {state === "ready" && products.length === 0 && (
        <p className="mt-14 rounded-2xl bg-cream p-8 text-center">
          New pieces are being made right now. Send us an enquiry to hear about what’s coming.
        </p>
      )}

      {state === "ready" && products.length > 0 && (
        <ul key={filter} className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} p={p} index={i} onOpen={onOpen} />
          ))}
        </ul>
      )}

      <div className="reveal mt-20 flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-ink p-8 text-ivory md:flex-row md:p-12 on-dark">
        <div className="max-w-xl text-center md:text-left">
          <h3 className="text-3xl font-light md:text-4xl">
            Don’t see <em className="italic">exactly</em> what you imagined?
          </h3>
          <p className="mt-3 text-ivory/75">
            We love custom art orders — your colours, your story, your bag. Describe your idea and we’ll design it
            together.
          </p>
        </div>
        <a href="#contact" data-kind="custom" className="btn btn-light shrink-0">
          Request a custom piece
        </a>
      </div>
    </section>
  );
}
