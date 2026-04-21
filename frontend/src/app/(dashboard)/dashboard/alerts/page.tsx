"use client";

import { motion } from "framer-motion";
import { Bell, ShieldAlert, CheckCircle, Info, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAlerts = [
  { type: "Critical", msg: "Multiple unauthorized streams detected for EPL: ARS vs CHE. Automatic blocking initiated.", time: "2 mins ago" },
  { type: "High", msg: "New copyright infringement found on YouTube (Video ID: xY7z92).", time: "25 mins ago" },
  { type: "Success", msg: "AI Model Update 2.4 success. Detection accuracy improved by 12%.", time: "2 hours ago" },
  { type: "Info", msg: "System maintenance scheduled for April 25th at 02:00 UTC.", time: "1 day ago" },
];

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Alerts & Notifications</h1>
          <p className="text-slate-400 mt-1">Manage your security notifications and system status.</p>
        </div>
        <Button variant="outline" className="rounded-full bg-white/5 border-white/10 text-white">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 flex items-start gap-4 border-l-4"
            style={{ 
              borderLeftColor: 
                alert.type === 'Critical' ? '#fb7185' : 
                alert.type === 'High' ? '#fbbf24' : 
                alert.type === 'Success' ? '#34d399' : '#60a5fa' 
            }}
          >
            <div className="mt-1">
              {alert.type === 'Critical' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
              {alert.type === 'High' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
              {alert.type === 'Success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
              {alert.type === 'Info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  alert.type === 'Critical' ? 'text-rose-400' : 
                  alert.type === 'High' ? 'text-amber-400' : 
                  alert.type === 'Success' ? 'text-emerald-400' : 'text-blue-400'
                }`}>
                  {alert.type}
                </span>
                <span className="text-xs text-slate-500">{alert.time}</span>
              </div>
              <p className="mt-1 text-slate-300">{alert.msg}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
