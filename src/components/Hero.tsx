import { ArrowRight } from "lucide-react";

function RotatingBadge() {
  const text = "HAND-PAINTED • HAND-KNOTTED • ONE OF A KIND • ";
  return (
    <div className="relative grid h-32 w-32 place-items-center rounded-full bg-ink text-ivory shadow-xl md:h-40 md:w-40">
      <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow" aria-hidden="true">
        <defs>
          <path id="circ" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text fill="currentColor" fontSize="13" fontFamily="Jost, sans-serif" fontWeight="500">
          <textPath href="#circ" textLength="470" lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 64 64" className="h-9 w-9 md:h-11 md:w-11" aria-hidden="true">
        <path d="M20 46 32 16l12 30" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 37h14" stroke="var(--color-saffron)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* soft painted washes */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-saffron/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-clay/15 blur-3xl" />

      <div className="container-x relative grid items-center gap-12 pb-20 pt-10 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        <div className="max-w-2xl">
          <p className="eyebrow reveal in">Handmade fashion · Made to order</p>
          <h1 className="mt-6 text-[2.9rem] font-light leading-[1.02] sm:text-6xl lg:text-[5.4rem]">
            Art you can{" "}
            <em className="italic">carry.</em>
            <br />
            <span className="relative inline-block">
              Painted
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full text-clay" aria-hidden="true">
                <path d="M3 13c40-9 80-10 120-6s100 5 174-3" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>{" "}
            <span className="font-light">&amp;</span>{" "}
            <span className="relative inline-block">
              knotted
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-3 w-full text-saffron" aria-hidden="true">
                <path d="M3 10h294" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 11" />
              </svg>
            </span>
            <br />
            by hand.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ink-soft md:text-xl">
            One-of-a-kind bags from A.S. Touch — each brushstroke and every knot made by hand, then sent to
            people who love thoughtful design, wherever in the world they are.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#collection" className="btn btn-primary group">
              Explore the collection
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Start an enquiry
            </a>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft">
            {["Every piece unique", "Custom commissions", "International enquiries welcome"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="arch relative aspect-[3/4] overflow-hidden bg-cream shadow-[0_40px_80px_-40px_rgba(35,28,26,0.6)] lg:ml-auto lg:max-w-[30rem]">
            <img
              src="images/hero.jpg"
              alt="A hand-painted tote bag with terracotta, saffron and sage brushstrokes held beside a hand-knotted macramé bag"
              className="h-full w-full object-cover"
              width={720}
              height={1280}
              fetchPriority="high"
            />
          </div>
          <div className="absolute -left-2 bottom-10 animate-float md:-left-8 lg:left-0">
            <RotatingBadge />
          </div>
          <div className="absolute -right-1 top-14 hidden max-w-[11rem] rounded-2xl bg-ivory/95 p-4 text-sm shadow-xl backdrop-blur sm:block md:right-2">
            <p className="font-display text-base italic leading-tight">“No two alike.”</p>
            <p className="mt-1 text-xs text-muted">Every bag is painted or knotted just once.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = ["Hand-painted", "Hand-knotted", "One of a kind", "Custom commissions", "Made to order", "Worldwide enquiries"];
  const row = (
    <>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-2xl italic font-light md:text-3xl">{t}</span>
          <span className="text-saffron" aria-hidden="true">✦</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-cream py-5" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 pr-10">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
