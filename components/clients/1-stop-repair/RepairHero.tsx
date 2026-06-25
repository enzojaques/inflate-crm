"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Phone, MapPin } from "lucide-react"
import { ThemeConfig } from "@/lib/theme"

// Dramatic cracked screen — dark, cinematic close-up
const HERO_IMG =
  "https://images.unsplash.com/photo-1553964125-e03d833522b2?w=1600&auto=format&fit=crop&q=90"

const spring = { type: "spring", stiffness: 60, damping: 18 } as const
const snapSpring = { type: "spring", stiffness: 400, damping: 30 } as const

export function RepairHero({ config }: { config: ThemeConfig }) {
  return (
    <section className="relative flex min-h-screen overflow-hidden bg-[#0A0A0A]">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2">

        {/* LEFT — editorial text column */}
        <div className="relative flex flex-col justify-center bg-[#0A0A0A] px-10 pb-20 pt-32 md:px-16 lg:pt-36">
          {/* Top red accent bar */}
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#D42B2B]" />

          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className="mb-8 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/35"
          >
            Cell Phone Repair &mdash; San Antonio, TX
          </motion.p>

          {/* Headline: filled / outline / red */}
          <h1 className="font-heading uppercase leading-[0.84] tracking-tight">
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.1 }}
              className="block text-[clamp(4rem,9vw,8rem)] font-bold text-white"
            >
              WE FIX
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.18 }}
              className="block text-[clamp(4rem,9vw,8rem)] font-bold"
              style={{
                WebkitTextStroke: "2px rgba(255,255,255,0.85)",
                color: "transparent",
              }}
            >
              CRACKED
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.26 }}
              className="block text-[clamp(4rem,9vw,8rem)] font-bold text-[#D42B2B]"
            >
              SCREENS.
            </motion.span>
          </h1>

          {/* Red rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...spring, delay: 0.35 }}
            className="mt-8 h-px w-14 origin-left bg-[#D42B2B]"
          />

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.4 }}
            className="mt-5 max-w-sm text-sm leading-relaxed text-white/50 md:text-base"
          >
            {config.hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.48 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={snapSpring}
              className="inline-flex items-center gap-3 bg-[#D42B2B] px-8 py-5 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-[#B02222] transition-colors"
            >
              <Phone size={16} strokeWidth={2.5} />
              {config.brand.phone}
            </motion.a>
            <div className="border border-white/10 px-6 py-5">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/35">
                Walk-Ins Welcome
              </span>
            </div>
          </motion.div>

          {/* Bullets */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.58 }}
            className="mt-8 flex flex-wrap gap-x-5 gap-y-1"
          >
            {config.hero.bullets?.map((b) => (
              <span key={b} className="text-[0.65rem] font-bold uppercase tracking-wider text-white/22">
                &mdash; {b}
              </span>
            ))}
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-14 flex items-center gap-2 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-white/18"
          >
            <MapPin size={10} />
            1618 Bandera Rd &middot; San Antonio &middot; TX 78228
          </motion.div>
        </div>

        {/* RIGHT — full-bleed cracked phone image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.08 }}
          className="relative hidden lg:block"
        >
          <img
            src={HERO_IMG}
            alt="Cracked phone screen close-up"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Subtle left-edge fade into the dark left column */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-transparent" />
          {/* Mirror the top bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D42B2B]" />
        </motion.div>
      </div>
    </section>
  )
}
