"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Download, SlidersHorizontal, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

interface Detection {
  id: number;
  asset_name: string;
  similarity: string;
  risk_level: string;
  status: string;
  timestamp: string;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'HIGH': return 'bg-rose-400/10 text-rose-400 border-rose-400/20';
    case 'MEDIUM': return 'bg-orange-400/10 text-orange-400 border-orange-400/20';
    case 'LOW': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20';
    default: return 'bg-slate-400/10 text-slate-400 border-slate-400/20';
  }
}

export default function DetectionsPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/history`);
        if (response.ok) {
          const data = await response.json();
          setDetections(data);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary" />
            Detection History
          </h1>
          <p className="text-slate-400 mt-1">Review all suspect content flagged by the AI engine.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full bg-white/5 backdrop-blur-sm border-white/10 text-white hover:bg-white/10 transition-all shadow-sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => {
              if (detections.length === 0) return;
              const headers = ["ID", "Asset Name", "Risk Level", "Similarity", "Timestamp", "Status"];
              const csvContent = [
                headers.join(","),
                ...detections.map(d => [
                  `VT-${d.id}`,
                  d.asset_name,
                  d.risk_level,
                  d.similarity,
                  d.timestamp,
                  d.status
                ].join(","))
              ].join("\n");
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `VaultVision_Detections_${Date.now()}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="rounded-full bg-primary text-white hover:bg-primary/90 shadow-[0_4px_15px_rgb(124,58,237,0.2)] transition-all"
          >
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
                <th className="px-6 py-4 font-semibold">Asset Name</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Similarity</th>
                <th className="px-6 py-4 font-semibold">Detected At</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                       <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                       Loading detection vault...
                    </div>
                  </td>
                </tr>
              ) : detections.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No detections found. Start by analyzing suspect media.
                  </td>
                </tr>
              ) : detections.map((detection, index) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                  key={detection.id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">VT-{detection.id.toString().padStart(3, '0')}</td>
                  <td className="px-6 py-4 font-medium text-primary">{detection.asset_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(detection.risk_level)}`}>
                      {detection.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-400">{detection.similarity}</td>
                  <td className="px-6 py-4">{new Date(detection.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-400">{detection.status}</td>
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
