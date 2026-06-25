"use client"

import { motion } from "framer-motion"
import { Phone } from "lucide-react"
import { ThemeConfig } from "@/lib/theme"

export function RepairCTA({ config }: { config: ThemeConfig }) {
  return (
    <section className="relative overflow-hidden bg-[#D42B2B] py-24 md:py-36">
      {/* Ghost watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
        <span className="font-heading text-[clamp(8rem,22vw,18rem)] font-bold uppercase leading-none tracking-tight text-white/[0.04]">
          FIXED
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-8 text-center md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="font-heading text-[clamp(3.5rem,9vw,7rem)] font-bold uppercase leading-[0.88] tracking-tight"
        >
          <span className="block text-white">BROKEN TODAY.</span>
          <span className="block text-[#0A0A0A]">FIXED TODAY.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-white/75"
        >
          {config.cta.subtext}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <a
            href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-3 bg-[#0A0A0A] px-10 py-5 text-lg font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#1A1A1A]"
          >
            <Phone size={20} strokeWidth={2.5} />
            {config.brand.phone}
          </a>
          <span className="text-sm font-medium uppercase tracking-widest text-white/60">
            1618 Bandera Rd · San Antonio
          </span>
        </motion.div>
      </div>
    </section>
  )
}
