import type { CSSProperties } from "react"
import type { Metadata } from "next"

import { getConfig } from "@/configs"
import { getFontCssVariable } from "@/lib/fonts"
import { NavBar } from "@/components/ui/NavBar"
import { Footer } from "@/components/sections/Footer"
import { ServiceArea } from "@/components/sections/ServiceArea"
import { RepairHero } from "@/components/clients/1-stop-repair/RepairHero"
import { RepairServiceStrip } from "@/components/clients/1-stop-repair/RepairServiceStrip"
import { RepairTrustBand } from "@/components/clients/1-stop-repair/RepairTrustBand"
import { RepairServices } from "@/components/clients/1-stop-repair/RepairServices"
import { RepairWhyUs } from "@/components/clients/1-stop-repair/RepairWhyUs"
import { RepairTestimonials } from "@/components/clients/1-stop-repair/RepairTestimonials"
import { RepairCTA } from "@/components/clients/1-stop-repair/RepairCTA"

const SLUG = "1-stop-repair"

export const metadata: Metadata = {
  title: "1 Stop Repair — Preview",
  description: "San Antonio's Cellphone Repair Experts",
}

export default function OneStopRepairPage() {
  const config = getConfig(SLUG)!

  const themeStyle: CSSProperties = {
    "--color-primary": config.colors.primary,
    "--color-primary-hover": config.colors.primaryHover,
    "--color-secondary": config.colors.secondary,
    "--color-background": config.colors.background,
    "--color-surface": config.colors.surface,
    "--color-text": config.colors.text,
    "--color-text-muted": config.colors.textMuted,
    "--color-border": config.colors.border,
    "--font-heading": getFontCssVariable(config.fonts.heading),
    "--font-body": getFontCssVariable(config.fonts.body),
  } as CSSProperties

  return (
    <div style={{ ...themeStyle, backgroundColor: "#0A0A0A" }} className="font-body">
      <NavBar config={config} />
      <main>
        <RepairHero config={config} />
        <RepairServiceStrip config={config} />
        <RepairTrustBand config={config} />
        <RepairServices config={config} />
        <RepairWhyUs config={config} />
        <RepairTestimonials config={config} />
        <ServiceArea config={config} />
        <RepairCTA config={config} />
      </main>
      <Footer config={config} />
    </div>
  )
}
