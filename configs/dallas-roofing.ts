import { ThemeConfig } from "@/lib/theme"

export const dallasRoofing: ThemeConfig = {
  slug: "dallas-roofing",
  password: "roof2026",
  brand: {
    name: "Summit Roofing Co.",
    tagline: "Dallas–Fort Worth's Most Trusted Roofer",
    phone: "(214) 555-0192",
    email: "hello@summitroofingco.com",
    city: "Dallas",
    state: "TX",
  },
  colors: {
    primary: "#DC2626", // vivid red — trust, urgency
    primaryHover: "#B91C1C",
    secondary: "#18181B", // near black
    background: "#FFFFFF",
    surface: "#F4F4F5",
    text: "#18181B",
    textMuted: "#6B6B6F",
    border: "#E4E4E7",
  },
  fonts: {
    heading: "Oswald",
    body: "Inter",
  },
  hero: {
    headline: "Your Dallas Roofing Company",
    subheadline:
      "Summit Roofing Co. has protected DFW homes and businesses since 2009. Free inspections. Same-day estimates. No pressure.",
    cta: "About Our Company",
    ctaSecondary: "See Our Work",
    backgroundVideo: "/images/dallas-roofing/herovid.mp4",
    bullets: [
      "Dallas's Premier Roofer",
      "The Quality You Deserve",
      "Fully Licensed & Insured",
    ],
  },
  stats: [
    { value: "100+", label: "5 Star Reviews" },
    { value: "15+", label: "Years of Experience" },
    { value: "1,200+", label: "Projects Complete" },
  ],
  partners: [
    { name: "GAF" },
    { name: "Owens Corning" },
    { name: "CertainTeed" },
    { name: "Malarkey" },
    { name: "IKO" },
  ],
  services: [
    {
      title: "Roof Repair",
      description:
        "Fast, reliable repairs for leaks, missing shingles, and storm damage.",
      icon: "Hammer",
    },
    {
      title: "Roof Replacement",
      description:
        "Full tear-off and installation using premium shingles and materials built for Texas weather.",
      icon: "Layers",
    },
    {
      title: "Installation",
      description:
        "New construction and full roofing system installation from the ground up.",
      icon: "HardHat",
    },
    {
      title: "Roof Inspection",
      description:
        "Thorough 27-point inspection with detailed photo report. Free for homeowners.",
      icon: "Search",
    },
    {
      title: "Gutters & Drainage",
      description:
        "Seamless gutter installation and repair to protect your foundation and landscaping.",
      icon: "Droplets",
    },
    {
      title: "Commercial Roofing",
      description:
        "Flat roof systems, TPO, EPDM, and modified bitumen for commercial properties.",
      icon: "Building2",
    },
  ],
  whyUs: {
    headline: "Your Local Roofing Company",
    points: [
      {
        title: "Expert Craftsmanship",
        description:
          "With years of hands-on experience, our team provides high-quality solutions tailored to your specific needs.",
      },
      {
        title: "Premium Products",
        description:
          "We partner with trusted local suppliers to offer top materials like Owens Corning, GAF Timberline Shingles, Tile Decking, and more.",
      },
      {
        title: "Customer-First Service",
        description:
          "Rooted in integrity and shared by everyone on our team, we put your goals ahead of the sale on every single job.",
      },
      {
        title: "Attitude",
        description:
          "At Summit Roofing Co., we bring our A-game with an unwavering positive attitude for every customer, every time.",
      },
      {
        title: "Honor",
        description:
          "Honor means consistently adhering to the highest moral and ethical standards. We value honesty, reliability, fairness, and transparency in all our actions and interactions.",
      },
      {
        title: "Community",
        description:
          "Community is at the heart of everything we do. As proud Dallas natives, we take an active role in uplifting and improving the neighborhoods we serve.",
      },
    ],
    images: [
      "/images/dallas-roofing/pexels-clement-proust-363898785-31771166.jpg",
      "/images/dallas-roofing/pexels-clement-proust-363898785-31771166.jpg",
    ],
  },
  process: {
    headline: "Roofing Process",
    images: [
      "/images/dallas-roofing/roofer.jpg",
      "/images/dallas-roofing/construction.jpg",
      "/images/dallas-roofing/ladder.jpg",
      "/images/dallas-roofing/shingles.jpg",
      "/images/dallas-roofing/toolbelt.jpg",
    ],
    steps: [
      {
        number: "01",
        title: "First Contact",
        description: "Reach out and tell us what's going on with your roof.",
      },
      {
        number: "02",
        title: "Property Inspection",
        description: "We come to you and assess the roof in full detail.",
      },
      {
        number: "03",
        title: "Review",
        description: "We walk you through findings and your options.",
      },
      {
        number: "04",
        title: "Solution",
        description: "You get a clear, itemized estimate built around your needs.",
      },
      {
        number: "05",
        title: "Roof Ready",
        description: "Materials are ordered and your crew is scheduled.",
      },
      {
        number: "06",
        title: "Transformation Day",
        description: "Crew arrives on time and gets to work on your new roof.",
      },
      {
        number: "07",
        title: "Closing Day",
        description: "Final walkthrough, cleanup, and photo report.",
      },
      {
        number: "08",
        title: "Final Ask",
        description: "We make sure you're thrilled — and ask for your review.",
      },
    ],
  },
  testimonials: [
    {
      name: "Marcus T.",
      location: "Frisco, TX",
      text: "Summit found damage I didn't even know I had after the April hail storm. They handled everything with my insurance. New roof in 3 days. Highly recommend.",
      rating: 5,
    },
    {
      name: "Jennifer R.",
      location: "Plano, TX",
      text: "Professional, fast, and honest. Got 3 quotes and Summit was the only one who actually showed me the damage with photos instead of just trying to upsell me.",
      rating: 5,
    },
    {
      name: "David & Karen M.",
      location: "Allen, TX",
      text: "We've used them twice now. The first job was so clean we called them back when our rental property needed work. They treat every house like it's their own.",
      rating: 5,
    },
  ],
  serviceArea: {
    headline: "Areas We Serve in Dallas–Fort Worth",
    cities: [
      "Dallas",
      "Plano",
      "Frisco",
      "Allen",
      "McKinney",
      "Garland",
      "Mesquite",
      "Irving",
      "Arlington",
      "Fort Worth",
      "Denton",
      "Lewisville",
      "Richardson",
      "Carrollton",
      "Rockwall",
      "Wylie",
      "Prosper",
    ],
  },
  cta: {
    headline: "Get Your Roofing Project Started Today!",
    subtext:
      "Free inspections. No pressure. Same-day estimates. Serving DFW since 2009.",
    buttonText: "Get a Free Consult",
  },
  footer: {
    tagline: "Summit Roofing Co. — Protecting DFW Homes Since 2009.",
    links: [
      { label: "Services", href: "#services" },
      { label: "Why Us", href: "#why-us" },
      { label: "Process", href: "#process" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
  },
}
