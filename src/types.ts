export interface Product {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  gallery: string[];
  alt: string;
  technique: string;
  materials: string[];
  colors: string[];
  availability: string;
  price: string;
  badge: string;
  featured: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  location?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SiteConfig {
  brand: { name: string; tagline: string };
  contact: { email: string; phone: string; instagram: string; whatsapp: string };
  discordWebhookUrl: string;
  announcement: string;
  testimonials: Testimonial[];
  faq: FaqItem[];
}

export type InquiryKind = "product" | "custom" | "feedback";

export interface InquiryPrefill {
  kind: InquiryKind;
  product: string;
  nonce: number;
}
