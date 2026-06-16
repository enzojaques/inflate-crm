import {
  Playfair_Display,
  Merriweather,
  Cormorant_Garamond,
  DM_Serif_Display,
  Oswald,
  Bebas_Neue,
  Montserrat,
  Poppins,
  Inter,
  Lato,
  Work_Sans,
  Roboto_Slab,
} from "next/font/google"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair-display",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif-display",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  display: "swap",
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-slab",
  display: "swap",
})

/**
 * Maps a Google Font name (as used in ThemeConfig.fonts) to its loaded next/font
 * instance and the literal CSS custom property name passed to its `variable` option.
 * `font.variable` (from next/font) is a generated *class name* that defines that
 * custom property when applied — it is not the property name itself, so we track
 * the literal name separately to build `var(--font-x)` references.
 */
export const fontRegistry = {
  "Playfair Display": { font: playfairDisplay, cssVar: "--font-playfair-display" },
  Merriweather: { font: merriweather, cssVar: "--font-merriweather" },
  "Cormorant Garamond": { font: cormorantGaramond, cssVar: "--font-cormorant-garamond" },
  "DM Serif Display": { font: dmSerifDisplay, cssVar: "--font-dm-serif-display" },
  Oswald: { font: oswald, cssVar: "--font-oswald" },
  "Bebas Neue": { font: bebasNeue, cssVar: "--font-bebas-neue" },
  Montserrat: { font: montserrat, cssVar: "--font-montserrat" },
  Poppins: { font: poppins, cssVar: "--font-poppins" },
  Inter: { font: inter, cssVar: "--font-inter" },
  Lato: { font: lato, cssVar: "--font-lato" },
  "Work Sans": { font: workSans, cssVar: "--font-work-sans" },
  "Roboto Slab": { font: robotoSlab, cssVar: "--font-roboto-slab" },
} as const

export type RegisteredFontName = keyof typeof fontRegistry

/** All font variable classNames, applied once at the root so any config can reference any font. */
export function getAllFontVariables(): string {
  return Object.values(fontRegistry)
    .map(({ font }) => font.variable)
    .join(" ")
}

/** Resolves a config font name to its CSS variable, e.g. "Inter" -> "var(--font-inter)". */
export function getFontCssVariable(fontName: string): string {
  const entry = fontRegistry[fontName as RegisteredFontName]
  if (!entry) {
    throw new Error(
      `Unregistered Google Font "${fontName}". Add it to lib/fonts.ts before using it in a config.`
    )
  }
  return `var(${entry.cssVar})`
}
