import type { SiteConfig } from "../types";
import { InstagramIcon } from "./Logo";

export function Footer({ site }: { site: SiteConfig }) {
  const { contact } = site;
  return (
    <footer className="on-dark bg-ink text-ivory">
      <div className="container-x border-t border-ivory/15 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl">
              A.S. <em className="font-light italic text-saffron">Touch</em>
            </p>
            <p className="mt-3 max-w-xs text-sm text-ivory/65">
              Hand-painted &amp; hand-knotted bags, made to order with love for customers around the world.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-xs uppercase tracking-widest text-ivory/50">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["#collection", "Collection"],
                ["#craft", "Our craft"],
                ["#story", "Our story"],
                ["#order", "How to order"],
                ["#faq", "FAQ"],
                ["#contact", "Contact & feedback"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="text-ivory/80 hover:text-saffron">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-xs uppercase tracking-widest text-ivory/50">Say hello</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`mailto:${contact.email}`} className="text-ivory/80 hover:text-saffron">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contact.phone}`} className="text-ivory/80 hover:text-saffron">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${contact.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-ivory/80 hover:text-saffron"
                >
                  <InstagramIcon className="h-4 w-4" /> @{contact.instagram}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-ivory/15 pt-6 text-xs text-ivory/50 md:flex-row">
          <p>© {new Date().getFullYear()} A.S. Touch. All designs handmade &amp; original.</p>
          <p>Orders are arranged personally — this website does not process payments.</p>
        </div>
      </div>
    </footer>
  );
}
