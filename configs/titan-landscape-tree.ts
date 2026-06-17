import { ThemeConfig } from "@/lib/theme"

export const titanLandscapeTree: ThemeConfig = {
  slug: "titan-landscape-tree",
  password: "Titan123",
  brand: {
    name: "Titan Landscape & Tree",
    tagline: "Pittsburgh's Trusted Landscaping & Tree Service",
    phone: "(412) 779-4005",
    email: "",
    city: "Pittsburgh",
    state: "PA",
  },
  colors: {
    primary: "#2C5F2E",
    primaryHover: "#1B4020",
    secondary: "#111811",
    background: "#FFFFFF",
    surface: "#F0F7F0",
    text: "#0F1A0F",
    textMuted: "#445544",
    border: "#CCE0CC",
  },
  fonts: {
    heading: "Oswald",
    body: "Inter",
  },
  hero: {
    headline: "Pittsburgh's Tree & Landscape Experts",
    subheadline:
      "Titan Landscape & Tree Services delivers expert tree removal, storm cleanup, and full landscaping for residential and commercial properties across the Greater Pittsburgh area. Fair prices. Outstanding quality. Owner Charles on every job.",
    cta: "Get a Free Quote",
    ctaSecondary: "Our Services",
    backgroundImage: "/images/industries/landscaping/hero.jpg",
    bullets: [],
  },
  stats: [
    { value: "4.8★", label: "Google Rating" },
    { value: "104", label: "Google Reviews" },
    { value: "24/7", label: "Storm Emergency Response" },
  ],
  services: [
    {
      title: "Tree Removal",
      description:
        "Safe, efficient removal of trees of any size — from backyard trees to large hazard trees. We handle the dangerous work so you don't have to.",
      icon: "TreePine",
    },
    {
      title: "Storm Emergency Service",
      description:
        "Trees fall when storms hit. Titan responds fast — even overnight. We've saved homes from serious damage when it counted most.",
      icon: "CloudLightning",
    },
    {
      title: "Tree Trimming & Pruning",
      description:
        "Keep your trees healthy and your property safe with expert trimming and shaping. We improve structure, clear hazards, and promote growth.",
      icon: "Scissors",
    },
    {
      title: "Landscaping & Lawn Care",
      description:
        "Full-service lawn maintenance, edging, mowing, and seasonal care for residential and commercial properties across Pittsburgh.",
      icon: "Leaf",
    },
    {
      title: "Shrub & Weed Removal",
      description:
        "Overgrown shrubs, invasive weeds, dead hedges — we clear it all out and leave your property clean, open, and ready to look its best.",
      icon: "Sprout",
    },
    {
      title: "Yard Cleanup & Hauling",
      description:
        "Full debris removal, brush hauling, and yard restoration. After the job is done, we leave your property cleaner than we found it.",
      icon: "Trash2",
    },
  ],
  whyUs: {
    headline: "Why Pittsburgh Trusts Titan",
    points: [
      {
        title: "4.8 Stars — 104 Reviews",
        description:
          "Over a hundred Pittsburgh homeowners have rated Titan 4.8 on Google. That's not luck — that's a consistent standard of work.",
      },
      {
        title: "Charles Runs Every Job",
        description:
          "The owner, Charles, is on-site for every job. No middlemen, no crews you've never met. You get the person accountable for the work.",
      },
      {
        title: "Fair, Transparent Pricing",
        description:
          "Reviewers consistently call out our fair prices. You get a clear quote upfront — no surprise fees, no inflated emergency rates.",
      },
      {
        title: "Storm Emergency Response",
        description:
          "When a tree came down at 4am during a windstorm, we were there. We respond fast when it matters most — day or night.",
      },
      {
        title: "Residential & Commercial",
        description:
          "From backyard trees to commercial properties across Allegheny County — Titan handles jobs of every size with the same care.",
      },
      {
        title: "Quick Scheduling",
        description:
          "Got a quote Friday afternoon and crews on-site Saturday morning. We move when you need us to move.",
      },
    ],
    images: [
      "/images/industries/landscaping/why-us-1.jpg",
      "/images/industries/landscaping/why-us-2.jpg",
    ],
  },
  process: {
    headline: "How It Works",
    steps: [
      {
        number: "01",
        title: "Call or Text",
        description:
          "Reach Charles directly at (412) 779-4005. Tell us what you need — tree removal, landscaping, storm cleanup, or a full yard overhaul.",
      },
      {
        number: "02",
        title: "On-Site Quote",
        description:
          "We come to your property, assess the job, and give you a fair, straightforward quote. No obligation, no pressure.",
      },
      {
        number: "03",
        title: "You Approve",
        description:
          "Review the quote at your own pace. When you're ready, give us the green light and we lock in your date.",
      },
      {
        number: "04",
        title: "We Show Up",
        description:
          "Charles and the crew arrive on time and get to work. We bring the right equipment for any job, big or small.",
      },
      {
        number: "05",
        title: "Clean Finish",
        description:
          "Every job ends with a full cleanup — debris hauled, yard restored. We don't leave until the property looks right.",
      },
      {
        number: "06",
        title: "Ongoing Service",
        description:
          "Need regular lawn care or seasonal maintenance? We set up a recurring schedule that works around you.",
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
      name: "Becca H.",
      location: "Pittsburgh, PA",
      text: "A large tree fell into another tree in my yard after a big storm. I called Titan and Charles and his crew did the dangerous work of making my yard safe again. One year later and they're still my go-to.",
      rating: 5,
    },
    {
      name: "Darlene M.",
      location: "Pittsburgh, PA",
      text: "A huge tree fell on my house at 4am during a windstorm. These guys saved my home. I cannot say enough about how professional they were — excellent, excellent service.",
      rating: 5,
    },
    {
      name: "Jason C.",
      location: "Pittsburgh, PA",
      text: "Called on a Friday afternoon to remove two large black cherry trees. Charles was on-site quoting Saturday morning. By Wednesday, the trees were safely removed. Responsive, quality work at a reasonable rate.",
      rating: 5,
    },
  ],
  serviceArea: {
    headline: "Serving Greater Pittsburgh & Allegheny County",
    cities: [
      "Pittsburgh",
      "Edgewood",
      "Swissvale",
      "Wilkinsburg",
      "Forest Hills",
      "Churchill",
      "Monroeville",
      "Penn Hills",
      "Braddock",
      "Rankin",
      "Homestead",
      "Munhall",
      "West Mifflin",
      "Bethel Park",
      "Mt. Lebanon",
      "Upper St. Clair",
      "Carnegie",
      "Crafton",
      "Brentwood",
      "Baldwin",
    ],
  },
  cta: {
    headline: "Need a Tree Down or a Yard Transformed?",
    subtext:
      "Free estimates. Fast scheduling. Serving Pittsburgh and Allegheny County. Call Charles directly at (412) 779-4005 — open until 7 PM.",
    buttonText: "Get a Free Quote",
  },
  footer: {
    tagline: "Titan Landscape & Tree — 303 Peebles St, Pittsburgh, PA 15221 · (412) 779-4005",
    links: [
      { label: "Services", href: "#services" },
      { label: "Why Us", href: "#why-us" },
      { label: "Process", href: "#process" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
}
