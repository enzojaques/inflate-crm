import { dallasRoofing } from "./dallas-roofing"
import { bossDLandscaping } from "./boss-d-landscaping"
import { titanLandscapeTree } from "./titan-landscape-tree"
import { ThemeConfig } from "@/lib/theme"

export const configs: Record<string, ThemeConfig> = {
  "dallas-roofing": dallasRoofing,
  "boss-d-landscaping": bossDLandscaping,
  "titan-landscape-tree": titanLandscapeTree,
}

export function getConfig(slug: string): ThemeConfig | undefined {
  return configs[slug]
}
