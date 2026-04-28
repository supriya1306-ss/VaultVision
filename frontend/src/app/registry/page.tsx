"use client";

import { motion } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";

export default function StandaloneRegistryPage() {
  const [files, setFiles] = useState<{ name: string, size: string, status: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    const newFiles = Array.from(selectedFiles).map(file => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      status: "Uploading"
    }));
    setFiles(prev => [...prev, ...newFiles]);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: "Completed" } : f));
        } else {
          setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: "Failed" } : f));
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: "Error" } : f));
      }
    }
    setIsUploading(false);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <ShieldCheck className="h-8 w-8 text-primary shadow-glow" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight sm:text-6xl">
          The AI <span className="text-gradient">Vault</span> Registry
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Step 1: Securely ingest your official sports media. We extract semantic feature vectors using CLIP to enable real-time global tracking.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-panel p-12 text-center border-white/10 hover:border-primary/50 transition-all bg-[#0a051d]/60 backdrop-blur-3xl overflow-hidden">
              <input 
                type="file" 
                multiple 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <div className="mx-auto h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <UploadCloud className="h-12 w-12 text-primary relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ingest Official Media</h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto">
                Drag and drop your official images or videos to generate unique AI fingerprints in the secure vault.
              </p>
              <Button className="rounded-full bg-primary text-white hover:bg-primary/90 px-12 py-7 text-xl font-black shadow-[0_0_30px_rgba(0,174,239,0.3)] transition-all">
                {isUploading ? "Extracting Features..." : "Start Registration"}
              </Button>
              
              {/* Background Glow */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            </div>
          </div>

          {files.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-panel p-8 space-y-4"
            >
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Registration Queue</h4>
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <File className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        file.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {file.status}
                      </span>
                    </div>
                    {file.status === 'Completed' ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="space-y-8">
           <div className="glass-panel p-8 border-l-4 border-l-primary">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-white">Winning Feature</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlike traditional hashing, our CLIP-powered registration detects content even if it's cropped, filtered, or re-recorded.
              </p>
           </div>
           
           <div className="glass-panel p-8 bg-gradient-to-br from-white/5 to-transparent">
              <h3 className="font-bold text-white mb-6">Pipeline Progress</h3>
              <div className="space-y-6">
                {[
                  { step: "Registry", status: "Active", progress: 100 },
                  { step: "Detector", status: "Pending", progress: 0 },
                  { step: "Evidence Engine", status: "Pending", progress: 0 },
                ].map((s) => (
                  <div key={s.step} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-white">{s.step}</span>
                      <span className="text-slate-500">{s.status}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
