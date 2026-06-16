"use client"

import { ThemeConfig } from "@/lib/theme"
import { SectionWrapper, FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/SectionWrapper"

interface ProcessProps {
  config: ThemeConfig
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}

export function Process({ config }: ProcessProps) {
  const rows = chunk(config.process.steps, 4)
  const images = config.process.images

  return (
    <SectionWrapper id="process" alt>
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
          {config.process.headline}
        </h2>
      </FadeUp>

      <div className="mt-14 space-y-12">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative">
            <div
              className="absolute left-[12.5%] right-[12.5%] top-10 hidden border-t-2 border-dashed sm:block"
              style={{ borderColor: "var(--color-border)" }}
            />
            <StaggerGrid className="relative grid grid-cols-2 gap-8 sm:grid-cols-4">
              {row.map((step, stepIndex) => {
                const globalIndex = rowIndex * 4 + stepIndex
                const image = images && images.length > 0 ? images[globalIndex % images.length] : null
                return (
                <StaggerItem key={step.number}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          className="size-20 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex size-20 items-center justify-center rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                          }}
                        />
                      )}
                      <span
                        className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                        style={{ backgroundColor: "var(--color-secondary)" }}
                      >
                        {step.number}
                      </span>
                    </div>
                    <p
                      className="font-heading mt-4 text-sm font-bold uppercase"
                      style={{ color: "var(--color-text)" }}
                    >
                      {step.title}
                    </p>
                    <p
                      className="mt-1.5 max-w-[11rem] text-xs leading-relaxed"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
                )
              })}
            </StaggerGrid>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
