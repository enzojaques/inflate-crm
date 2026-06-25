import { dallasRoofing } from "./dallas-roofing"
import { bossDLandscaping } from "./boss-d-landscaping"
import { titanLandscapeTree } from "./titan-landscape-tree"
import { craftBarberStudio } from "./craft-barber-studio"
import { oneStopRepair } from "./1-stop-repair"
import { ThemeConfig } from "@/lib/theme"

export const configs: Record<string, ThemeConfig> = {
  "dallas-roofing": dallasRoofing,
  "boss-d-landscaping": bossDLandscaping,
  "titan-landscape-tree": titanLandscapeTree,
  "craft-barber-studio": craftBarberStudio,
  "1-stop-repair": oneStopRepair,
}

export function getConfig(slug: string): ThemeConfig | undefined {
  return configs[slug]
}
