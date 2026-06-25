"use client"

import { motion } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

export function RepairTrustBand({ config }: { config: ThemeConfig }) {
  return (
    <section className="bg-[#111111] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-8 md:px-12">
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-0">
          {config.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Divider */}
              {i < 2 && (
                <div className="absolute right-0 top-1/2 hidden h-14 w-px -translate-y-1/2 bg-white/10 md:block" />
              )}
              <div className="font-heading text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none tracking-tight text-white">
                {stat.value}
              </div>
              <div className="mt-2.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/35">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
