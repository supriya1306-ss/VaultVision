"use client";

import { motion } from "framer-motion";
import { UploadCloud, File, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UploadMediaPage() {
  const [files, setFiles] = useState<{ name: string, size: string, status: string }[]>([]);

  const handleUpload = () => {
    // Simulate file upload
    setFiles([{ name: "ARS_vs_CHE_Highlights.mp4", size: "1.2 GB", status: "Uploading" }]);
    setTimeout(() => {
      setFiles([{ name: "ARS_vs_CHE_Highlights.mp4", size: "1.2 GB", status: "Processing" }]);
    }, 2000);
    setTimeout(() => {
      setFiles([{ name: "ARS_vs_CHE_Highlights.mp4", size: "1.2 GB", status: "Completed" }]);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Upload Media</h1>
        <p className="text-slate-400 mt-1">Ingest your content for AI-powered piracy detection.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 text-center border-dashed border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer"
        onClick={handleUpload}
      >
        <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <UploadCloud className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Drag and drop your media files here</h3>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Support for MP4, MKV, MOV, and AVI up to 10GB per file. Your content will be processed instantly.
        </p>
        <Button className="rounded-full bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg">
          Select Files
        </Button>
      </motion.div>

      {files.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card p-6 divide-y divide-white/5"
        >
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center">
                  <File className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-slate-500">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    file.status === 'Completed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-primary/10 text-primary'
                  }`}>
                    {file.status}
                  </span>
                  {file.status !== 'Completed' && (
                    <div className="w-32 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: file.status === 'Processing' ? '70%' : '30%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  )}
                </div>
                {file.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <X className="h-5 w-5 text-slate-500 cursor-pointer" />}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
