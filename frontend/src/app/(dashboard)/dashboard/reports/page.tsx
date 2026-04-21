"use client";

import { motion } from "framer-motion";
import { FileText, Download, Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockReports = [
  { id: "REP-2024-001", name: "Monthly Infringement Summary - March", date: "Apr 01, 2024", size: "2.4 MB" },
  { id: "REP-2024-002", name: "Live Stream IP Enforcement Action", date: "Mar 28, 2024", size: "1.1 MB" },
  { id: "REP-2024-003", name: "Strategic Asset Protection Analysis", date: "Mar 15, 2024", size: "5.8 MB" },
  { id: "REP-2024-004", name: "Weekly Revenue Loss Observation", date: "Mar 08, 2024", size: "840 KB" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Reports</h1>
          <p className="text-slate-400 mt-1">Detailed evidence and summary reports for legal enforcement.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full bg-white/5 border-white/10 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="rounded-full bg-primary text-white">
            Generate New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-start justify-between group"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-primary transition-colors">{report.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {report.date}</span>
                  <span>{report.size}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full">
              <Download className="w-5 h-5" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
