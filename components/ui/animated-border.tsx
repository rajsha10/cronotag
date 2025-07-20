"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface AnimatedBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  duration?: number
  borderWidth?: number
  borderRadius?: number
  colors?: string[]
}

export function AnimatedBorder({
  children,
  className,
  containerClassName,
  duration = 8,
  borderWidth = 4,
  borderRadius = 22,
  colors = ["#2437ae", "#388eda", "#134611", "#0A2342"],
}: AnimatedBorderProps) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("relative", containerClassName)}>
      <div
        className="absolute inset-0 rounded-[inherit] z-0 overflow-hidden"
        style={{
          borderRadius: `${borderRadius}px`,
        }}
      >
        <div
          className="absolute inset-[-2px] z-[-1]"
          style={{
            background: `conic-gradient(from ${rotation}deg, ${colors.join(", ")})`,
            borderRadius: `${borderRadius}px`,
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.1s ease",
          }}
        />
      </div>
      <div
        className={cn("relative z-10 bg-black rounded-[inherit]", className)}
        style={{
          borderRadius: `${borderRadius}px`,
          padding: `${borderWidth}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

