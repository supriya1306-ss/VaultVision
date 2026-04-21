"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertCircle, FileAudio, Eye, TrendingUp } from "lucide-react";

const analysisData = [
  { name: 'Mon', detections: 400, protected: 2400 },
  { name: 'Tue', detections: 300, protected: 1398 },
  { name: 'Wed', detections: 200, protected: 9800 },
  { name: 'Thu', detections: 278, protected: 3908 },
  { name: 'Fri', detections: 189, protected: 4800 },
  { name: 'Sat', detections: 239, protected: 3800 },
  { name: 'Sun', detections: 349, protected: 4300 },
];

const riskData = [
  { name: 'Low', count: 400 },
  { name: 'Medium', count: 300 },
  { name: 'High', count: 200 },
  { name: 'Critical', count: 50 },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
        <div className="text-sm px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-slate-400 border border-white/10">
          Last 7 Days
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Sources Analyzed", value: "1.2M", icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10" },
          { label: "Deepfake Detections", value: "3,421", icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
          { label: "Verified Media Assets", value: "124K", icon: FileAudio, color: "text-indigo-400", bg: "bg-indigo-400/10" },
          { label: "Avg. Analytics Speed", value: "140ms", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 glass-card p-6 min-h-[400px]"
        >
          <h3 className="text-lg font-bold text-white mb-6">Threat Analysis Traffic</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analysisData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00AEEF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00AEEF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="detections" stroke="#00AEEF" fillOpacity={1} fill="url(#colorDetections)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 glass-card p-6 min-h-[400px]"
        >
          <h3 className="text-lg font-bold text-white mb-6">Risk Classification</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                />
                <Bar dataKey="count" fill="#00AEEF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
