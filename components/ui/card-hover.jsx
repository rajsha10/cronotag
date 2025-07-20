"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function CardHover({ children, className, glowOnHover = true }) {
  return (
    <motion.div
      className={cn("rounded-lg border border-border bg-card p-6 shadow-sm transition-all duration-300", className)}
      whileHover={{
        y: -5,
        boxShadow: glowOnHover
          ? "0 10px 25px -5px rgba(255, 51, 102, 0.4), 0 8px 10px -6px rgba(67, 97, 238, 0.3)"
          : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

