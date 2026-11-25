import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, Mail, MessageCircle, Phone, Send, Star } from "lucide-react";
import type { InquiryKind, InquiryPrefill, Product, SiteConfig } from "../types";
import { InstagramIcon } from "./Logo";
import { RateLimitError, buildMailto, isValidWebhook, sendToDiscord, type InquiryPayload } from "../lib/discord";

const kinds: { id: InquiryKind; label: string; hint: string }[] = [
  { id: "product", label: "Product enquiry", hint: "Ask about a piece, sizes, colours or delivery." },
  { id: "custom", label: "Custom order", hint: "Tell us your idea — we’ll design it with you." },
  { id: "feedback", label: "Feedback", hint: "Share what you think of our work or this website." },
];

type Status = "idle" | "sending" | "sent" | "mailto" | "error";

export function Contact({
  site,
  products,
  prefill,
}: {
  site: SiteConfig;
  products: Product[];
  prefill: InquiryPrefill;
}) {
  const { contact } = site;
  const [kind, setKind] = useState<InquiryKind>("product");
  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!prefill.nonce) return;
    setKind(prefill.kind);
    setProduct(prefill.product);
    setStatus("idle");
  }, [prefill]);

  const payload = (): InquiryPayload => ({
    kind,
    name: name.trim(),
    email: email.trim(),
    country: country.trim(),
    product,
    message: message.trim(),
    rating,
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e.email = "Please enter a valid email address.";
    if (message.trim().length < 10) e.message = "Please write at least a short message (10+ characters).";
    if (kind === "feedback" && rating === 0) e.rating = "Please choose a star rating.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const reset = () => {
    setName("");
    setEmail("");
    setCountry("");
    setMessage("");
    setRating(0);
    setProduct("");
    setStatus("idle");
    setError("");
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    if (hp) {
      // honeypot tripped: pretend success, send nothing
      setStatus("sent");
      return;
    }
    const data = payload();
    if (!isValidWebhook(site.discordWebhookUrl)) {
      window.location.href = buildMailto(contact.email, data);
      setStatus("mailto");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      await sendToDiscord(site.discordWebhookUrl, data);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      if (err instanceof RateLimitError) {
        const w = err.waitSeconds;
        setError(
          `Thank you — we’ve received your recent message. Please wait ${
            w > 90 ? `${Math.ceil(w / 60)} minutes` : `${w} seconds`
          } before sending another.`,
        );
      } else {
        setError(
          "Sorry, your message couldn’t be sent just now. Please try again in a moment, or reach us by email or Instagram below.",
        );
      }
    }
  };

  const activeKind = kinds.find((k) => k.id === kind)!;
  const errId = (k: string) => (errors[k] ? `err-${k}` : undefined);

  return (
    <section id="contact" className="on-dark relative overflow-hidden bg-ink text-ivory" aria-labelledby="contact-title">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-20 h-[30rem] w-[30rem] rounded-full bg-saffron/15 blur-3xl" />
      <div className="container-x relative grid gap-14 py-24 md:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="reveal">
          <p className="eyebrow !text-saffron">Contact &amp; feedback</p>
          <h2 id="contact-title" className="mt-4 text-4xl font-light md:text-6xl">
            Let’s make something <em className="italic text-saffron">yours</em>
          </h2>
          <p className="mt-6 text-lg text-ivory/75">
            Orders, custom art, questions or kind words — we read every message ourselves and reply personally. We
            welcome customers from all over the world.
          </p>

          <ul className="mt-10 space-y-5">
            <li>
              <a href={`mailto:${contact.email}`} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 transition group-hover:bg-saffron group-hover:text-ink">
                  <Mail size={20} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-ivory/55">Email</span>
                  {contact.email}
                </span>
              </a>
            </li>
            <li>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 transition group-hover:bg-saffron group-hover:text-ink">
                  <Phone size={20} />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-ivory/55">Phone</span>
                  {contact.phone}
                </span>
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${contact.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 transition group-hover:bg-saffron group-hover:text-ink">
                  <InstagramIcon />
                </span>
                <span>
                  <span className="block text-xs uppercase tracking-widest text-ivory/55">Instagram</span>@{contact.instagram}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
              </a>
            </li>
            {contact.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 transition group-hover:bg-saffron group-hover:text-ink">
                    <MessageCircle size={20} />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-widest text-ivory/55">WhatsApp</span>
                    Chat with us
                  </span>
                </a>
              </li>
            )}
          </ul>

          <p className="mt-10 rounded-2xl border border-ivory/15 p-5 text-sm text-ivory/70">
            <strong className="font-medium text-ivory">Please note:</strong> this website doesn’t take payments or
            orders. We confirm every order personally, so you’ll always know the price, timing and delivery before
            anything is made.
          </p>
        </div>

        <div className="reveal rounded-[2rem] bg-ivory p-6 text-ink sm:p-10">
          {status === "sent" || status === "mailto" ? (
            <div className="fade-in py-10 text-center" role="status">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage text-ivory">
                <Check size={30} />
              </span>
              <h3 className="mt-6 text-3xl">
                {status === "sent" ? "Thank you — message received" : "Almost there!"}
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-ink-soft">
                {status === "sent"
                  ? kind === "feedback"
                    ? "Your feedback means a great deal to us. Thank you for taking the time."
                    : "We’ll read it carefully and reply to you personally, usually within a couple of days."
                  : "Your email app should now be open with your message ready. Just press send and we’ll reply personally."}
              </p>
              <button onClick={reset} className="btn btn-ghost mt-8">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate aria-label="Enquiry and feedback form">
              <fieldset>
                <legend className="mb-3 text-sm text-muted">What would you like to do?</legend>
                <div className="grid gap-2 sm:grid-cols-3" role="radiogroup">
                  {kinds.map((k) => (
                    <label
                      key={k.id}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-clay ${
                        kind === k.id ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="kind"
                        value={k.id}
                        checked={kind === k.id}
                        onChange={() => setKind(k.id)}
                        className="sr-only"
                      />
                      {k.label}
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted" aria-live="polite">
                  {activeKind.hint}
                </p>
              </fieldset>

              <div className="mt-8 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-name" className="text-sm text-muted">Your name *</label>
                  <input
                    id="f-name"
                    className="field"
                    autoComplete="name"
                    value={name}
                    maxLength={80}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errId("name")}
                  />
                  {errors.name && <p id="err-name" className="mt-1 text-sm text-clay-deep">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="f-email" className="text-sm text-muted">Email *</label>
                  <input
                    id="f-email"
                    type="email"
                    className="field"
                    autoComplete="email"
                    value={email}
                    maxLength={120}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errId("email")}
                  />
                  {errors.email && <p id="err-email" className="mt-1 text-sm text-clay-deep">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="f-country" className="text-sm text-muted">Country</label>
                  <input
                    id="f-country"
                    className="field"
                    autoComplete="country-name"
                    value={country}
                    maxLength={60}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="f-product" className="text-sm text-muted">
                    {kind === "custom" ? "Inspired by (optional)" : "Which piece? (optional)"}
                  </label>
                  <select id="f-product" className="field" value={product} onChange={(e) => setProduct(e.target.value)}>
                    <option value="">{kind === "custom" ? "A brand-new design" : "No specific piece"}</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {kind === "feedback" && (
                <div className="mt-6 fade-in">
                  <p id="rating-label" className="text-sm text-muted">How would you rate your experience? *</p>
                  <div className="mt-2 flex gap-1" role="radiogroup" aria-labelledby="rating-label">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={rating === n}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        onClick={() => setRating(n)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          size={30}
                          strokeWidth={1.5}
                          className={n <= rating ? "fill-saffron text-saffron" : "text-ink/30"}
                        />
                      </button>
                    ))}
                  </div>
                  {errors.rating && <p className="mt-1 text-sm text-clay-deep">{errors.rating}</p>}
                </div>
              )}

              <div className="mt-6">
                <label htmlFor="f-message" className="text-sm text-muted">
                  {kind === "custom" ? "Describe your idea *" : kind === "feedback" ? "Your feedback *" : "Your message *"}
                </label>
                <textarea
                  id="f-message"
                  className="field min-h-32 resize-y"
                  rows={4}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    kind === "custom"
                      ? "Colours, style, occasion, inspiration…"
                      : kind === "feedback"
                        ? "What did you love? What could be better?"
                        : "Tell us what you’d like to know…"
                  }
                  aria-invalid={!!errors.message}
                  aria-describedby={errId("message")}
                />
                <div className="flex justify-between text-sm">
                  <span id="err-message" className="text-clay-deep">{errors.message}</span>
                  <span className="text-muted">{message.length}/2000</span>
                </div>
              </div>

              {/* honeypot — hidden from people and assistive tech */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
                </label>
              </div>

              {status === "error" && (
                <p role="alert" className="mt-5 flex gap-3 rounded-xl bg-clay/10 p-4 text-sm text-clay-deep">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <span>
                    {error}{" "}
                    <a className="underline" href={buildMailto(contact.email, payload())}>
                      Send by email instead
                    </a>
                  </span>
                </p>
              )}

              <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-7 w-full disabled:opacity-70">
                {status === "sending" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} /> {kind === "feedback" ? "Send feedback" : "Send enquiry"}
                  </>
                )}
              </button>
              <p className="mt-4 text-center text-xs text-muted">
                We only use your details to reply to you. This is an enquiry, not a purchase — no payment is taken.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
