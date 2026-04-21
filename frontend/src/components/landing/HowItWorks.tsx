"use client";

import { motion } from "framer-motion";
import { UploadCloud, Cpu, AlertTriangle, ShieldX } from "lucide-react";

const steps = [
  {
    id: "01",
    name: "Content Ingest",
    description: "Connect your live streams or upload assets via our high-speed API endpoints.",
    icon: UploadCloud,
  },
  {
    id: "02",
    name: "AI Analysis",
    description: "Our machine learning models extract visual fingerprints to detect unauthorized usage.",
    icon: Cpu,
  },
  {
    id: "03",
    name: "Risk Assessment",
    description: "Every match is cross-referenced with your licensing data to confirm rights.",
    icon: AlertTriangle,
  },
  {
    id: "04",
    name: "Enforcement Actions",
    description: "Automated takedown notices and IP blocking triggered instantly via secure protocols.",
    icon: ShieldX,
  },
];

export function HowItWorks() {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-widest bg-primary/10 w-fit mx-auto px-4 py-1 rounded-full">Process Flow</h2>
          <p className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gradient pb-2">
            Automated Protection Pipeline
          </p>
        </motion.div>

        <div className="mx-auto mt-24 max-w-6xl relative">
          {/* Animated Connecting Line */}
          <div className="hidden lg:block absolute top-[2.75rem] left-[10%] right-[10%] h-[2px]">
            <div className="w-full h-full bg-white/10" />
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-cyan-400 shadow-[0_0_10px_#00AEEF]"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center group z-10"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#0a051d] backdrop-blur-xl border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-2xl relative"
                >
                  <div className="absolute inset-0 bg-primary/5 rounded-[2rem] group-hover:bg-primary/20 transition-all" />
                  <step.icon className="h-9 w-9 text-primary relative z-10" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center border-4 border-[#0a051d]">
                    {step.id}
                  </div>
                </motion.div>
                
                <h3 className="mt-8 text-xl font-bold text-white uppercase tracking-tighter">
                  {step.name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-slate-400 px-6 group-hover:text-slate-300 transition-colors">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
