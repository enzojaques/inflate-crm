"use client"

import { motion } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

const spring = { type: "spring", stiffness: 55, damping: 16 } as const

export function RepairTrustBand({ config }: { config: ThemeConfig }) {
  return (
    <section className="overflow-hidden bg-[#111111]">
      <div className="mx-auto max-w-6xl px-8 py-16 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {config.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ...spring, delay: i * 0.1 }}
              className="relative"
            >
              {/* Vertical divider */}
              {i < 2 && (
                <div className="absolute -right-6 top-0 hidden h-full w-px bg-white/6 md:block" />
              )}

              {/* Stat value */}
              <div
                className="font-heading text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none tracking-tight"
                style={{
                  WebkitTextStroke: i === 1 ? "1.5px rgba(212,43,43,0.7)" : "0",
                  color: i === 1 ? "transparent" : "#fff",
                }}
              >
                {stat.value}
              </div>

              {/* Label */}
              <div className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-white/30">
                {stat.label}
              </div>

              {/* Red accent line under each stat */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: i * 0.1 + 0.2 }}
                className="mt-4 h-[2px] w-8 origin-left bg-[#D42B2B]"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom manifesto line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 border-t border-white/6 pt-8 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-white/20"
        >
          Most repairs completed same-day &mdash; no appointment needed &mdash; 1618 Bandera Rd, San Antonio
        </motion.p>
      </div>
    </section>
  )
}
