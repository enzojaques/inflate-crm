import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { configs, getConfig } from "@/configs"
import { getFontCssVariable } from "@/lib/fonts"
import { PasswordGate } from "@/components/ui/PasswordGate"
import { NavBar } from "@/components/ui/NavBar"
import { Hero } from "@/components/sections/Hero"
import { Services } from "@/components/sections/Services"
import { Welcome } from "@/components/sections/Welcome"
import { MidCTA } from "@/components/sections/MidCTA"
import { WhyUs } from "@/components/sections/WhyUs"
import { ServiceArea } from "@/components/sections/ServiceArea"
import { Testimonials } from "@/components/sections/Testimonials"
import { Process } from "@/components/sections/Process"
import { Partners } from "@/components/sections/Partners"
import { CTA } from "@/components/sections/CTA"
import { Footer } from "@/components/sections/Footer"

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return Object.keys(configs).map((slug) => ({ slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const config = getConfig(params.slug)
  if (!config) {
    return { title: "Preview Not Found" }
  }
  return {
    title: `${config.brand.name} — Preview`,
    description: config.brand.tagline,
  }
}

export default function ClientPreviewPage({ params }: PageProps) {
  const config = getConfig(params.slug)

  if (!config) {
    notFound()
  }

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

  const site = (
    <div
      style={{ ...themeStyle, backgroundColor: "var(--color-background)" }}
      className="font-body"
    >
      <NavBar config={config} />
      <main>
        <Hero config={config} />
        <Services config={config} />
        <Welcome config={config} />
        <MidCTA config={config} />
        <WhyUs config={config} />
        <ServiceArea config={config} />
        <Testimonials config={config} />
        <Process config={config} />
        <Partners config={config} />
        <CTA config={config} />
      </main>
      <Footer config={config} />
    </div>
  )

  if (config.password) {
    return (
      <div style={themeStyle}>
        <PasswordGate config={config}>{site}</PasswordGate>
      </div>
    )
  }

  return site
}
