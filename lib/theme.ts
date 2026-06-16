export interface ThemeConfig {
  slug: string
  password?: string // optional — if set, renders PasswordGate first
  brand: {
    name: string
    tagline: string
    logo?: string // path to /public/logos/{slug}.svg or .png
    phone: string
    email: string
    city: string
    state: string
  }
  colors: {
    primary: string // main brand color (CTAs, accents)
    primaryHover: string
    secondary: string // supporting color
    background: string // page background
    surface: string // card/section backgrounds
    text: string // body text
    textMuted: string // secondary text
    border: string
  }
  fonts: {
    heading: string // Google Font name
    body: string // Google Font name
  }
  hero: {
    headline: string
    subheadline: string
    cta: string // primary CTA button text
    ctaSecondary?: string
    backgroundImage?: string // /images/{slug}/hero.jpg
    backgroundVideo?: string // /images/{slug}/hero.mp4 — takes priority over backgroundImage
    bullets?: string[] // short value-prop lines shown under the headline
  }
  stats: {
    value: string
    label: string
  }[]
  partners?: {
    name: string
  }[]
  services: {
    title: string
    description: string
    icon: string // lucide icon name
  }[]
  whyUs: {
    headline: string
    points: {
      title: string
      description: string
    }[]
    images?: string[] // one photo per group of 3 points, /images/{slug}/why-us-1.jpg
  }
  process: {
    headline: string
    steps: {
      number: string
      title: string
      description: string
    }[]
    images?: string[] // photos cycled into each step's circle, /images/{slug}/process-1.jpg
  }
  testimonials: {
    name: string
    location: string
    text: string
    rating: number
  }[]
  serviceArea: {
    headline: string
    cities: string[]
  }
  cta: {
    headline: string
    subtext: string
    buttonText: string
  }
  footer: {
    tagline: string
    links: { label: string; href: string }[]
  }
}
