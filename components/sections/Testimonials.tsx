"use client"

import { ThemeConfig } from "@/lib/theme"
import { SectionWrapper, FadeUp, StaggerGrid, StaggerItem } from "@/components/ui/SectionWrapper"

interface TestimonialsProps {
  config: ThemeConfig
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill={filled ? "var(--color-primary)" : "none"}
      stroke="var(--color-primary)"
      strokeWidth={1.5}
    >
      <path
        d="M12 2.5l2.9 6.1 6.6.6-5 4.5 1.5 6.5L12 16.9 6 20.2l1.5-6.5-5-4.5 6.6-.6L12 2.5z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Testimonials({ config }: TestimonialsProps) {
  return (
    <SectionWrapper id="testimonials" dark>
      <FadeUp className="text-center">
        <p
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--color-primary)" }}
        >
          Impressive Words
        </p>
        <h2 className="font-heading mt-2 text-3xl font-bold uppercase text-white md:text-4xl">
          From Happy Customers
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {config.testimonials.map((testimonial) => (
          <StaggerItem key={testimonial.name}>
            <div className="h-full border border-white/10 bg-white/5 p-6 shadow-lg md:p-8">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} filled={i < testimonial.rating} />
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-white/90">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="mt-6">
                <p className="text-sm font-bold text-white">{testimonial.name}</p>
                <p className="text-xs text-white/60">{testimonial.location}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </SectionWrapper>
  )
}
