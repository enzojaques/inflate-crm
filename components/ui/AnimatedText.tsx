"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  as?: "h1" | "h2" | "h3" | "p"
  delay?: number
  className?: string
  children: React.ReactNode
}

export function AnimatedText({
  as = "h2",
  delay = 0,
  className,
  children,
}: AnimatedTextProps) {
  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
    className: cn(className),
  }

  switch (as) {
    case "h1":
      return <motion.h1 {...motionProps}>{children}</motion.h1>
    case "h3":
      return <motion.h3 {...motionProps}>{children}</motion.h3>
    case "p":
      return <motion.p {...motionProps}>{children}</motion.p>
    default:
      return <motion.h2 {...motionProps}>{children}</motion.h2>
  }
}
