"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const letterAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  const title = "Crono-Tag"

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Background with single blur layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 flex items-center justify-center opacity-80 z-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-[800px] max-w-none"
          >
            {/* Single subtle blur layer */}
            <Image src="/Digital-Art-3D.gif" alt="3D Digital Art" fill className="object-cover blur-lg" priority />
          </motion.div>
        </div>

        {/* Enhanced floating gradient orbs with more vibrant colors */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-red-600/15 blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 20, 0],
            opacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={controls}
          className="max-w-full mx-auto text-center relative"
        >
          {/* Removed the additional blur card effect that was causing double-blur */}

          {/* Badge with refined animation */}
          <motion.div variants={item} className="inline-flex items-center mb-10">
            <motion.span
              className="relative inline-flex items-center rounded-full border border-white/30 bg-black/30 backdrop-blur-xl px-4 py-2 text-sm shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="relative mr-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
              </span>
              <span className="text-white/95 flex items-center gap-1">
                <Sparkles size={14} className="text-red-400" /> Introducing Crono-Tag
              </span>
            </motion.span>
          </motion.div>

          {/* Main heading with enhanced animations and typography */}
          <motion.h1 variants={item} className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-8">
            <motion.span
              className="block text-white mb-2 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Secure Your Intellectual Property with
            </motion.span>

            {/* Character-by-character animation with enhanced gradient */}
            <div className="overflow-hidden inline-block">
              <motion.div className="flex justify-center">
                {title.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterAnimation}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      duration: 0.5,
                      delay: 0.8 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className="pb-4 inline-block bg-gradient-to-r from-red-400 via-purple-500 to-blue-400 bg-clip-text text-transparent font-extrabold"
                    style={{
                      textShadow: "0 0 25px rgba(255,0,128,0.3)",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.h1>

          {/* Description with reveal animation and improved typography */}
          <motion.p
            variants={item}
            className="mt-8 text-xl text-white/90 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Immutable, timestamped, tag secured blockchain records ensuring your digital assets remain protected,
            verifiable, and future-proof in the decentralized ecosystem.
          </motion.p>

          {/* CTA buttons with enhanced hover effects and accessibility */}
          <motion.div variants={item} className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="relative group bg-gradient-to-r from-red-500 to-blue-500 text-white border-none h-14 px-8 text-lg font-medium"
            >
              <Link href="/register">
                <motion.span
                  className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-red-400 to-blue-400 opacity-0 blur transition duration-300 group-hover:opacity-70 group-hover:blur-xl"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                ></motion.span>
                <motion.span
                  className="relative flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Register IP <ArrowRight className="ml-2 h-5 w-5" />
                </motion.span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="relative group border-white/30 bg-black/20 backdrop-blur-sm text-white h-14 px-8 text-lg font-medium hover:bg-black/40"
            >
              <Link href="/search">
                <motion.span
                  className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 blur transition duration-300 group-hover:opacity-50 group-hover:blur-xl"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                ></motion.span>
                <motion.span
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  SEARCH TAGS
                </motion.span>
              </Link>
            </Button>
          </motion.div>

          {/* Stats with staggered animations and enhanced hover effects */}
          <motion.div variants={item} className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: "Transactions", value: "coming soon", icon: "⚡" },
              { label: "Security Score", value: "coming soon", icon: "🔒" },
              { label: "Users Worldwide", value: "joining soon", icon: "🌐" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-red-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 blur-lg transition duration-300"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                ></motion.div>
                <div className="relative rounded-xl border border-white/20 bg-black/20 backdrop-blur-sm p-6 h-full flex flex-col items-center justify-center shadow-lg">
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced floating particles with varied sizes and colors */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 3 === 0 ? "bg-red-400/20" : i % 3 === 1 ? "bg-blue-400/20" : "bg-purple-400/20"
              }`}
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -100 - 50],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}