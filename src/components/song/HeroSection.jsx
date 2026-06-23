import React from "react";
import { motion } from "framer-motion";
import { Car, Music } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
      >
        <Music className="w-4 h-4" />
        AI-Powered Song Generator
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-heading font-black tracking-tight leading-none"
      >
        <span className="text-foreground">DROP A </span>
        <span className="text-primary drop-shadow-[0_0_30px_rgba(0,200,220,0.6)]">
          BEAT
        </span>
        <span className="text-foreground"> FOR YOUR </span>
        <span className="text-primary drop-shadow-[0_0_30px_rgba(0,200,220,0.6)]">
          RIDE
        </span>
        <motion.span
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="inline-block ml-3"
        >
          <Car className="w-10 h-10 sm:w-12 sm:h-12 text-primary inline" />
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
      >
        Your car deserves its own anthem. Enter your ride, pick a vibe,
        <br className="hidden sm:block" />
        and our AI writes & records a custom song just for you.
      </motion.p>
    </div>
  );
}