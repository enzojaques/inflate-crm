/**
 * Maps each industry to its shared stock photo paths.
 * Photos live at public/images/industries/[industry]/ and are seeded once
 * via `npm run seed-photos`. All clients in the same industry share these images —
 * only logo, colors, copy, and client-specific data changes per config.
 */

export type Industry =
  | "landscaping" | "roofing"   | "towing"    | "plumbing"
  | "hvac"        | "cleaning"  | "painting"  | "electrical"
  | "construction"| "moving"    | "pest"      | "auto"
  | "fencing"     | "concrete"  | "pressure"  | "default"

export interface IndustryPhotos {
  hero: string
  whyUs: [string, string]
  process: [string, string, string, string, string]
}

export function getIndustryPhotos(industry: Industry): IndustryPhotos {
  const base = `/images/industries/${industry === "default" ? "construction" : industry}`
  return {
    hero:    `${base}/hero.jpg`,
    whyUs:   [`${base}/why-us-1.jpg`, `${base}/why-us-2.jpg`],
    process: [
      `${base}/process-1.jpg`,
      `${base}/process-2.jpg`,
      `${base}/process-3.jpg`,
      `${base}/process-4.jpg`,
      `${base}/process-5.jpg`,
    ],
  }
}

export function detectIndustry(name: string, services: string[] = []): Industry {
  const text = (name + " " + services.join(" ")).toLowerCase()
  if (/landscap|lawn|mow|garden|mulch|sod|turf|yard/.test(text))   return "landscaping"
  if (/roof|shingle|gutter|fascia|soffit/.test(text))               return "roofing"
  if (/tow|towing|roadside|flatbed/.test(text))                     return "towing"
  if (/plumb|pipe|drain|sewer|water heater/.test(text))             return "plumbing"
  if (/hvac|heat|cool|air cond|furnace/.test(text))                 return "hvac"
  if (/clean|maid|janitor/.test(text))                              return "cleaning"
  if (/paint|coat|stain/.test(text))                                return "painting"
  if (/electri|wiring|panel|circuit/.test(text))                    return "electrical"
  if (/construct|build|remodel|renovate|general contr/.test(text))  return "construction"
  if (/mov|reloc|pack/.test(text))                                  return "moving"
  if (/pest|bug|rodent|extermina|termite/.test(text))               return "pest"
  if (/auto|car body|mechanic|tire|oil change/.test(text))          return "auto"
  if (/fence|fencing|gate/.test(text))                              return "fencing"
  if (/concrete|cement|driveway|patio/.test(text))                  return "concrete"
  if (/pressure|power wash/.test(text))                             return "pressure"
  return "default"
}
