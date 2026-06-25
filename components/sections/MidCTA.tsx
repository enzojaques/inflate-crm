"use client"

import { ThemeConfig } from "@/lib/theme"
import { FadeUp } from "@/components/ui/SectionWrapper"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MidCTAProps {
  config: ThemeConfig
}

export function MidCTA({ config }: MidCTAProps) {
  return (
    <section
      className="py-14 text-center"
      style={{ backgroundColor: "var(--color-secondary)" }}
    >
      <FadeUp className="mx-auto max-w-3xl px-4 md:px-8">
        <h2 className="font-heading text-2xl font-bold uppercase text-white md:text-3xl">
          {config.brand.tagline}
        </h2>
        <a
          href="#contact"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex uppercase tracking-wide")}
        >
          Schedule an Appointment Today
        </a>
      </FadeUp>
    </section>
  )
}
