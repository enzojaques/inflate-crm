import { ThemeConfig } from "@/lib/theme"

interface FooterProps {
  config: ThemeConfig
}

export function Footer({ config }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: "var(--color-secondary)" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 md:grid-cols-3 md:gap-8 md:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center text-base font-bold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {config.brand.name.charAt(0)}
            </span>
            <p className="font-heading text-base font-bold uppercase text-white">
              {config.brand.name}
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {config.footer.tagline}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-white">Services</p>
          <nav className="mt-4 flex flex-col gap-2.5">
            {config.services.map((service) => (
              <a
                key={service.title}
                href="#services"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {service.title}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-white">Useful Links</p>
          <nav className="mt-4 flex flex-col gap-2.5">
            {config.footer.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-6 space-y-1.5">
            <a
              href={`tel:${config.brand.phone.replace(/[^\d+]/g, "")}`}
              className="block text-sm font-bold text-white"
            >
              {config.brand.phone}
            </a>
            <a
              href={`mailto:${config.brand.email}`}
              className="block text-sm text-white/60"
            >
              {config.brand.email}
            </a>
            <p className="text-sm text-white/60">
              {config.brand.city}, {config.brand.state}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center md:px-8">
        <p className="text-xs text-white/40">
          {config.brand.name} {year}©
        </p>
      </div>
    </footer>
  )
}
