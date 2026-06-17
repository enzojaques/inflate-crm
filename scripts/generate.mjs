#!/usr/bin/env node
/**
 * NA Web Services — Preview Config Generator
 *
 * Usage:
 *   node scripts/generate.mjs \
 *     --slug boss-d-landscaping \
 *     --name "Boss D Landscaping" \
 *     --urls "https://facebook.com/BossDLandscape/,https://share.google/0e4THIy8JMOlRKQ9E" \
 *     --colors "#2E7D32,#1B5E20" \
 *     --logo "/images/boss-d-landscaping/logo.png" \
 *     --password "preview2026"
 *
 * Env: ANTHROPIC_API_KEY and PEXELS_API_KEY must be set.
 */

import Anthropic from "@anthropic-ai/sdk"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

// ─── Arg parsing ────────────────────────────────────────────────────────────

function getArg(flag) {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 ? process.argv[idx + 1] : null
}

const slug = getArg("--slug")
const name = getArg("--name")
const urlsRaw = getArg("--urls") ?? ""
const colorsRaw = getArg("--colors") ?? ""
const logo = getArg("--logo") ?? ""
const password = getArg("--password") ?? "preview2026"

if (!slug || !name) {
  console.error("Error: --slug and --name are required.")
  process.exit(1)
}

const urls = urlsRaw ? urlsRaw.split(",").map((u) => u.trim()).filter(Boolean) : []
const [primaryColor, secondaryColor] = colorsRaw.split(",").map((c) => c.trim())

// ─── Business type → Pexels search keywords ─────────────────────────────────

const INDUSTRY_KEYWORDS = {
  landscaping:  ["professional landscaping yard",  "lawn mowing service",     "garden landscaping",       "mulch lawn care",       "grass trimming"],
  roofing:      ["roof shingles installation",      "roofer working roof",     "roofing contractor",       "house roof repair",     "roofing crew"],
  towing:       ["tow truck highway",               "car towing service",      "roadside assistance",      "tow truck vehicle",     "flatbed tow truck"],
  plumbing:     ["plumber pipe repair",             "plumbing service",        "sink pipe fix",            "bathroom plumbing",     "water pipe plumber"],
  hvac:         ["hvac technician",                 "air conditioning repair",  "furnace installation",    "hvac unit outdoor",     "heating cooling service"],
  cleaning:     ["house cleaning service",          "professional cleaner",    "cleaning supplies",        "maid service home",     "deep cleaning"],
  painting:     ["house painter exterior",          "interior painting walls", "painter roller brush",     "house paint exterior",  "painting contractor"],
  electrical:   ["electrician wiring",              "electrical panel",        "electrician work",         "electrical repair",     "wiring installation"],
  construction: ["construction workers site",       "building construction",   "concrete foundation",     "construction crew",     "general contractor"],
  moving:       ["moving truck boxes",              "movers carrying furniture","moving company service",   "packing boxes moving",  "residential moving"],
  pest:         ["pest control exterminator",       "bug extermination",       "pest inspection home",     "exterminator spraying", "termite pest control"],
  auto:         ["auto repair mechanic",            "car repair shop",         "mechanic under car",       "auto body shop",        "tire change service"],
  fencing:      ["fence installation backyard",     "wood fence property",     "iron fence gate",          "vinyl fence yard",      "fence contractor"],
  concrete:     ["concrete driveway",               "concrete patio pour",     "concrete contractor",      "sidewalk concrete",     "stamped concrete"],
  pressure:     ["pressure washing driveway",       "power washing house",     "pressure wash deck",       "house washing exterior","pressure cleaning"],
  default:      ["professional service business",   "contractor worker",       "service team working",     "professional team",     "business services"],
}

function detectIndustry(name, services = []) {
  const text = (name + " " + services.join(" ")).toLowerCase()
  if (/landscap|lawn|mow|garden|mulch|sod|turf|yard/.test(text))   return "landscaping"
  if (/roof|shingle|gutter|fascia|soffit/.test(text))               return "roofing"
  if (/tow|towing|roadside|flatbed/.test(text))                     return "towing"
  if (/plumb|pipe|drain|sewer|water heater/.test(text))             return "plumbing"
  if (/hvac|heat|cool|air cond|furnace|ac /.test(text))             return "hvac"
  if (/clean|maid|janitor|janitorial/.test(text))                   return "cleaning"
  if (/paint|coat|stain|finish/.test(text))                         return "painting"
  if (/electri|wiring|panel|circuit/.test(text))                    return "electrical"
  if (/construct|build|remodel|renovate|general contr/.test(text))  return "construction"
  if (/mov|reloc|pack|storage/.test(text))                          return "moving"
  if (/pest|bug|rodent|extermina|termite/.test(text))               return "pest"
  if (/auto|car|truck|vehicle|tire|body shop/.test(text))           return "auto"
  if (/fence|fencing|gate/.test(text))                              return "fencing"
  if (/concrete|cement|driveway|patio|sidewalk/.test(text))         return "concrete"
  if (/pressure|power wash/.test(text))                             return "pressure"
  return "default"
}

