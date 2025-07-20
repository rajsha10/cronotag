"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function AnimatedButton({
  variant = "default",
  size = "default",
  children,
  className,
  glowOnHover = true,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-primary bg-transparent text-primary hover:bg-primary/10"
      case "ghost":
        return "bg-transparent text-primary hover:bg-primary/10"
      default:
        return "bg-gradient-to-r from-dark-red to-blue-primary text-white"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3 text-xs"
      case "lg":
        return "h-12 px-8 text-lg"
      default:
        return "h-10 px-6 text-sm"
    }
  }

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        getVariantClasses(),
        getSizeClasses(),
        className,
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {glowOnHover && isHovered && (
        <motion.span
          className="absolute inset-0 rounded-md bg-gradient-to-r from-dark-red to-blue-primary opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ filter: "blur(15px)" }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

