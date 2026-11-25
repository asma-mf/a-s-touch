import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "./Logo";

const links = [
  { href: "#collection", label: "Collection" },
  { href: "#craft", label: "Craft" },
  { href: "#story", label: "Our story" },
  { href: "#order", label: "How to order" },
  { href: "#faq", label: "FAQ" },
];

export function Header({ announcement }: { announcement: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="bg-ink px-4 py-2.5 text-center text-[0.8rem] tracking-wide text-ivory/90">
        <p className="mx-auto max-w-4xl">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-saffron align-middle" aria-hidden="true" />
          {announcement}
        </p>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "border-b border-ink/10 bg-ivory/85 shadow-[0_8px_30px_-20px_rgba(35,28,26,0.5)] backdrop-blur-md"
            : "border-b border-transparent bg-ivory"
        }`}
      >
        <nav aria-label="Main" className="container-x flex h-[4.5rem] items-center justify-between">
          <a href="#top" className="flex items-center gap-3 text-ink" aria-label="A.S. Touch — home">
            <LogoMark />
            <span className="font-display text-[1.4rem] tracking-tight">
              A.S. <em className="font-light italic">Touch</em>
            </span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative py-2 text-[0.95rem] text-ink-soft transition-colors hover:text-clay"
                >
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-clay transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#contact" className="btn btn-primary hidden !min-h-0 !py-2.5 sm:inline-flex">
              Enquire
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            className="fade-in absolute inset-x-0 top-full z-40 h-[calc(100dvh-4.5rem)] overflow-y-auto bg-ivory px-6 pb-10 pt-8 lg:hidden"
          >
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-ink/10 py-4 font-display text-3xl"
                  >
                    {l.label}
                    <span className="text-sm text-clay">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-8 w-full">
              Send an enquiry
            </a>
          </div>
        )}
      </header>
    </>
  );
}
