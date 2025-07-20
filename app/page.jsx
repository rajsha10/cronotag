"use client"

import { motion } from "framer-motion"
import { ArrowRight, Database, Lock, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { AnimatedButton } from "@/components/ui/animated-button"
import { CardHover } from "@/components/ui/card-hover"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Hero from "@/components/Hero";

export default function Home() {

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="flex flex-col">
        <>
          <Navbar />
          <Hero />
          {/* Features Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={0}
                className="text-center max-w-2xl mx-auto mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-heading mb-4">
                  Why Choose{" "}
                  <span className="bg-gradient-to-r from-dark-red to-blue-primary bg-clip-text text-transparent">
                    Crono Tag
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  Secure your research with cutting-edge blockchain technology! Our 
                  platform creates timestamped, immutable records, providing undeniable 
                  proof of your work's existence and safeguarding your intellectual property rights. 
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Lock className="h-10 w-10 text-dark-red" />,
                    title: "Immutable Records",
                    description:
                      "Once registered, your research data cannot be altered, providing permanent proof of your work.",
                  },
                  {
                    icon: <Database className="h-10 w-10 text-dark-pink" />,
                    title: "Decentralized Storage",
                    description: "Your data is stored across a distributed network, eliminating single points of failure.",
                  },
                  {
                    icon: <Shield className="h-10 w-10 text-blue-primary" />,
                    title: "Cryptographic Security",
                    description: "Advanced encryption ensures your intellectual property remains secure and tamper-proof.",
                  },
                  {
                    icon: <Zap className="h-10 w-10 text-blue-secondary" />,
                    title: "Instant Verification",
                    description: "Verify the authenticity and timestamp of any research with a simple search.",
                  },
                  {
                    icon: <Lock className="h-10 w-10 text-dark-red" />,
                    title: "Proof of Existence",
                    description:
                      "Establish undeniable proof that your research existed at a specific point in time, protecting your intellectual property rights.",
                  },
                  {
                    icon: <Zap className="h-10 w-10 text-blue-primary" />,
                    title: "Global Accessibility",
                    description:
                      "Access your research data from anywhere in the world, at any time, with proper authentication.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    custom={index * 0.2 + 1}
                  >
                    <CardHover>
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 rounded-full bg-secondary p-3">{feature.icon}</div>
                        <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardHover>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={0}
                className="text-center max-w-2xl mx-auto mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-heading mb-4">
                  How{" "}
                  <span className="bg-gradient-to-r from-dark-red to-blue-primary bg-clip-text text-transparent">
                    It Works
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  Securing your research with Crono Tag is a simple, three-step process
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Register",
                    description: "Upload your research data and metadata to our secure platform.",
                  },
                  {
                    step: "02",
                    title: "Timestamp",
                    description: "Your data is cryptographically timestamped and recorded on the blockchain.",
                  },
                  {
                    step: "03",
                    title: "Verify",
                    description: "Receive a unique 12-digit Crono Tag to verify and access your research anytime.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    custom={index * 0.2 + 1}
                  >
                    <div className="relative">
                      <div className="absolute -top-6 -left-6 text-6xl font-bold opacity-10">{step.step}</div>
                      <CardHover className="relative z-10">
                        <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </CardHover>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-dark-red to-blue-primary opacity-90"></div>
                <div className="relative z-10 px-6 py-12 md:px-12 md:py-16 text-center">
                  <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">Ready to Secure Your Research?</h2>
                  <p className="text-white/80 max-w-2xl mx-auto mb-8">
                    Join thousands of researchers who trust Crono Tag to protect their intellectual property!
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <AnimatedButton className="bg-white text-dark-red hover:bg-white/90" glowOnHover={false} size="lg">
                      <Link href="/register" className="flex items-center gap-2">
                        Register Now <ArrowRight size={16} />
                      </Link>
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      glowOnHover={false}
                      size="lg"
                    >
                      <Link href="/search">Search Existing Tags</Link>
                    </AnimatedButton>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
          <Footer />
        </>
    </div>
  )
}

