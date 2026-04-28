"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, UploadCloud, CheckCircle2, AlertTriangle, ShieldAlert, Download, Brain, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { API_BASE_URL } from "@/lib/api";

interface MatchResult {
  asset_id: string;
  score: number;
}

interface AnalysisResult {
  is_protected: boolean;
  confidence: number;
  matches: MatchResult[];
  message: string;
  ai_analysis?: string;
}

export default function StandaloneDetectorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error("Analysis failed");
      }
    } catch (error) {
      console.error("Error during analysis:", error);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
          <Search className="h-8 w-8 text-primary shadow-glow" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight sm:text-6xl">
          Real-Time AI <span className="text-gradient">Detector</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Step 2: Upload suspect content to detect unauthorized usage. Our Hybrid AI engine compares it against millions of official assets in sub-seconds.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        {!result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-16 text-center border-dashed border-2 border-white/10 hover:border-primary/50 transition-all relative group"
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleFileChange}
              disabled={isAnalyzing}
            />
            <div className="mx-auto h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <UploadCloud className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {file ? file.name : "Upload Suspect Image/Video"}
            </h3>
            <p className="text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
              VaultVision uses **Vertex AI** to identify edited, cropped, or disguised media usage that legacy tools miss.
            </p>
            {file && !isAnalyzing && (
              <Button 
                onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
                className="rounded-full bg-primary text-white hover:bg-primary/90 px-12 py-7 text-xl font-black shadow-[0_0_30px_rgba(0,174,239,0.3)] relative z-20"
              >
                Verify Authenticity
              </Button>
            )}
            {isAnalyzing && (
              <div className="flex flex-col items-center gap-6">
                 <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                 <p className="text-primary font-black uppercase tracking-[0.2em] animate-pulse">Vertex AI is Analyzing Semantic Connections...</p>
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={`p-10 rounded-[2.5rem] border-2 flex flex-col md:flex-row items-center justify-between gap-10 ${
                result.is_protected ? 'bg-rose-500/10 border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]' : 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]'
              }`}>
                <div className="flex items-center gap-8">
                  <div className={`h-24 w-24 rounded-3xl flex items-center justify-center ${
                    result.is_protected ? 'bg-rose-500/20' : 'bg-emerald-500/20'
                  }`}>
                    {result.is_protected ? (
                      <ShieldAlert className="h-12 w-12 text-rose-500" />
                    ) : (
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">
                      {result.is_protected ? "Unauthorized Usage Detected" : "Verified Official Content"}
                    </h2>
                    <p className="text-slate-400 font-medium">Risk Intelligence: {result.is_protected ? "High-Confidence Match" : "Clean Asset Verification"}</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="text-center px-8 py-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-2">Match</p>
                    <p className={`text-4xl font-black ${
                       result.is_protected ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center px-8 py-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-2">Risk</p>
                    <p className={`text-4xl font-black ${
                       result.confidence > 0.95 ? 'text-rose-600' : result.confidence > 0.85 ? 'text-orange-500' : 'text-emerald-500'
                    }`}>
                      {result.confidence > 0.95 ? 'HIGH' : result.confidence > 0.85 ? 'MED' : 'LOW'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 glass-panel p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Brain className="w-40 h-40 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    Evidence Engine Proof (Gemini 1.5 Brain)
                  </h3>
                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {result.ai_analysis || "Generating detailed risk intelligence report..."}
                  </div>
                </div>
                
                <div className="glass-panel p-10 flex flex-col justify-between border-t-4 border-t-primary">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-8">Winning Features</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Hybrid AI Detection</p>
                          <p className="text-xs text-slate-500 leading-relaxed">Detects edited & disguised media using semantic similarity.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mt-1 flex-shrink-0">
                          <Brain className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Evidence Engine</p>
                          <p className="text-xs text-slate-500 leading-relaxed">Killer feature: Auto-generated proof with timestamps & similarity.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={async () => {
                      const { generateVaultVisionPDF } = await import("@/lib/pdf-service");
                      await generateVaultVisionPDF(
                        file?.name || "Unknown_Asset",
                        result.ai_analysis || "No analysis available.",
                        result.confidence,
                        result.confidence > 0.95 ? 'HIGH' : result.confidence > 0.85 ? 'MEDIUM' : 'LOW'
                      );
                    }}
                    className="w-full rounded-full bg-white text-black hover:bg-slate-200 mt-10 py-6 font-bold shadow-2xl"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Report
                  </Button>


                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => { setFile(null); setResult(null); }}
                  className="text-slate-400 hover:text-white group"
                >
                  <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Analyze another file
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
