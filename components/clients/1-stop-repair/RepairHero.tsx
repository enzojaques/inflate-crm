"use client"

import React from "react"
import { motion } from "framer-motion"
import { Phone, Clock, Shield, Wrench } from "lucide-react"
import { ThemeConfig } from "@/lib/theme"

const CRACKED_PHONE_IMG =
  "https://plus.unsplash.com/premium_photo-1725207397701-45e1dc41d745?w=1400&auto=format&fit=crop&q=80"

const benefits = [
  { icon: Clock, text: "Same-Day Service" },
  { icon: Shield, text: "No Fix, No Fee" },
  { icon: Wrench, text: "All Major Brands" },
]

export function RepairHero({ config }: { config: ThemeConfig }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0A0A]">
      {/* Right-side photo */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-full w-[58%]">
          <img
            src={CRACKED_PHONE_IMG}
            alt=""
            className="h-full w-full object-cover object-center opacity-45"
          />
          {/* Left gradient fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
          {/* Top + bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/60" />
        </div>
      </div>

      {/* Red left edge bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#D42B2B]" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-24 pt-36 md:px-12">
        <div className="max-w-[600px]">
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-[#D42B2B]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D42B2B]">
              San Antonio&apos;s #1 Phone Repair Shop
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="font-heading text-[clamp(4.5rem,10vw,8.5rem)] font-bold uppercase leading-[0.88] tracking-tight"
          >
            <span className="block text-white">CRACKED</span>
            <span className="block text-[#D42B2B]">SCREEN?</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-7 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
          >
            {config.hero.subheadline}
          </motion.p>

          {/* Benefit chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {benefits.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 border border-white/15 px-4 py-2.5 backdrop-blur-sm"
              >
                <Icon size={13} className="text-[#D42B2B]" strokeWidth={2.5} />
                <span className="text-sm font-medium text-white/85">{text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <a
              href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-3 bg-[#D42B2B] px-8 py-5 text-base font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#B02222]"
            >
              <Phone size={18} strokeWidth={2.5} />
              {config.brand.phone}
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/50 transition-colors hover:text-white"
            >
              Our Services
              <span className="text-[#D42B2B] transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom address bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 py-4 px-8 md:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-white/30">
            1618 Bandera Rd · San Antonio, TX 78228
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-widest text-white/30 md:block">
            Walk-Ins Welcome
          </span>
        </div>
      </div>
    </section>
  )
}
