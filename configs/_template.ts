import { ThemeConfig } from "@/lib/theme"

export const template: ThemeConfig = {
  slug: "client-slug",
  password: "preview2026",
  brand: {
    name: "Client Business Name",
    tagline: "Their Tagline",
    phone: "(000) 000-0000",
    email: "hello@client.com",
    city: "City",
    state: "ST",
  },
  colors: {
    primary: "",
    primaryHover: "",
    secondary: "",
    background: "#FAFAF9",
    surface: "#F5F4F2",
    text: "#1C1917",
    textMuted: "#78716C",
    border: "#E7E5E4",
  },
  fonts: {
    heading: "Playfair Display",
    body: "Inter",
  },
  hero: {
    headline: "",
    subheadline: "",
    cta: "Get Started",
    ctaSecondary: "Learn More",
    bullets: [],
  },
  stats: [],
  partners: [],
  services: [],
  whyUs: { headline: "", points: [] },
  process: { headline: "How It Works", steps: [] },
  testimonials: [],
  serviceArea: { headline: "", cities: [] },
  cta: { headline: "", subtext: "", buttonText: "" },
  footer: { tagline: "", links: [] },
}
