"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Phone } from "lucide-react"
import { ThemeConfig } from "@/lib/theme"

const spring = { type: "spring", stiffness: 60, damping: 18 } as const
const snapSpring = { type: "spring", stiffness: 400, damping: 30 } as const

const TECH_IMG =
  "https://images.unsplash.com/photo-1539331586018-346b53b2aaa4?w=1200&auto=format&fit=crop&q=80"

export function RepairWhyUs({ config }: { config: ThemeConfig }) {
  return (
    <section id="why-us" className="bg-[#0A0A0A] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-8 md:px-12">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...spring }}
            className="relative"
          >
            <img
              src={TECH_IMG}
              alt="Phone repair technician at work"
              className="aspect-[4/5] w-full object-cover"
            />
            {/* Offset red border */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full border-2 border-[#D42B2B]" />
            {/* Floating badge */}
            <div className="absolute right-5 top-5 bg-[#D42B2B] p-5 text-center text-white">
              <div className="font-heading text-3xl font-bold leading-none">10K+</div>
              <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-widest opacity-90">
                Devices Fixed
              </div>
            </div>
          </motion.div>

          {/* Content column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-[#D42B2B]" />
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D42B2B]">
                Why Choose Us
              </span>
            </div>
            <h2 className="font-heading mb-10 text-[clamp(2.4rem,4vw,3.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-white">
              {config.whyUs.headline}
            </h2>

            <div className="space-y-6">
              {config.whyUs.points.slice(0, 6).map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...spring, delay: i * 0.07 }}
                  className="flex gap-4"
                >
                  <CheckCircle2
                    size={17}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-[#D42B2B]"
                  />
                  <div>
                    <h3 className="mb-1 text-sm font-bold text-white">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-white/45">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-5 border-t border-white/10 pt-8">
              <motion.a
                href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={snapSpring}
                className="inline-flex items-center gap-2.5 bg-[#D42B2B] px-7 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#B02222]"
              >
                <Phone size={15} strokeWidth={2.5} />
                Call Now
              </motion.a>
              <span className="text-sm text-white/35">{config.brand.phone}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
