"use client"

import * as LucideIcons from "lucide-react"
import { LucideIcon, HelpCircle } from "lucide-react"

import { ThemeConfig } from "@/lib/theme"
import { StaggerGrid, StaggerItem } from "@/components/ui/SectionWrapper"

interface ServicesProps {
  config: ThemeConfig
}

function resolveIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  return icons[name] ?? HelpCircle
}

export function Services({ config }: ServicesProps) {
  const featured = config.services.slice(0, 4)

  return (
    <div id="services" className="relative z-10 -mt-16 px-4 md:-mt-20 md:px-8">
      <StaggerGrid className="mx-auto grid max-w-6xl grid-cols-2 gap-px md:grid-cols-4">
        {featured.map((service) => {
          const Icon = resolveIcon(service.icon)
          return (
            <StaggerItem key={service.title}>
              <div
                className="flex h-full flex-col items-center gap-3 px-4 py-8 text-center transition-transform hover:-translate-y-1"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Icon size={32} strokeWidth={1.5} className="text-white" />
                <p className="text-sm font-bold uppercase tracking-wide text-white">
                  {service.title}
                </p>
              </div>
            </StaggerItem>
          )
        })}
      </StaggerGrid>
    </div>
  )
}
