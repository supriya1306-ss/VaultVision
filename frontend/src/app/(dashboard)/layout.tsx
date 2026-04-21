"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldAlert, UploadCloud, FileText, Settings, Bell, ShieldCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Detections", href: "/dashboard/detections", icon: ShieldAlert },
    { name: "Upload Media", href: "/dashboard/upload", icon: UploadCloud },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden pt-16">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 flex-col bg-white/5 backdrop-blur-md border-r border-white/10 p-4 shadow-sm z-10">
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="h-12 w-12 relative rounded-full bg-white/5 border border-white/10 overflow-hidden shadow-xl">
            <img src="/logo.png" alt="VaultVision Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white italic">
            VaultVision
          </span>
        </div>
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Container */}
      <main className="flex-1 overflow-y-auto relative p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
