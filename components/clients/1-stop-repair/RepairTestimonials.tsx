"use client"

import { motion } from "framer-motion"
import { ThemeConfig } from "@/lib/theme"

const spring = { type: "spring", stiffness: 60, damping: 18 } as const

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={12} height={12} viewBox="0 0 24 24" fill="#D42B2B">
          <path d="M12 2.5l2.9 6.1 6.6.6-5 4.5 1.5 6.5L12 16.9 6 20.2l1.5-6.5-5-4.5 6.6-.6L12 2.5z" />
        </svg>
      ))}
    </div>
  )
}

export function RepairTestimonials({ config }: { config: ThemeConfig }) {
  const [featured, ...rest] = config.testimonials
  const sideCards = rest.slice(0, 2)

  return (
    <section id="testimonials" className="bg-[#0F0F0F] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-8 md:px-12">

        {/* Header */}
        <div className="mb-14">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px w-6 bg-[#D42B2B]" />
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#D42B2B]">
              Reviews
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.8rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.88] tracking-tight text-white">
            WHAT THEY<br />SAY.
          </h2>
        </div>

        {/* Editorial asymmetric grid */}
        <div className="grid grid-cols-1 gap-px bg-white/[0.06] lg:grid-cols-[1fr_340px]">

          {/* LEFT — featured quote */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ...spring }}
            className="relative bg-[#0F0F0F] p-10 md:p-14"
          >
            {/* Giant quote mark watermark */}
            <div
              className="font-heading pointer-events-none absolute right-8 top-6 select-none text-[10rem] font-bold leading-none"
              style={{ color: "rgba(212,43,43,0.07)" }}
            >
              &ldquo;
            </div>

            <Stars count={featured.rating} />

            <p className="relative mt-8 text-xl font-medium leading-relaxed text-white/80 md:text-2xl">
              &ldquo;{featured.text}&rdquo;
            </p>

            {/* Rule */}
            <div className="mt-10 h-px w-10 bg-[#D42B2B]" />

            {/* Attribution */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center bg-[#D42B2B] font-heading text-base font-bold text-white">
                {featured.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{featured.name}</p>
                <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/35">
                  {featured.location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — two stacked cards */}
          <div className="flex flex-col gap-px">
            {sideCards.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ...spring, delay: i * 0.12 + 0.1 }}
                className="flex flex-1 flex-col justify-between bg-[#141414] p-8"
              >
                <div>
                  <Stars count={t.rating} />
                  <p className="mt-5 text-sm leading-relaxed text-white/55">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3 border-t border-white/[0.06] pt-6">
                  <div className="flex size-8 shrink-0 items-center justify-center bg-[#D42B2B]/20 font-heading text-xs font-bold text-[#D42B2B]">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/80">{t.name}</p>
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-white/25">
                      {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Google badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center gap-3"
        >
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-white/20">
            Verified Google Reviews
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>
      </div>
    </section>
  )
}
