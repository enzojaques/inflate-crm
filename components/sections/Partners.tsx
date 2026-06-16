"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { ThemeConfig } from "@/lib/theme"
import { SectionWrapper, FadeUp } from "@/components/ui/SectionWrapper"

interface PartnersProps {
  config: ThemeConfig
}

const PLACEHOLDER_COUNT = 5

export function Partners({ config }: PartnersProps) {
  const partners = config.partners && config.partners.length > 0 ? config.partners : null
  const slots = partners ?? Array.from({ length: PLACEHOLDER_COUNT }, () => null)
  const scrollerRef = React.useRef<HTMLDivElement>(null)

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * 220, behavior: "smooth" })
  }

  return (
    <SectionWrapper id="partners">
      <FadeUp className="text-center">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--color-primary)" }}
        >
          View
        </p>
        <h2
          className="font-heading mt-2 text-3xl font-bold uppercase md:text-4xl"
          style={{ color: "var(--color-text)" }}
        >
          Our Partners
        </h2>
      </FadeUp>

      <div className="mt-10 flex items-center gap-4">
        <button
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          className="hidden size-10 shrink-0 items-center justify-center border md:flex"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <div
          ref={scrollerRef}
          className="flex flex-1 gap-5 overflow-x-auto scroll-smooth py-2"
        >
          {slots.map((partner, index) => (
            <div
              key={partner?.name ?? index}
              className="flex h-28 w-48 shrink-0 items-center justify-center border px-4 text-center"
              style={{ borderColor: "var(--color-border)" }}
            >
              {partner ? (
                <span
                  className="text-base font-bold uppercase tracking-wide"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {partner.name}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <button
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          className="hidden size-10 shrink-0 items-center justify-center border md:flex"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>
    </SectionWrapper>
  )
}
