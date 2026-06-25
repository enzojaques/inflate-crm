"use client"

import * as React from "react"
import * as LucideIcons from "lucide-react"
import { LucideIcon, HelpCircle, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

function resolveIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  return icons[name] ?? HelpCircle
}

const spring = { type: "spring", stiffness: 300, damping: 28 } as const

export function RepairServices({ config }: { config: ThemeConfig }) {
  const [activeRow, setActiveRow] = React.useState<number | null>(null)

  return (
    <section id="services" className="bg-[#F7F6F3] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-8 md:px-12">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-6 bg-[#D42B2B]" />
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#D42B2B]">
                Services
              </span>
            </div>
            <h2 className="font-heading text-[clamp(2.8rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.88] tracking-tight text-[#0A0A0A]">
              WHAT WE<br />FIX.
            </h2>
          </div>
          <p className="max-w-[260px] text-xs leading-relaxed text-[#888888] md:text-right">
            Every major brand. Every major issue. Most repairs in under an hour.
          </p>
        </div>

        {/* Row menu */}
        <div className="divide-y divide-[#E0DDD8]">
          {config.services.map((service, i) => {
            const Icon = resolveIcon(service.icon)
            const isActive = activeRow === i

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...spring, delay: i * 0.055 }}
                onHoverStart={() => setActiveRow(i)}
                onHoverEnd={() => setActiveRow(null)}
                className="group relative cursor-default overflow-hidden"
              >
                {/* Hover fill — slides in from left */}
                <motion.div
                  initial={false}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  transition={spring}
                  className="absolute inset-0 origin-left bg-[#0A0A0A]"
                />

                <div className="relative flex items-center gap-6 py-5 md:py-6">
                  {/* Number */}
                  <span
                    className="font-heading w-10 shrink-0 text-sm font-bold tabular-nums transition-colors duration-200"
                    style={{ color: isActive ? "#D42B2B" : "#BBBBBB" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Icon */}
                  <div
                    className="flex size-9 shrink-0 items-center justify-center transition-colors duration-200"
                    style={{
                      backgroundColor: isActive ? "rgba(212,43,43,0.15)" : "rgba(0,0,0,0.05)",
                    }}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      className="transition-colors duration-200"
                      style={{ color: isActive ? "#D42B2B" : "#888888" }}
                    />
                  </div>

                  {/* Title */}
                  <span
                    className="font-heading flex-1 text-lg font-bold uppercase tracking-tight transition-colors duration-200 md:text-xl"
                    style={{ color: isActive ? "#FFFFFF" : "#0A0A0A" }}
                  >
                    {service.title}
                  </span>

                  {/* Description — reveals on hover */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        key="desc"
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="hidden max-w-xs text-xs leading-relaxed text-white/55 md:block"
                      >
                        {service.description}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 transition-all duration-200"
                    style={{
                      color: isActive ? "#D42B2B" : "#CCCCCC",
                      transform: isActive ? "rotate(0deg)" : "rotate(-45deg)",
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
