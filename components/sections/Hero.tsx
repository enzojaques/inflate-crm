"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Phone } from "lucide-react"

import { ThemeConfig } from "@/lib/theme"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface HeroProps {
  config: ThemeConfig
}

export function Hero({ config }: HeroProps) {
  const { backgroundVideo, backgroundImage } = config.hero
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [message, setMessage] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\n${message}`
    window.location.href = `mailto:${config.brand.email}?subject=${encodeURIComponent(
      `New estimate request from ${name || "website visitor"}`
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="relative isolate flex min-h-screen items-start overflow-hidden pb-20 pt-32">
      {backgroundVideo ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : backgroundImage ? (
        <img src={backgroundImage} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, var(--color-secondary) 0%, #000000 55%, var(--color-secondary) 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(115deg, var(--color-primary) 0px, var(--color-primary) 2px, transparent 2px, transparent 64px)`,
            }}
          />
        </>
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-block text-xs font-bold uppercase tracking-widest text-white"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
            >
              {config.brand.tagline}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="font-heading mt-5 max-w-2xl text-5xl font-bold uppercase leading-[1.05] text-white md:text-6xl lg:text-7xl"
            >
              {config.hero.headline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            >
              {config.hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <a
                href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex h-14 items-center justify-center gap-2.5 px-8 text-base font-bold uppercase tracking-wide text-white transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Phone size={18} strokeWidth={2.5} />
                {config.brand.phone}
              </a>
              {config.hero.ctaSecondary && (
                <a
                  href="#services"
                  className="inline-flex h-14 items-center justify-center border border-white/40 px-8 text-base font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10"
                >
                  {config.hero.ctaSecondary}
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="ml-auto w-full max-w-sm border border-white/10 p-6 shadow-2xl"
            style={{ backgroundColor: "var(--color-secondary)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
              Free Inspection
            </p>
            <h3 className="font-heading mt-1 text-lg font-bold uppercase text-white">
              Get a Free Estimate
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  type="tel"
                  placeholder="Phone *"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white"
                />
                <Input
                  type="email"
                  placeholder="Email *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-9 bg-white text-sm"
              />
              <Textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-24 bg-white"
              />
              <Button type="submit" className="w-full uppercase tracking-wide" size="lg">
                Get Free Estimate
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
