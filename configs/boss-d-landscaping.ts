import { ThemeConfig } from "@/lib/theme"

export const bossDLandscaping: ThemeConfig = {
  slug: "boss-d-landscaping",
  password: "bossd2026",
  brand: {
    name: "Boss D Landscaping Services",
    tagline: "Erie's #1 Landscaping Company",
    phone: "(814) 440-9092",
    email: "bossdlandscape@gmail.com",
    city: "Erie",
    state: "PA",
  },
  colors: {
    primary: "#2E7D32",
    primaryHover: "#1B5E20",
    secondary: "#1A2E1A",
    background: "#FFFFFF",
    surface: "#F1F8F0",
    text: "#111C10",
    textMuted: "#4A5E48",
    border: "#D6E8D4",
  },
  fonts: {
    heading: "Oswald",
    body: "Inter",
  },
  hero: {
    headline: "Erie's Landscaping Experts",
    subheadline:
      "Boss D Landscaping Services transforms yards across Erie, PA with professional lawn care, landscaping design, and seasonal maintenance. Locally owned. Fully insured. Built on results.",
    cta: "Get a Free Quote",
    ctaSecondary: "Our Services",
    backgroundImage: "/images/industries/landscaping/hero.jpg",
    bullets: [],
  },
  stats: [
    { value: "10+", label: "Years in Business" },
    { value: "500+", label: "Yards Transformed" },
    { value: "100%", label: "Locally Owned" },
  ],
  partners: [
    { name: "John Deere" },
    { name: "Husqvarna" },
    { name: "PLANET" },
    { name: "Techo-Bloc" },
    { name: "NALP" },
  ],
  services: [
    {
      title: "Lawn Mowing & Maintenance",
      description:
        "Weekly and bi-weekly mowing, edging, and trimming to keep your lawn looking sharp all season long.",
      icon: "Scissors",
    },
    {
      title: "Landscaping Design",
      description:
        "Custom landscape designs that add curb appeal and value — from plant beds to full yard transformations.",
      icon: "Leaf",
    },
    {
      title: "Mulching & Edging",
      description:
        "Fresh mulch installation and clean bed edging to give your property a polished, professional finish.",
      icon: "Sprout",
    },
    {
      title: "Tree & Shrub Trimming",
      description:
        "Expert trimming and shaping to keep your trees and shrubs healthy, safe, and looking their best.",
      icon: "Trees",
    },
    {
      title: "Leaf & Debris Cleanup",
      description:
        "Spring and fall cleanups that clear leaves, debris, and dead growth so your yard is ready for every season.",
      icon: "Wind",
    },
    {
      title: "Snow Removal",
      description:
        "Reliable snow plowing and salting for Erie winters. Residential and commercial — we've got you covered.",
      icon: "Truck",
    },
  ],
  whyUs: {
    headline: "Why Erie Trusts Boss D",
    points: [
      {
        title: "Locally Owned & Operated",
        description:
          "We live and work in Erie. Every yard we touch is a yard in our own community — we treat it that way.",
      },
      {
        title: "Dependable & On Time",
        description:
          "We show up when we say we will. No excuses, no last-minute cancellations. Just consistent, reliable service.",
      },
      {
        title: "Fully Insured",
        description:
          "Boss D is fully licensed and insured, so you can relax knowing your property and family are protected.",
      },
      {
        title: "Quality You Can See",
        description:
          "We take pride in the details — clean edges, uniform cuts, and finished work that stands out on the block.",
      },
      {
        title: "Fair, Transparent Pricing",
        description:
          "No hidden fees. We give you a clear quote upfront and stick to it. Your budget is always respected.",
      },
      {
        title: "Year-Round Service",
        description:
          "From spring cleanups to winter snow removal, we're your one call for every season in Erie.",
      },
    ],
    images: [
      "/images/industries/landscaping/why-us-1.jpg",
      "/images/industries/landscaping/why-us-2.jpg",
    ],
  },
  process: {
    headline: "How We Work",
    steps: [
      {
        number: "01",
        title: "Reach Out",
        description: "Call or message us to tell us about your yard and what you need.",
      },
      {
        number: "02",
        title: "Free Estimate",
        description: "We come to your property and give you a free, no-pressure quote.",
      },
      {
        number: "03",
        title: "Schedule It",
        description: "Pick a date that works for you. We fit around your schedule.",
      },
      {
        number: "04",
        title: "We Get to Work",
        description: "Our crew arrives on time and gets the job done right the first time.",
      },
      {
        number: "05",
        title: "Final Walkthrough",
        description: "We review the work with you to make sure you're 100% satisfied.",
      },
      {
        number: "06",
        title: "Ongoing Care",
        description: "Sign up for recurring service and never worry about your yard again.",
      },
    ],
    images: [
      "/images/industries/landscaping/process-1.jpg",
      "/images/industries/landscaping/process-2.jpg",
      "/images/industries/landscaping/process-3.jpg",
      "/images/industries/landscaping/process-4.jpg",
      "/images/industries/landscaping/process-5.jpg",
    ],
  },
  testimonials: [
    {
      name: "Michelle T.",
      location: "Erie, PA",
      text: "Boss D completely transformed my backyard. They were professional, fast, and cleaned up everything after. My yard has never looked this good.",
      rating: 5,
    },
    {
      name: "James R.",
      location: "Millcreek, PA",
      text: "I've been using Boss D for two years now for weekly mowing. Always on time, always looks great. I've recommended them to everyone on my street.",
      rating: 5,
    },
    {
      name: "Sandra K.",
      location: "Erie, PA",
      text: "They did our spring cleanup and mulching and the difference was night and day. Very fair price and incredibly friendly crew. Will definitely use again.",
      rating: 5,
    },
  ],
  serviceArea: {
    headline: "Serving Erie & Surrounding Areas",
    cities: [
      "Erie",
      "Millcreek",
      "Fairview",
      "Harborcreek",
      "Wesleyville",
      "Lawrence Park",
      "Girard",
      "Edinboro",
      "Corry",
      "Union City",
      "Waterford",
      "Wattsburg",
      "North East",
      "Springfield",
    ],
  },
  cta: {
    headline: "Ready for a Yard You're Proud Of?",
    subtext:
      "Free estimates. No pressure. Serving Erie, PA and surrounding areas.",
    buttonText: "Get a Free Quote",
  },
  footer: {
    tagline: "Boss D Landscaping Services — Erie's Most Trusted Crew.",
    links: [
      { label: "Services", href: "#services" },
      { label: "Why Us", href: "#why-us" },
      { label: "Process", href: "#process" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
}
