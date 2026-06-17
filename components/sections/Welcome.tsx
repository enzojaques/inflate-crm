"use client"

import { ThemeConfig } from "@/lib/theme"
import { SectionWrapper, FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/SectionWrapper"

interface WelcomeProps {
  config: ThemeConfig
}

export function Welcome({ config }: WelcomeProps) {
  return (
    <SectionWrapper id="contact">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <FadeUp>
            <span
              className="inline-block h-1 w-10"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
            <p
              className="mt-3 text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--color-primary)" }}
            >
              Welcome to {config.brand.name}
            </p>
            <h2
              className="font-heading mt-2 text-3xl font-bold uppercase leading-tight md:text-4xl"
              style={{ color: "var(--color-text)" }}
            >
              {config.whyUs.headline}
            </h2>
            <p
              className="mt-5 text-base leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {config.hero.subheadline}
            </p>
          </FadeUp>

          <StaggerGrid className="mt-10 grid grid-cols-3 gap-4">
            {config.stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div
                  className="flex flex-col items-center gap-3 rounded-full border border-dashed p-4 text-center aspect-square justify-center"
                  style={{ borderColor: "var(--color-primary)" }}
                >
                  <span
                    className="font-heading text-2xl font-bold md:text-3xl"
                    style={{ color: "var(--color-text)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs font-medium leading-tight"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        <FadeUp delay={0.1}>
          <img
            src={config.whyUs.images?.[0] ?? "/images/industries/landscaping/why-us-1.jpg"}
            alt=""
            className="size-full max-h-[480px] w-full border object-cover"
            style={{ borderColor: "var(--color-border)" }}
          />
        </FadeUp>
      </div>
    </SectionWrapper>
  )
}
