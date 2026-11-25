import { HeartHandshake, Globe, Palette, ShieldCheck } from "lucide-react";

const timeline = [
  { year: "2023", text: "A.S. Touch begins as a small handmade art hobby." },
  { year: "2024", text: "We start painting bags for our first customers — and the orders keep coming." },
  { year: "2025", text: "Knotting joins painting, and we open our doors to customers around the world." },
];

const promises = [
  { icon: Palette, title: "Truly one of a kind", text: "Painted and knotted by hand, so your bag is never mass-produced." },
  { icon: HeartHandshake, title: "Personal service", text: "You talk directly with the maker about every detail." },
  { icon: Globe, title: "Welcoming the world", text: "We happily discuss delivery to your country." },
  { icon: ShieldCheck, title: "No surprises", text: "Design, price and timing are agreed with you before we begin." },
];

export function Story() {
  return (
    <section id="story" className="container-x py-24 md:py-32" aria-labelledby="story-title">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="reveal relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream">
            <img
              src="images/atelier-flatlay.jpg"
              alt="Flat lay of paints, brushes, cotton cord and pearls on ivory linen from the A.S. Touch atelier"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 rounded-2xl bg-clay px-6 py-5 text-ivory shadow-xl md:-right-8">
            <p className="font-display text-3xl italic leading-none">Made with love.</p>
            <p className="mt-1 text-sm text-ivory/80">Since 2023</p>
          </div>
        </div>

        <div className="reveal">
          <p className="eyebrow">Our story</p>
          <h2 id="story-title" className="mt-4 text-4xl font-light md:text-6xl">
            From a quiet hobby to a <em className="italic">little studio</em> of colour
          </h2>
          <div className="mt-6 space-y-4 text-lg text-ink-soft">
            <p>
              A.S. Touch is about bringing art into everyday life. What began as painting for the joy of it has grown
              into a studio of hand-painted and hand-knotted bags, made with creativity, patience and care.
            </p>
            <p>
              Each piece starts with an idea — sometimes ours, sometimes yours — and ends as something you won’t find
              anywhere else. That is the A.S. Touch.
            </p>
          </div>

          <ol className="mt-10 space-y-0 border-l border-ink/20">
            {timeline.map((t) => (
              <li key={t.year} className="relative pb-7 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-2.5 h-2.5 w-2.5 rounded-full bg-clay" aria-hidden="true" />
                <span className="font-display text-2xl text-clay">{t.year}</span>
                <p className="text-ink-soft">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ul className="mt-24 grid gap-px overflow-hidden rounded-[2rem] border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
        {promises.map((p, i) => (
          <li key={p.title} className="reveal bg-ivory p-8" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
            <p.icon className="text-clay" size={28} strokeWidth={1.5} aria-hidden="true" />
            <h3 className="mt-5 text-2xl">{p.title}</h3>
            <p className="mt-2 text-[0.95rem] text-muted">{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
