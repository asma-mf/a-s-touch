import { ArrowRight } from "lucide-react";
import type { FaqItem, Testimonial } from "../types";

const steps = [
  { n: "01", title: "Browse", text: "Explore the collection and save the pieces — or ideas — that speak to you." },
  { n: "02", title: "Message us", text: "Send an enquiry, email, or DM on Instagram. Tell us what you love and where you are." },
  { n: "03", title: "Design together", text: "We confirm colours, details, price, timing and delivery to your country — personally." },
  { n: "04", title: "Made & sent", text: "Your piece is painted or knotted by hand, carefully packed and on its way to you." },
];

export function Order() {
  return (
    <section id="order" className="bg-cream py-24 md:py-32" aria-labelledby="order-title">
      <div className="container-x">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="eyebrow">How to order</p>
          <h2 id="order-title" className="mt-4 text-4xl font-light md:text-6xl">
            No checkout. <em className="italic">Just conversation.</em>
          </h2>
          <p className="mt-6 text-lg text-ink-soft">
            Because every bag is handmade, we don’t sell through an online cart. Instead, you speak with us directly —
            so your piece is exactly what you imagined.
          </p>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className="reveal relative rounded-[1.75rem] bg-ivory p-8"
              style={{ "--d": `${i * 100}ms` } as React.CSSProperties}
            >
              <span className="font-display text-6xl font-light italic text-clay/30">{s.n}</span>
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="reveal mt-12 text-center">
          <a href="#contact" className="btn btn-primary group">
            Start your enquiry
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section className="container-x py-24 md:py-28" aria-labelledby="kind-words">
      <h2 id="kind-words" className="reveal text-center text-4xl font-light md:text-5xl">
        Kind <em className="italic">words</em>
      </h2>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((t) => (
          <li key={t.name + t.quote.slice(0, 12)} className="reveal rounded-[1.75rem] border border-ink/10 p-8">
            <blockquote className="font-display text-xl italic leading-snug">“{t.quote}”</blockquote>
            <p className="mt-5 text-sm text-muted">
              — {t.name}
              {t.location ? `, ${t.location}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="container-x py-24 md:py-32" aria-labelledby="faq-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div className="reveal">
          <p className="eyebrow">Good to know</p>
          <h2 id="faq-title" className="mt-4 text-4xl font-light md:text-5xl">
            Questions, <em className="italic">answered</em>
          </h2>
          <p className="mt-5 text-ink-soft">
            Something else on your mind? Send us a message — we reply personally.
          </p>
        </div>
        <div className="reveal divide-y divide-ink/15 border-y border-ink/15">
          {items.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 font-display text-xl md:text-2xl">
                {f.q}
                <span className="faq-plus grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/25 text-lg transition-transform duration-300" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="pb-6 pr-12 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
