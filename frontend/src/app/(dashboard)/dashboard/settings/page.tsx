"use client";

import { motion } from "framer-motion";
import { User, Lock, Bell, Globe, CreditCard, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const sections = [
    { name: "Account Profile", icon: User, desc: "Personal information and security settings." },
    { name: "API Keys", icon: Key, desc: "Manage authentication tokens for third-party integrations." },
    { name: "Notifications", icon: Bell, desc: "Configuration for email, SMS, and webhook alerts." },
    { name: "Billing", icon: CreditCard, desc: "Manage your subscription plan and payment history." },
    { name: "Organization", icon: Globe, desc: "Team members and permission management." },
    { name: "Privacy", icon: Lock, desc: "Data retention and tracking preferences." },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your workspace and global asset protection rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-6 flex items-start gap-4 hover:border-primary/30 cursor-pointer group"
          >
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
              <section.icon className="h-6 w-6 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{section.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{section.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 glass-card p-10 border-rose-500/20">
        <h3 className="text-xl font-bold text-white mb-2">Danger Zone</h3>
        <p className="text-slate-500 mb-6 font-medium">Permanently delete your account and all associated data. This action is irreversible.</p>
        <Button variant="destructive" className="rounded-full px-8 py-6">
          Delete Pipeline and Data
        </Button>
      </div>
    </div>
  );
}
