"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"
import { ThemeConfig } from "@/lib/theme"

const spring = { type: "spring", stiffness: 60, damping: 18 } as const
const snapSpring = { type: "spring", stiffness: 400, damping: 30 } as const

export function RepairCTA({ config }: { config: ThemeConfig }) {
  return (
    <section className="relative overflow-hidden bg-[#D42B2B] py-28 md:py-40">
      {/* Ghost watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-heading text-[clamp(8rem,22vw,18rem)] font-bold uppercase leading-none tracking-tight text-white/[0.05]">
          FIXED
        </span>
      </div>

      {/* Top edge rule */}
      <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#B02222]" />

      <div className="relative z-10 mx-auto max-w-4xl px-8 text-center md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring }}
          className="font-heading text-[clamp(3.5rem,9vw,7rem)] font-bold uppercase leading-[0.88] tracking-tight"
        >
          <span className="block text-white">BROKEN TODAY.</span>
          <span className="block text-[#0A0A0A]">FIXED TODAY.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.1 }}
          className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-white/70 md:text-base"
        >
          {config.cta.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.18 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-5"
        >
          <motion.a
            href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={snapSpring}
            className="inline-flex items-center gap-3 bg-[#0A0A0A] px-10 py-5 text-base font-bold uppercase tracking-[0.18em] text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <Phone size={18} strokeWidth={2.5} />
            {config.brand.phone}
          </motion.a>
          <div className="border border-white/25 px-6 py-5">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-white/65">
              Walk-Ins Welcome · No Appointment Needed
            </span>
          </div>
        </motion.div>

        {/* Address */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-white/30"
        >
          1618 Bandera Rd · San Antonio, TX 78228
        </motion.p>
      </div>
    </section>
  )
}
