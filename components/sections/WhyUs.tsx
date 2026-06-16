"use client"

import { ThemeConfig } from "@/lib/theme"
import { SectionWrapper, FadeUp } from "@/components/ui/SectionWrapper"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WhyUsProps {
  config: ThemeConfig
}

const SECTION_LABELS = ["What Sets Us Apart", "Core Values"]

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}

export function WhyUs({ config }: WhyUsProps) {
  const groups = chunk(config.whyUs.points, 3)

  return (
    <SectionWrapper id="why-us" className="space-y-20 md:space-y-28">
      {groups.map((points, index) => {
        const alt = index % 2 === 1
        return (
          <div key={SECTION_LABELS[index] ?? index} className="relative">
            <span
              aria-hidden
              className="font-heading pointer-events-none absolute -top-10 select-none text-[10rem] font-bold leading-none opacity-[0.04] md:text-[14rem]"
              style={{ color: "var(--color-text)", [alt ? "right" : "left"]: 0 } as React.CSSProperties}
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <div
              className={cn(
                "relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16",
                alt && "lg:[&>*:first-child]:order-2"
              )}
            >
              <FadeUp>
                {config.whyUs.images?.[index] ? (
                  <img
                    src={config.whyUs.images[index]}
                    alt=""
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div
                    className="aspect-[4/3] w-full"
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`,
                    }}
                  />
                )}
              </FadeUp>

              <FadeUp delay={0.1}>
                <span
                  className="inline-block h-1 w-10"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <p
                  className="mt-3 text-sm font-bold uppercase tracking-widest"
                  style={{ color: "var(--color-primary)" }}
                >
                  {config.whyUs.headline}
                </p>
                <h2
                  className="font-heading mt-2 text-3xl font-bold uppercase leading-tight md:text-4xl"
                  style={{ color: "var(--color-text)" }}
                >
                  {SECTION_LABELS[index] ?? config.whyUs.headline}
                </h2>

                <dl className="mt-7 space-y-5">
                  {points.map((point) => (
                    <div key={point.title}>
                      <dt
                        className="text-base font-bold"
                        style={{ color: "var(--color-text)" }}
                      >
                        {point.title}:
                      </dt>
                      <dd
                        className="mt-1 text-sm leading-relaxed"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {point.description}
                      </dd>
                    </div>
                  ))}
                </dl>

                <a
                  href="#contact"
                  className={cn(buttonVariants(), "mt-8 inline-flex uppercase tracking-wide")}
                >
                  About Us
                </a>
              </FadeUp>
            </div>
          </div>
        )
      })}
    </SectionWrapper>
  )
}