// ─── Pexels image downloader ─────────────────────────────────────────────────

async function searchPexels(query, perPage = 1) {
  const key = process.env.PEXELS_API_KEY
  if (!key) return []
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`
  const res = await fetch(url, { headers: { Authorization: key } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.photos ?? []).map((p) => p.src.large2x || p.src.large)
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, buf)
}

async function fetchPhotos(industry, slug) {
  const pexelsKey = process.env.PEXELS_API_KEY
  if (!pexelsKey) {
    console.log("  ⚠ PEXELS_API_KEY not set — skipping photo download.")
    return { hero: null, whyUs: [], process: [] }
  }

  const keywords = INDUSTRY_KEYWORDS[industry] ?? INDUSTRY_KEYWORDS.default
  const imgDir = path.join(ROOT, "public", "images", slug)
  fs.mkdirSync(imgDir, { recursive: true })

  console.log(`  Industry detected: ${industry}`)

  const results = { hero: null, whyUs: [], process: [] }

  // Download photos in parallel groups
  const tasks = [
    // hero
    { keyword: keywords[0], filename: "hero.jpg",        role: "hero" },
    // whyUs (2 photos)
    { keyword: keywords[1], filename: "why-us-1.jpg",    role: "whyUs" },
    { keyword: keywords[2], filename: "why-us-2.jpg",    role: "whyUs" },
    // process (5 photos, cycling through keywords)
    { keyword: keywords[0], filename: "process-1.jpg",   role: "process" },
    { keyword: keywords[1], filename: "process-2.jpg",   role: "process" },
    { keyword: keywords[2], filename: "process-3.jpg",   role: "process" },
    { keyword: keywords[3] ?? keywords[0], filename: "process-4.jpg", role: "process" },
    { keyword: keywords[4] ?? keywords[1], filename: "process-5.jpg", role: "process" },
  ]

  await Promise.all(
    tasks.map(async ({ keyword, filename, role }) => {
      const dest = path.join(imgDir, filename)
      const publicPath = `/images/${slug}/${filename}`
      try {
        process.stdout.write(`    Fetching "${keyword}" → ${filename} ...`)
        const [photoUrl] = await searchPexels(keyword, 1)
        if (!photoUrl) { process.stdout.write(" no result\n"); return }
        await downloadImage(photoUrl, dest)
        process.stdout.write(` ✓\n`)
        if (role === "hero")    results.hero = publicPath
        if (role === "whyUs")  results.whyUs.push(publicPath)
        if (role === "process") results.process.push(publicPath)
      } catch (e) {
        process.stdout.write(` failed (${e.message})\n`)
      }
    })
  )

  return results
}

// ─── URL fetcher ─────────────────────────────────────────────────────────────

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      signal: AbortSignal.timeout(12000),
    })
    const text = await res.text()
    return text
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .slice(0, 12000)
  } catch (e) {
    console.warn(`  ⚠ Could not fetch ${url}: ${e.message}`)
    return ""
  }
}

// ─── Claude prompt ───────────────────────────────────────────────────────────

const REGISTERED_FONTS = [
  "Playfair Display", "Merriweather", "Cormorant Garamond", "DM Serif Display",
  "Oswald", "Bebas Neue", "Montserrat", "Poppins", "Inter", "Lato",
  "Work Sans", "Roboto Slab", "Plus Jakarta Sans",
]

const LUCIDE_ICONS = [
  "Hammer", "Wrench", "Scissors", "Shovel", "Leaf", "Trees", "Flower2",
  "Sprout", "Sun", "Droplets", "Wind", "Fence", "Home", "Building2", "Layers",
  "HardHat", "PaintBucket", "Brush", "Ruler", "Search", "ShieldCheck", "Star",
  "Truck", "Package", "ClipboardList", "Phone", "Calendar", "Users", "Award",
  "Zap", "Flame", "Snowflake", "Car", "AlertTriangle", "CheckCircle",
]

function buildPrompt(pageContents) {
  const urlBlocks = pageContents
    .map(({ url, text }) => `--- URL: ${url} ---\n${text || "(no content fetched)"}`)
    .join("\n\n")

  return `You are generating a ThemeConfig JSON object for a client website preview system. Extract REAL business data from the sources below. Be specific — use real phone numbers, real cities, real services mentioned.

BUSINESS: ${name}
SLUG: ${slug}
${primaryColor ? `PRIMARY COLOR: ${primaryColor}` : ""}
${secondaryColor ? `SECONDARY COLOR: ${secondaryColor}` : ""}
${logo ? `LOGO PATH: ${logo}` : ""}

SCRAPED PAGE CONTENT:
${urlBlocks || "(No URLs — generate professional content for this business type)"}

OUTPUT RULES:
- Return ONLY valid JSON — no markdown, no code fences, no explanation.
- Extract real phone, city, state, email from content. Infer email from business name if not found.
- For colors: pick a bold, professional palette matching this business type. Use PRIMARY/SECONDARY hints if given.
- fonts.heading: one of: ${REGISTERED_FONTS.join(", ")}
- fonts.body: one of: ${REGISTERED_FONTS.join(", ")}
- service icons: Lucide names from: ${LUCIDE_ICONS.join(", ")}
- stats: 3 compelling numbers (years, reviews, jobs, etc.)
- services: 4–6 services with real descriptions
- whyUs.points: 4–6 strong value props
- process.steps: 5–7 steps numbered "01"–"07"
- testimonials: 3 realistic 5-star reviews with local city names
- serviceArea.cities: 10–16 real nearby cities
- partners: 3–5 relevant industry brands/associations
- Set backgroundImage and backgroundVideo to null (photos are handled separately)
- Set whyUs.images and process.images to [] (photos handled separately)

JSON SCHEMA:
{
  "slug": string,
  "password": string,
  "brand": { "name": string, "tagline": string, "phone": string, "email": string, "city": string, "state": string },
  "colors": { "primary": string, "primaryHover": string, "secondary": string, "background": "#FFFFFF", "surface": string, "text": string, "textMuted": string, "border": string },
  "fonts": { "heading": string, "body": string },
  "hero": { "headline": string, "subheadline": string, "cta": string, "ctaSecondary": string, "backgroundImage": null, "backgroundVideo": null, "bullets": [] },
  "stats": [{ "value": string, "label": string }],
  "partners": [{ "name": string }],
  "services": [{ "title": string, "description": string, "icon": string }],
  "whyUs": { "headline": string, "points": [{ "title": string, "description": string }], "images": [] },
  "process": { "headline": string, "steps": [{ "number": string, "title": string, "description": string }], "images": [] },
  "testimonials": [{ "name": string, "location": string, "text": string, "rating": 5 }],
  "serviceArea": { "headline": string, "cities": string[] },
  "cta": { "headline": string, "subtext": string, "buttonText": string },
  "footer": { "tagline": string, "links": [{"label":"Services","href":"#services"},{"label":"Why Us","href":"#why-us"},{"label":"Process","href":"#process"},{"label":"Reviews","href":"#testimonials"},{"label":"Contact","href":"#contact"}] }
}

Return JSON now:`
}

// ─── File writers ─────────────────────────────────────────────────────────────

function toCamelCase(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function writeConfigFile(slug, data) {
  const varName = toCamelCase(slug)
  const json = JSON.stringify(data, null, 2)
  const content = `import { ThemeConfig } from "@/lib/theme"\n\nexport const ${varName}: ThemeConfig = ${json}\n`
  const filePath = path.join(ROOT, "configs", `${slug}.ts`)
  fs.writeFileSync(filePath, content, "utf8")
  console.log(`  ✓ Wrote configs/${slug}.ts`)
  return varName
}

function patchIndexFile(slug, varName) {
  const indexPath = path.join(ROOT, "configs", "index.ts")
  let src = fs.readFileSync(indexPath, "utf8")

  const importLine = `import { ${varName} } from "./${slug}"`
  if (!src.includes(importLine)) {
    src = src.replace(/(import .+\n)(?!import)/, `$1${importLine}\n`)
  }

  const entry = `  "${slug}": ${varName},`
  if (!src.includes(entry)) {
    src = src.replace(/(export const configs.*?=\s*\{)/, `$1\n${entry}`)
  }

  fs.writeFileSync(indexPath, src, "utf8")
  console.log(`  ✓ Patched configs/index.ts`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is not set.")
    process.exit(1)
  }

  console.log(`\n🚀 Generating preview for "${name}" → /${slug}\n`)

  // 1. Fetch URLs
  const pageContents = []
  for (const url of urls) {
    process.stdout.write(`  Fetching ${url} ...`)
    const text = await fetchText(url)
    process.stdout.write(text ? ` ${text.length} chars\n` : " (empty)\n")
    pageContents.push({ url, text })
  }

  // 2. Claude generates config
  console.log("\n  Calling Claude...")
  const client = new Anthropic({ apiKey })
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: buildPrompt(pageContents) }],
  })

  const raw = message.content[0]?.type === "text" ? message.content[0].text.trim() : ""
  const jsonStr = raw.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim()

  let data
  try {
    data = JSON.parse(jsonStr)
  } catch {
    console.error("\n❌ Failed to parse Claude response:")
    console.error(raw.slice(0, 600))
    process.exit(1)
  }

  // 3. Detect industry + download matching photos
  const industry = detectIndustry(name, data.services?.map(s => s.title) ?? [])
  console.log(`\n  Downloading ${industry} photos from Pexels...`)
  const photos = await fetchPhotos(industry, slug)

  // 4. Wire photos into config
  if (photos.hero)            data.hero.backgroundImage = photos.hero
  if (photos.whyUs.length)    data.whyUs.images = photos.whyUs
  if (photos.process.length)  data.process.images = photos.process

  // 5. Lock in CLI-provided values
  data.slug = slug
  data.password = password
  if (logo) data.brand.logo = logo

  // 6. Write files
  console.log("")
  const varName = writeConfigFile(slug, data)
  patchIndexFile(slug, varName)

  console.log(`\n✅ Done!`)
  console.log(`   Preview: http://localhost:3000/${slug}`)
  console.log(`   Password: ${password}\n`)
}

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})
