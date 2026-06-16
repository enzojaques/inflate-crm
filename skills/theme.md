# theme

Use this skill to customize a client preview config.

## What it does
Updates /configs/{slug}.ts to match a brand brief. Powers the one-prompt
customization workflow for NA Web Services client demos.

## Config file location
All client configs live in /configs/. The TypeScript interface is at /lib/theme.ts.
Register new configs in /configs/index.ts.

## How to use
When asked to "customize for [client]" or given a brand brief, do this:

1. Create /configs/{slug}.ts by copying /configs/_template.ts
2. Fill every field using the brand brief. Infer what's missing (don't leave placeholders).
3. Choose colors that fit the industry and feel premium — never use default blues.
4. Choose Google Fonts that match the brand personality. Only use fonts already
   registered in /lib/fonts.ts (`fontRegistry`). If the brief calls for a font that
   isn't registered yet, add it to /lib/fonts.ts first using `next/font/google`,
   following the existing pattern (subsets, weight, variable, display: "swap"),
   then reference it by name in the config.
5. Register the new config in /configs/index.ts
6. Confirm the route: /{slug} is now live.

## Color guidance by industry
- Roofing / Trades: deep red, navy, charcoal, forest green
- Luxury / Real estate: black, warm cream, gold, deep emerald
- Medical / Legal: navy, slate, white, muted teal
- Fitness / Energy: black, electric, high contrast
- Restaurants: warm tones, never cold blues

## Never
- Leave any ThemeConfig field as a placeholder string like "YOUR TEXT HERE"
- Use primary color as a background color
- Use more than 2 font families
- Use rounded-full on CTA buttons
