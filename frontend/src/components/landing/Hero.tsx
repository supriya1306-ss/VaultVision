"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
};

export function Hero() {
  return (
    <section className="relative overflow-visible pt-32 pb-32 sm:pt-40 sm:pb-48 font-sans">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 lg:px-8 max-w-7xl relative z-10"
      >
        <div className="mx-auto max-w-4xl text-center">

          <motion.h1
            variants={itemVariants}
            className="text-6xl font-extrabold tracking-tight text-white sm:text-8xl mb-8 leading-[1.1]"
          >
            Stop Piracy. Protect <br/>
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,174,239,0.3)]">
              Sports Media.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-xl leading-relaxed text-slate-300 max-w-2xl mx-auto font-medium"
          >
            AI-powered detection, risk intelligence, and instant evidence reports. Safeguard your most valuable digital assets with our premium enterprise platform.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button size="lg" className="min-w-[200px] h-16 text-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_10px_30px_rgba(6,182,212,0.4)]">
              Revenue Works
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px] h-16 text-lg border-white/20 hover:border-white/40">
              Get Started
            </Button>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
          >
            {/* Trusted by placeholders */}
            {['EPL', 'NBA', 'F1', 'UFC'].map((league) => (
              <div key={league} className="flex items-center justify-center text-xl font-black tracking-widest text-white/40 italic">
                {league}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
