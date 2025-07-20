"use client";

import React from "react";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function CronoTagComponent() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
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
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
          >
            <AceternityLogo />
            <span>Aceternity UI</span>
          </HoverBorderGradient>
          <Sparkles size={14} className="text-red-400" /> Introducing Crono-Tag
        </span>
      </motion.span>
    </motion.div>
  );
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};