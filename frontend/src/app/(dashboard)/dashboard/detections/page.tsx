"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Download, SlidersHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockDetections = [
  { id: "DT-001", stream: "EPL: ARS vs CHE", status: "Critical", action: "Blocked", time: "2m ago", confidence: "99.8%" },
  { id: "DT-002", stream: "F1: Monaco GP", status: "High", action: "Review", time: "15m ago", confidence: "94.2%" },
  { id: "DT-003", stream: "NBA: LAL vs GSW", status: "Medium", action: "Logged", time: "1h ago", confidence: "87.5%" },
  { id: "DT-004", stream: "UFC 300 Main Card", status: "Critical", action: "Takedown Issued", time: "2h ago", confidence: "99.9%" },
  { id: "DT-005", stream: "EPL: ARS vs CHE", status: "Low", action: "Logged", time: "5h ago", confidence: "62.1%" },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Critical': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
    case 'High': return 'bg-orange-400/10 text-orange-400 border-orange-400/20';
    case 'Medium': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
    default: return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
  }
}

export default function DetectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            Live Detections
          </h1>
          <p className="text-slate-400 mt-1">Real-time alerts from your active streams.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all shadow-sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-[0_4px_15px_rgb(124,58,237,0.2)] transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Incident ID</th>
                <th className="px-6 py-4 font-semibold">Source Stream</th>
                <th className="px-6 py-4 font-semibold">Severity</th>
                <th className="px-6 py-4 font-semibold">Confidence</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Status / Action</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {mockDetections.map((detection, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  key={detection.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{detection.id}</td>
                  <td className="px-6 py-4 font-medium text-primary">{detection.stream}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(detection.status)}`}>
                      {detection.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-400">{detection.confidence}</td>
                  <td className="px-6 py-4">{detection.time}</td>
                  <td className="px-6 py-4 font-medium text-slate-400">{detection.action}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-white/5 rounded-full h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
