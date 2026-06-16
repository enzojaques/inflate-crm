"use client"

import * as React from "react"
import { Menu, X, Phone } from "lucide-react"

import { ThemeConfig } from "@/lib/theme"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavBarProps {
  config: ThemeConfig
}

export function NavBar({ config }: NavBarProps) {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = config.footer.links

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white" : "bg-transparent"
      )}
      style={{
        boxShadow: scrolled ? "0 1px 0 var(--color-border), 0 4px 16px rgba(0,0,0,0.06)" : "none",
        borderBottom: scrolled ? "3px solid var(--color-primary)" : "3px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <a href="#" className="flex items-center gap-2.5">
          <span
            className="flex size-9 shrink-0 items-center justify-center text-base font-bold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {config.brand.name.charAt(0)}
          </span>
          <span
            className="font-heading text-base font-bold uppercase tracking-wide leading-tight transition-colors"
            style={{
              color: scrolled ? "var(--color-text)" : "#FFFFFF",
              textShadow: scrolled ? "none" : "0 1px 3px rgba(0,0,0,0.6)",
            }}
          >
            {config.brand.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-wide transition-colors hover:opacity-70"
              style={{
                color: scrolled ? "var(--color-text)" : "#FFFFFF",
                textShadow: scrolled ? "none" : "0 1px 3px rgba(0,0,0,0.6)",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
            className={cn(buttonVariants({ size: "sm" }), "uppercase tracking-wide gap-2")}
          >
            <Phone size={16} strokeWidth={2.5} />
            {config.brand.phone}
          </a>
        </div>

        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          style={{ color: scrolled ? "var(--color-text)" : "#FFFFFF" }}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white lg:hidden" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex flex-col gap-4 px-4 py-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-text)" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants(), "w-full uppercase tracking-wide gap-2")}
            >
              <Phone size={16} strokeWidth={2.5} />
              {config.brand.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
