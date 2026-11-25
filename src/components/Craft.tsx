import { Brush, Sparkles } from "lucide-react";

const panels = [
  {
    icon: Brush,
    kicker: "Technique one",
    title: "Hand-painted",
    image: "images/process-painting.jpg",
    alt: "An artist's hand painting a floral design onto a canvas bag with a fine brush",
    body: "Every design begins as a feeling, not a pattern. We paint directly onto the fabric with a brush, building colour layer by layer — so the texture of each stroke stays visible and no two bags are ever identical.",
    points: ["Painted freehand, no stencils or prints", "Rich, layered colour on natural fabric", "Designs adapted to your palette on request"],
  },
  {
    icon: Sparkles,
    kicker: "Technique two",
    title: "Hand-knotted",
    image: "images/process-knotting.jpg",
    alt: "Hands tying macramé knots in thick natural cotton cord",
    body: "Knot by knot, cotton cord becomes structure, pattern and shape. Macramé is slow, tactile craft — each diamond, each fringe is tied by hand, giving our bags a sculptural beauty that machines can’t reproduce.",
    points: ["Thousands of individual hand-tied knots", "Natural cotton cord and warm wooden details", "Light, airy and surprisingly strong"],
  },
];

export function Craft() {
  return (
    <section id="craft" className="on-dark relative overflow-hidden bg-ink py-24 text-ivory md:py-32" aria-labelledby="craft-title">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 h-[32rem] w-[32rem] rounded-full bg-clay/25 blur-3xl" />
      <div className="container-x relative">
        <div className="reveal max-w-3xl">
          <p className="eyebrow !text-saffron">The craft</p>
          <h2 id="craft-title" className="mt-4 text-4xl font-light md:text-6xl">
            Two slow crafts. <em className="italic text-saffron">One signature.</em>
          </h2>
          <p className="mt-6 text-lg text-ivory/75">
            In a world of mass production, we choose time. Everything you see here is made by one pair of hands —
            painted, knotted, finished and checked with care.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:mt-20 md:gap-14">
          {panels.map((p, i) => (
            <article
              key={p.title}
              className={`reveal grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}
            >
              <div className="relative overflow-hidden rounded-[2rem]">
                <img
                  src={p.image}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[1500ms] hover:scale-105"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 text-saffron">
                  <p.icon size={22} aria-hidden="true" />
                  <span className="eyebrow !text-saffron">{p.kicker}</span>
                </div>
                <h3 className="mt-4 text-4xl font-light md:text-5xl">{p.title}</h3>
                <p className="mt-5 text-ivory/75">{p.body}</p>
                <ul className="mt-6 space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-ivory/90">
                      <span className="mt-2.5 h-px w-6 shrink-0 bg-saffron" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
