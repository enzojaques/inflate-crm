import type { Metadata } from "next"

import "./globals.css"
import { getAllFontVariables } from "@/lib/fonts"

export const metadata: Metadata = {
  title: "NA Web Services — Client Previews",
  description: "Client website previews by NA Web Services.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={getAllFontVariables()}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
