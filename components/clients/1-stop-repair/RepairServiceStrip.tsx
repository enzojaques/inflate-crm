"use client"

import * as LucideIcons from "lucide-react"
import { LucideIcon, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

function resolveIcon(name: string): LucideIcon {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>
  return icons[name] ?? HelpCircle
}

export function RepairServiceStrip({ config }: { config: ThemeConfig }) {
  return (
    <section className="bg-[#D42B2B]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {config.services.map((service, i) => {
          const Icon = resolveIcon(service.icon)
          return (
            <motion.a
              key={service.title}
              href="#services"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col items-center gap-2.5 border-r border-white/20 px-4 py-6 text-center last:border-r-0 hover:bg-[#B02222] transition-colors duration-200 cursor-pointer"
            >
              <Icon
                size={22}
                strokeWidth={1.75}
                className="text-white/80 transition-colors group-hover:text-white"
              />
              <span className="text-xs font-bold uppercase leading-tight tracking-wide text-white/90 group-hover:text-white transition-colors">
                {service.title}
              </span>
            </motion.a>
          )
        })}
      </div>
    </section>
  )
}
