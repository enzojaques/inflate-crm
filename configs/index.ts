import { dallasRoofing } from "./dallas-roofing"
import { ThemeConfig } from "@/lib/theme"

export const configs: Record<string, ThemeConfig> = {
  "dallas-roofing": dallasRoofing,
}

export function getConfig(slug: string): ThemeConfig | undefined {
  return configs[slug]
}
