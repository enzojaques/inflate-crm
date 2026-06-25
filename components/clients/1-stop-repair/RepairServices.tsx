"use client"

import * as LucideIcons from "lucide-react"
import { LucideIcon, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

function resolveIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  return icons[name] ?? HelpCircle
}

export function RepairServices({ config }: { config: ThemeConfig }) {
  return (
    <section id="services" className="bg-[#FAFAFA] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-8 md:px-12">
        {/* Section header */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px w-8 bg-[#D42B2B]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D42B2B]">
                What We Do
              </span>
            </div>
            <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] font-bold uppercase leading-[0.9] tracking-tight text-[#0A0A0A]">
              WHAT WE<br />FIX
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#777777] md:text-right">
            Every major brand, every major issue. If it has a screen, we can fix it.
          </p>
        </div>

        {/* Card grid — gap-px + bg creates the border-line effect */}
        <div className="grid grid-cols-1 gap-px bg-[#E0E0E0] md:grid-cols-2 lg:grid-cols-3">
          {config.services.map((service, i) => {
            const Icon = resolveIcon(service.icon)
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group bg-[#FAFAFA] p-8 transition-colors duration-300 hover:bg-[#0A0A0A]"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center bg-[#D42B2B]/8 transition-colors group-hover:bg-[#D42B2B]/20">
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      className="text-[#D42B2B]"
                    />
                  </div>
                  <span className="font-heading text-[4rem] font-bold leading-none text-[#0A0A0A]/[0.04] transition-colors group-hover:text-white/[0.04]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-heading mb-3 text-xl font-bold uppercase tracking-tight text-[#0A0A0A] transition-colors group-hover:text-white">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#777777] transition-colors group-hover:text-white/55">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
