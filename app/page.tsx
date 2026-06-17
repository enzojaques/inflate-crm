export default function Home() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center overflow-hidden"
      style={{
        backgroundColor: "#0d0e12",
        fontFamily: "var(--font-plus-jakarta-sans), var(--font-inter), sans-serif",
        color: "#ffffff",
      }}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 900,
          height: 600,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(45,138,254,0.18) 0%, rgba(45,138,254,0.04) 55%, transparent 80%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)",
        }}
      />

      {/* Logo — centered at top */}
      <div className="relative z-10 mt-16 flex justify-center">
        {/* mix-blend-mode: screen knocks out the white background */}
        <img
          src="/na-logo.png"
          alt="NA Web Services"
          width={220}
          style={{ mixBlendMode: "screen" }}
        />
      </div>

      {/* Heading */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-4 text-center">
        <h1
          className="max-w-xl text-4xl font-extrabold leading-[1.12] tracking-tight md:text-5xl"
        >
          Client Website
          <br />
          <span
            style={{
              backgroundImage:
                "linear-gradient(to right, #D7CEB2 0%, #9CC5FF 50%, #2D8AFE 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Previews
          </span>
        </h1>

        <p
          className="mt-5 text-sm font-medium"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <a
            href="https://nawebservices.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
            style={{ color: "rgba(156,197,255,0.6)" }}
          >
            nawebservices.com
          </a>
        </p>
      </main>
    </div>
  )
}
