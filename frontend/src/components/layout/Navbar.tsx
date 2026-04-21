"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300 pointer-events-auto"
    >
      <div className="absolute inset-0 bg-[#0a051d]/60 backdrop-blur-xl border-b border-white/5 shadow-2xl transition-all duration-300" />
      <nav className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto relative z-10" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-4 group">
            <div className="h-12 w-12 relative rounded-full bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:bg-white/20 group-hover:border-primary/50 shadow-lg shadow-black/20">
              <img src="/logo.png" alt="VaultVision Logo" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
        

        <div className="hidden lg:flex lg:gap-x-12">
          {['Impact', 'Product', 'Use Cases'].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <Link href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-6">
          <Link href="/login" className="text-sm font-semibold leading-6 text-slate-300 hover:text-white">
            Log in
          </Link>
          <Link href="/demo" className="rounded-full bg-primary/20 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/30">
            Request Demo
          </Link>
        </div>
      </nav>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full bg-[#0a051d]/95 backdrop-blur-xl border-b border-white/5 p-4 shadow-xl"
        >
          <div className="space-y-4">
            {['Impact', 'Product', 'Use Cases'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-base font-semibold text-slate-300 hover:text-white p-2">
                {item}
              </a>
            ))}
            <hr className="border-white/5" />
            <Link href="/login" className="block text-base font-semibold text-slate-300 p-2">Log in</Link>
            <Link href="/demo" className="block text-base font-bold text-primary p-2">Request Demo</Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
