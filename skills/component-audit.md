# component-audit

Scans all components for hardcoded values that should be in theme config.

## What it does
Before a client pitch, run this to ensure nothing is hardcoded in the components
that should be pulling from the config object.

## What to scan for
Search every file in /components/ for:
- Hardcoded hex colors (e.g. #B91C1C, text-red-700)
- Hardcoded font names (e.g. font-['Playfair_Display'])
- Hardcoded copy strings (company name, phone, tagline, city names)
- Hardcoded image paths that should come from config

## How to run
1. Check every /components/ file for the above patterns
2. List each violation with: file path, line number, hardcoded value, correct config key
3. Fix each one by replacing with the appropriate config.{key} reference
4. Re-run the scan to confirm zero violations

## Output format
File: components/sections/Hero.tsx
Line 14: "#B91C1C" → should be config.colors.primary
Line 32: "Summit Roofing Co." → should be config.brand.name

## When to run
Before every new client demo. After any component edits. After installing new shadcn components.
