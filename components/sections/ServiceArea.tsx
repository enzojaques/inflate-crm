"use client"

import { MapPin } from "lucide-react"

import { ThemeConfig } from "@/lib/theme"
import { SectionWrapper, FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/SectionWrapper"

interface ServiceAreaProps {
  config: ThemeConfig
}

export function ServiceArea({ config }: ServiceAreaProps) {
  return (
    <SectionWrapper id="service-area" dark>
      <FadeUp className="text-center">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--color-primary)" }}
        >
          Areas We Serve
        </p>
        <h2 className="font-heading mt-2 text-3xl font-bold uppercase text-white md:text-4xl">
          {config.serviceArea.headline}
        </h2>
      </FadeUp>

      <StaggerGrid className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {config.serviceArea.cities.map((city) => (
          <StaggerItem key={city}>
            <div className="flex items-center gap-2">
              <MapPin
                size={18}
                strokeWidth={1.5}
                className="shrink-0"
                style={{ color: "var(--color-primary)" }}
              />
              <span className="text-sm font-medium text-white/80">{city}, {config.brand.state}</span>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionWrapper>
  )
}
