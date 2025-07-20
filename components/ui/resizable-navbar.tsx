"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface NavItem {
  name: string
  link: string
}

// Navbar container
export const Navbar = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 bg-background/80 backdrop-blur-md border-b border-border",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

// Main navbar body for desktop
export const NavBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "container hidden h-16 items-center justify-between md:flex",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Logo component
export const NavbarLogo = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn("relative", className)}
        {...props}
      >
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-600 to-blue-600 opacity-75 blur-sm"></div>
        <div className="relative rounded-lg bg-background px-3 py-1 text-xl font-bold">
          <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Crono Tag
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

// Navigation items container
export const NavItems = ({
  className,
  items,
  pathname = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  items: NavItem[]
  pathname?: string
}) => {
  return (
    <nav className={cn("flex items-center gap-6", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className={cn(
            "relative text-sm font-medium transition-colors hover:text-primary",
            pathname === item.link ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.name}
          {pathname === item.link && (
            <motion.div
              layoutId="navbar-indicator"
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500"
              transition={{ type: "spring", duration: 0.6 }}
            />
          )}
        </Link>
      ))}
    </nav>
  )
}

// Button component for navbar
export const NavbarButton = ({
  className,
  variant = "default",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}) => {
  return (
    <button
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium transition-colors",
        variant === "primary" 
          ? "bg-gradient-to-r from-pink-600 to-blue-600 hover:from-pink-700 hover:to-blue-700 text-white" 
          : "bg-transparent border border-border hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Mobile navigation container
export const MobileNav = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("md:hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Mobile navigation header
export const MobileNavHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "container flex h-16 items-center justify-between",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Mobile navigation toggle button
export const MobileNavToggle = ({
  className,
  isOpen,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean
}) => {
  return (
    <button
      className={cn("flex items-center justify-center", className)}
      onClick={onClick}
      aria-label="Toggle menu"
      {...props}
    >
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      )}
    </button>
  )
}

// Mobile navigation menu
export const MobileNavMenu = ({
  className,
  isOpen,
  onClose,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean
  onClose: () => void
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <nav className="container flex flex-col items-center justify-center gap-8 py-8">
        {children}
      </nav>
    </motion.div>
  )
}
