"use client"

import { motion } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={14} height={14} viewBox="0 0 24 24" fill="#D42B2B">
          <path d="M12 2.5l2.9 6.1 6.6.6-5 4.5 1.5 6.5L12 16.9 6 20.2l1.5-6.5-5-4.5 6.6-.6L12 2.5z" />
        </svg>
      ))}
    </div>
  )
}

export function RepairTestimonials({ config }: { config: ThemeConfig }) {
  return (
    <section id="testimonials" className="bg-[#F4F4F4] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-8 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-8 bg-[#D42B2B]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#D42B2B]">
              Happy Customers
            </span>
          </div>
          <h2 className="font-heading text-[clamp(3rem,6vw,5rem)] font-bold uppercase leading-[0.9] tracking-tight text-[#0A0A0A]">
            REAL PEOPLE,<br />REAL RESULTS
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {config.testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative border-l-4 border-[#D42B2B] bg-white p-8 shadow-sm"
            >
              {/* Giant quote mark */}
              <div className="font-heading pointer-events-none absolute right-6 top-3 select-none text-[6rem] font-bold leading-none text-[#D42B2B]/[0.06]">
                "
              </div>

              <StarRow count={t.rating} />

              <p className="mt-5 text-sm leading-relaxed text-[#444444]">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="mt-7 flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center bg-[#D42B2B] font-heading text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">{t.name}</p>
                  <p className="text-xs text-[#999999]">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
