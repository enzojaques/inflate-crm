"use client"

import { Phone } from "lucide-react"

import { ThemeConfig } from "@/lib/theme"
import { FadeUp } from "@/components/ui/SectionWrapper"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CTAProps {
  config: ThemeConfig
}

export function CTA({ config }: CTAProps) {
  return (
    <section
      className="py-16 text-center md:py-20"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <FadeUp className="mx-auto max-w-3xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold uppercase text-white md:text-5xl">
          {config.cta.headline}
        </h2>
        <p className="mt-4 text-base text-white/80 md:text-lg">{config.cta.subtext}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
          <a
            href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
            className="flex items-center gap-2 text-lg font-bold text-white"
          >
            <Phone size={20} strokeWidth={2} />
            {config.brand.phone}
          </a>
          <a
            href="#contact"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex border-white uppercase tracking-wide text-white hover:bg-white hover:text-[var(--color-primary)]"
            )}
          >
            {config.cta.buttonText}
          </a>
        </div>
      </FadeUp>
    </section>
  )
}
