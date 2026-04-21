"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "#",
    priceMonthly: "$49",
    description: "Perfect for independent creators and small platforms.",
    features: [
      "Up to 1M events/month",
      "Standard AI detection",
      "Email & Slack alerts",
      "7-day data retention",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$199",
    description: "Ideal for growing sports media organizations.",
    features: [
      "Up to 10M events/month",
      "Custom detection heuristics",
      "Instant webhook actions",
      "Real-time Dashboard",
      "30-day data retention",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "Custom",
    description: "Full suite protection for global rights holders.",
    features: [
      "Unlimited events",
      "Dedicated legal support",
      "Custom AI model training",
      "On-premise ingestion",
      "1-year data retention",
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="relative py-32 overflow-hidden bg-transparent">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-widest bg-primary/10 w-fit mx-auto px-4 py-1 rounded-full">Pricing</h2>
          <p className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl text-gradient pb-2">
            Enterprise Asset Protection
          </p>
          <p className="mt-4 text-slate-400 text-lg">Scalable solutions for media empires of any size.</p>
        </motion.div>

        <div className="mx-auto mt-20 grid max-w-md grid-cols-1 gap-y-10 sm:mt-24 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12 px-2">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ y: -12, transition: { duration: 0.2 } }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-[2.5rem] p-10 transition-all duration-500 border relative ${
                tier.featured
                  ? "bg-[#0a051d] border-primary shadow-[0_30px_60px_rgba(0,174,239,0.2)] scale-105 z-10"
                  : "bg-white/5 border-white/5 hover:border-white/20"
              }`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(0,174,239,0.5)]">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-xl font-black leading-8 tracking-wide ${tier.featured ? "text-primary italic" : "text-white"}`}>
                {tier.name}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                {tier.description}
              </p>
              <p className="mt-8 flex items-baseline gap-x-2">
                <span className="text-5xl font-black tracking-tight text-white">
                  {tier.priceMonthly}
                </span>
                {tier.priceMonthly !== "Custom" && (
                  <span className="text-base font-medium leading-6 text-slate-500">/month</span>
                )}
              </p>
              
              <div className="mt-8">
                <Button
                  variant={tier.featured ? "default" : "outline"}
                  className={`w-full h-14 rounded-2xl ${tier.featured ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_10px_20px_rgba(6,182,212,0.3)]" : ""}`}
                >
                  {tier.priceMonthly === "Custom" ? "Contact Support" : "Start Protection"}
                </Button>
              </div>

              <ul className="mt-10 space-y-4 text-sm leading-6 text-slate-400">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-4 items-center">
                    <div className={`h-2 w-2 rounded-full ${tier.featured ? "bg-primary shadow-[0_0_8px_rgba(0,174,239,0.5)]" : "bg-slate-600"}`} />
                    <span className="group-hover:text-slate-300 transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
