"use client";

import { motion } from "framer-motion";
import { Eye, BellRing, Lock, Activity } from "lucide-react";

const features = [
  {
    name: "AI Detection",
    description: "Instant unauthorized media detection using proprietary deep learning models fine-tuned on sports telemetry data.",
    icon: Eye,
  },
  {
    name: "Risk Classification",
    description: "Determines potential revenue loss and IP risk score in real-time, filtering noise from actual threats.",
    icon: Activity,
  },
  {
    name: "Evidence Reports",
    description: "Comprehensive legal evidence generated automatically for each detection, ready for takedown actions.",
    icon: BellRing,
  },
  {
    name: "Live Dashboard",
    description: "Visualize global piracy hotspots and active protection streams in an intuitive enterprise dashboard.",
    icon: Lock,
  },
];

export function Features() {
  return (
    <section className="relative py-32 bg-transparent overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-widest bg-primary/10 w-fit mx-auto px-4 py-1 rounded-full">Our Solution</h2>
          <p className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl text-gradient pb-2">
            VaultVision Real Video Features
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-400 max-w-xl mx-auto">
            Precision protection for premium media. We detect, verify, and act on global piracy instances in milliseconds.
          </p>
        </motion.div>
        
        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-28 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-10 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-20 glass-panel p-10 border-white/5 hover:border-primary/30 transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />
                
                <dt className="text-xl font-bold leading-7 text-white mb-4">
                  <div className="absolute left-8 top-10 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(0,174,239,0.2)]">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="text-base leading-7 text-slate-400 group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
