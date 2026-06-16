"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { ThemeConfig } from "@/lib/theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PasswordGateProps {
  config: ThemeConfig
  children: React.ReactNode
}

export function PasswordGate({ config, children }: PasswordGateProps) {
  const storageKey = `preview-${config.slug}`
  const [unlocked, setUnlocked] = React.useState(false)
  const [checked, setChecked] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    const stored = window.sessionStorage.getItem(storageKey)
    setUnlocked(stored === "true")
    setChecked(true)
  }, [storageKey])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === config.password) {
      window.sessionStorage.setItem(storageKey, "true")
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (!checked) {
    return null
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-secondary)" }}
    >
      <div
        className="w-full max-w-sm border p-8 md:p-10"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-border)",
        }}
      >
        <p
          className="font-heading text-xl font-bold"
          style={{ color: "var(--color-text)" }}
        >
          {config.brand.name}
        </p>
        <p
          className="mt-1 text-sm uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          Private Preview
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <motion.div
            animate={error ? { x: [0, -8, 8, -8, 8, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Input
              type="password"
              autoFocus
              placeholder="Enter password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
              className={error ? "border-red-600 focus-visible:border-red-600" : ""}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-600"
              >
                Incorrect password
              </motion.p>
            )}
          </AnimatePresence>

          <Button type="submit" className="w-full">
            Enter
          </Button>
        </form>
      </div>
    </div>
  )
}
