import type { InquiryKind } from "../types";

/**
 * Frontend-only Discord webhook delivery.
 *
 * SECURITY MODEL (honest version): a webhook URL placed in a static site is
 * visible to anyone who views the page source. A Discord webhook can only
 * POST messages to ONE channel — it cannot read messages, see members or
 * change the server — so exposure is limited to spam. We therefore:
 *   - validate that the URL is a genuine Discord webhook endpoint,
 *   - post only structured, length-limited embeds (never raw HTML),
 *   - disable ALL mention parsing so nobody can ping @everyone/@here/roles,
 *   - add a honeypot + client-side rate limiting to stop casual abuse,
 *   - never log or echo the URL.
 * If it is ever abused: delete the webhook in Discord and create a new one.
 */

const WEBHOOK_RE =
  /^https:\/\/(?:(?:canary|ptb)\.)?(?:discord|discordapp)\.com\/api\/(?:v\d+\/)?webhooks\/\d{15,25}\/[\w-]{20,}$/;

export const isValidWebhook = (url: string) => WEBHOOK_RE.test(url.trim());

export interface InquiryPayload {
  kind: InquiryKind;
  name: string;
  email: string;
  country: string;
  product: string;
  message: string;
  rating: number;
}

const RATE_KEY = "ast.inquiry.log";
const MIN_GAP_MS = 30_000;
const MAX_PER_HOUR = 4;

export class RateLimitError extends Error {
  constructor(public waitSeconds: number) {
    super("rate-limited");
  }
}

function readLog(): number[] {
  try {
    const arr = JSON.parse(localStorage.getItem(RATE_KEY) || "[]");
    const cutoff = Date.now() - 3_600_000;
    return Array.isArray(arr) ? arr.filter((t) => typeof t === "number" && t > cutoff) : [];
  } catch {
    return [];
  }
}

export function checkRateLimit(): void {
  const log = readLog();
  const now = Date.now();
  const last = log[log.length - 1];
  if (last && now - last < MIN_GAP_MS) {
    throw new RateLimitError(Math.ceil((MIN_GAP_MS - (now - last)) / 1000));
  }
  if (log.length >= MAX_PER_HOUR) {
    throw new RateLimitError(Math.ceil((log[0] + 3_600_000 - now) / 1000));
  }
}

function recordSubmission() {
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify([...readLog(), Date.now()]));
  } catch {
    /* storage unavailable – ignore */
  }
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
/** Neutralise markdown-significant mention tokens as defence in depth. */
const clean = (s: string) => s.replace(/@(everyone|here)/gi, "@\u200b$1").replace(/<@[!&]?\d+>/g, "[mention]");

const META: Record<InquiryKind, { title: string; color: number }> = {
  product: { title: "🧶 New product enquiry", color: 0xb4492d },
  custom: { title: "🎨 New custom order request", color: 0xd8962b },
  feedback: { title: "💬 New customer feedback", color: 0x7c8b6f },
};

export async function sendToDiscord(webhookUrl: string, p: InquiryPayload): Promise<void> {
  if (!isValidWebhook(webhookUrl)) throw new Error("invalid-webhook");
  checkRateLimit();

  const fields = [
    { name: "Name", value: clip(clean(p.name) || "—", 200), inline: true },
    { name: "Email", value: clip(clean(p.email) || "—", 200), inline: true },
    { name: "Country", value: clip(clean(p.country) || "—", 100), inline: true },
  ];
  if (p.product) fields.push({ name: "Piece", value: clip(clean(p.product), 200), inline: false });
  if (p.kind === "feedback" && p.rating > 0) {
    fields.push({
      name: "Rating",
      value: "★".repeat(p.rating) + "☆".repeat(5 - p.rating) + ` (${p.rating}/5)`,
      inline: false,
    });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(webhookUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        username: "A.S. Touch Website",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: META[p.kind].title,
            color: META[p.kind].color,
            description: clip(clean(p.message), 3500),
            fields,
            footer: { text: "Sent from the A.S. Touch website" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    if (res.status === 429) throw new Error("discord-busy");
    if (!res.ok) throw new Error(`discord-${res.status}`);
    recordSubmission();
  } finally {
    clearTimeout(timer);
  }
}

/** Fallback used when no webhook is configured: open the visitor's mail app. */
export function buildMailto(to: string, p: InquiryPayload): string {
  const subjects: Record<InquiryKind, string> = {
    product: "Product enquiry",
    custom: "Custom order request",
    feedback: "Feedback",
  };
  const subject = `${subjects[p.kind]}${p.product ? ` – ${p.product}` : ""}`;
  const body = [
    p.message,
    "",
    `Name: ${p.name}`,
    p.country ? `Country: ${p.country}` : "",
    p.kind === "feedback" && p.rating ? `Rating: ${p.rating}/5` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
