#!/usr/bin/env node
/**
 * NA Web Services — Industry Photo Seeder
 *
 * Downloads stock photos ONCE per industry into public/images/industries/[industry]/
 * All client configs in that industry reuse these photos — never re-downloaded.
 *
 * Usage:
 *   PEXELS_API_KEY=your-key node scripts/seed-photos.mjs
 *   PEXELS_API_KEY=your-key node scripts/seed-photos.mjs --industry landscaping
 *
 * Photos saved:
 *   hero.jpg         → hero background
 *   why-us-1.jpg     → Why Us section (left photo)
 *   why-us-2.jpg     → Why Us section (right photo)
 *   process-1..5.jpg → Process section step images
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const INDUSTRIES_DIR = path.join(ROOT, "public", "images", "industries")

// ─── Industry → Pexels search queries ────────────────────────────────────────
// Each array: [hero, whyUs1, whyUs2, process1, process2, process3, process4, process5]

const INDUSTRIES = {
  landscaping: [
    "professional lawn landscaping aerial",
    "landscaping crew working yard",
    "beautiful garden landscape design",
    "lawn mowing grass cut",
    "mulch garden bed installation",
    "hedge trimming shrubs",
    "sprinkler irrigation lawn",
    "landscape before after yard",
  ],
  roofing: [
    "aerial roof shingles house",
    "roofer working roof installation",
    "roofing crew shingles",
    "roof inspection professional",
    "shingle roof close up",
    "gutter installation roof",
    "roof repair contractor",
    "new roof house exterior",
  ],
  towing: [
    "tow truck highway road",
    "flatbed tow truck vehicle",
    "roadside assistance car",
    "tow truck night highway",
    "car towing service professional",
    "truck driver roadside",
    "vehicle recovery tow",
    "emergency towing service",
  ],
  plumbing: [
    "plumber pipe repair professional",
    "plumbing tools pipes",
    "bathroom sink plumbing",
    "water pipe installation plumber",
    "kitchen plumbing repair",
    "drain cleaning plumber",
    "water heater installation",
    "plumbing inspection professional",
  ],
  hvac: [
    "hvac technician air conditioner",
    "hvac unit installation outdoor",
    "air conditioning repair technician",
    "furnace heating system",
    "hvac ductwork installation",
    "thermostat hvac professional",
    "cooling system repair",
    "hvac maintenance service",
  ],
  cleaning: [
    "professional house cleaning service",
    "cleaning team home interior",
    "maid service cleaning supplies",
    "deep cleaning kitchen professional",
    "carpet cleaning service",
    "window cleaning professional",
    "office cleaning commercial",
    "cleaning crew residential",
  ],
  painting: [
    "house painter exterior professional",
    "interior painting walls roller",
    "painter brush wall professional",
    "house exterior paint spray",
    "painting contractor ladder",
    "fresh painted room interior",
    "color wall painting professional",
    "painting crew house",
  ],
  electrical: [
    "electrician wiring panel professional",
    "electrical panel installation",
    "electrician work wiring",
    "outlet wiring electrical repair",
    "electrical inspection professional",
    "lighting installation electrician",
    "circuit breaker electrical panel",
    "electrician safety equipment",
  ],
  construction: [
    "construction workers building site",
    "general contractor construction",
    "building construction foundation",
    "construction crew framing house",
    "home remodel renovation",
    "construction tools materials",
    "contractor blueprints building",
    "new home construction framing",
  ],
  moving: [
    "moving truck boxes residential",
    "movers carrying furniture professional",
    "moving company packing boxes",
    "moving crew loading truck",
    "furniture moving professional",
    "relocation moving service",
    "packing service moving",
    "residential moving truck",
  ],
  pest: [
    "pest control exterminator professional",
    "exterminator spraying house",
    "pest inspection home professional",
    "pest control equipment spray",
    "termite treatment professional",
    "bug extermination service",
    "pest control technician uniform",
    "rodent pest control home",
  ],
  auto: [
    "auto mechanic repair shop",
    "car repair mechanic professional",
    "auto body shop vehicle repair",
    "mechanic under car lift",
    "tire change service professional",
    "oil change auto service",
    "engine repair mechanic",
    "auto repair diagnostic",
  ],
  fencing: [
    "fence installation wood backyard",
    "iron fence gate property",
    "vinyl fence yard installation",
    "fence contractor installation",
    "wood fence privacy yard",
    "chain link fence property",
    "decorative fence gate",
    "new fence installation crew",
  ],
  concrete: [
    "concrete driveway professional",
    "concrete pour foundation",
    "stamped concrete patio",
    "concrete contractor work",
    "sidewalk concrete installation",
    "concrete finishing professional",
    "concrete truck pour",
    "decorative concrete patio",
  ],
  pressure: [
    "pressure washing driveway house",
    "power washing deck professional",
    "house pressure wash exterior",
    "pressure cleaning concrete",
    "roof soft wash cleaning",
    "deck power washing",
    "commercial pressure washing building",
    "driveway pressure wash clean",
  ],
}

const FILENAMES = [
  "hero.jpg",
  "why-us-1.jpg",
  "why-us-2.jpg",
  "process-1.jpg",
  "process-2.jpg",
  "process-3.jpg",
  "process-4.jpg",
  "process-5.jpg",
]

// ─── Pexels helpers ───────────────────────────────────────────────────────────

async function searchPexels(query, apiKey) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`
  const res = await fetch(url, { headers: { Authorization: apiKey }, signal: AbortSignal.timeout(15000) })
  if (!res.ok) { console.warn(`    Pexels error ${res.status} for "${query}"`); return null }
  const data = await res.json()
  return data.photos?.[0]?.src?.large2x ?? data.photos?.[0]?.src?.large ?? null
}

async function downloadFile(url, dest) {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seedIndustry(industry, queries, apiKey) {
  const dir = path.join(INDUSTRIES_DIR, industry)
  fs.mkdirSync(dir, { recursive: true })

  let downloaded = 0
  let skipped = 0

  for (let i = 0; i < FILENAMES.length; i++) {
    const filename = FILENAMES[i]
    const dest = path.join(dir, filename)

    // Skip if already exists
    if (fs.existsSync(dest)) {
      process.stdout.write(`    ${filename} already exists — skipping\n`)
      skipped++
      continue
    }

    const query = queries[i] ?? queries[0]
    process.stdout.write(`    "${query}" → ${filename} ...`)

    try {
      const photoUrl = await searchPexels(query, apiKey)
      if (!photoUrl) { process.stdout.write(" no result\n"); continue }
      await downloadFile(photoUrl, dest)
      process.stdout.write(` ✓\n`)
      downloaded++
      // Small delay to respect Pexels rate limits
      await new Promise(r => setTimeout(r, 300))
    } catch (e) {
      process.stdout.write(` ✗ ${e.message}\n`)
    }
  }

  return { downloaded, skipped }
}

async function main() {
  const apiKey = process.env.PEXELS_API_KEY
  if (!apiKey) {
    console.error("\n❌ PEXELS_API_KEY environment variable not set.")
    console.error("   Get a free key at https://www.pexels.com/api/\n")
    process.exit(1)
  }

  const targetArg = process.argv.indexOf("--industry")
  const target = targetArg !== -1 ? process.argv[targetArg + 1] : null
  const industries = target ? { [target]: INDUSTRIES[target] } : INDUSTRIES

  if (target && !INDUSTRIES[target]) {
    console.error(`\n❌ Unknown industry "${target}". Valid: ${Object.keys(INDUSTRIES).join(", ")}\n`)
    process.exit(1)
  }

  console.log(`\n📷 Seeding ${Object.keys(industries).length} industry photo set(s)...\n`)

  for (const [industry, queries] of Object.entries(industries)) {
    console.log(`  [${industry}]`)
    const { downloaded, skipped } = await seedIndustry(industry, queries, apiKey)
    console.log(`  → ${downloaded} downloaded, ${skipped} skipped\n`)
  }

  console.log("✅ Done. Photos live in public/images/industries/\n")
}

main().catch(e => { console.error("Fatal:", e); process.exit(1) })
