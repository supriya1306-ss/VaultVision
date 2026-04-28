"use client";

import { motion } from "framer-motion";
import { Search, UploadCloud, File, CheckCircle2, AlertTriangle, ShieldAlert, Download } from "lucide-react";
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

export default function AnalyzeMediaPage() {
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
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Search className="h-8 w-8 text-primary" />
          Real-Time AI Detection
        </h1>
        <p className="text-slate-400 mt-1">
          VaultVision not only detects copied content but also provides actionable evidence and risk analysis in real time.
        </p>
      </div>

      {!result && (
        <div className="glass-card p-12 text-center border-dashed border-2 border-white/10 hover:border-primary/50 transition-all relative">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleFileChange}
            disabled={isAnalyzing}
          />
          <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {file ? file.name : "Upload Suspect Image/Video"}
          </h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            Extracting semantic features (CLIP) via Vertex AI to identify edited, cropped, or disguised media usage at scale.
          </p>
          {file && !isAnalyzing && (
            <Button 
              onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
              className="rounded-full bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg relative z-20"
            >
              Verify Authenticity
            </Button>
          )}
          {isAnalyzing && (
            <div className="flex flex-col items-center gap-4">
               <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
               />
               <p className="text-primary font-bold animate-pulse">Vertex AI is Analyzing Semantic Connections...</p>
            </div>
          )}
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className={`p-8 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-8 ${
            result.is_protected ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
          }`}>
            <div className="flex items-center gap-6">
              <div className={`h-20 w-20 rounded-2xl flex items-center justify-center ${
                result.is_protected ? 'bg-rose-500/20' : 'bg-emerald-500/20'
              }`}>
                {result.is_protected ? (
                  <ShieldAlert className="h-10 w-10 text-rose-500" />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {result.is_protected ? "Unauthorized Usage Detected" : "Verified Official Content"}
                </h2>
                <p className="text-slate-400">Risk Intelligence System: {result.is_protected ? "High-Confidence Match" : "Clean Asset Verification"}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Semantic Match</p>
                <p className={`text-3xl font-black ${
                   result.is_protected ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Risk Level</p>
                <p className={`text-3xl font-black ${
                   result.confidence > 0.95 ? 'text-rose-600' : result.confidence > 0.85 ? 'text-orange-500' : 'text-emerald-500'
                }`}>
                  {result.confidence > 0.95 ? 'HIGH RISK' : result.confidence > 0.85 ? 'MEDIUM' : 'LOW'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Evidence Engine Proof (Gemini 1.5 Brain)
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
                {result.ai_analysis || "Generating detailed risk intelligence report..."}
              </div>
            </div>
            
            <div className="glass-card p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Winning Features</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Hybrid AI Detection</p>
                      <p className="text-xs text-slate-500">Detects edited & disguised media using semantic similarity.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Evidence Engine</p>
                      <p className="text-xs text-slate-500">Killer feature: Auto-generated proof with timestamps & similarity.</p>
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
                className="w-full rounded-full bg-white text-black hover:bg-slate-200 mt-8"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>

            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => { setFile(null); setResult(null); }}
            className="text-slate-400 hover:text-white"
          >
            ← Analyze another file
          </Button>

        </motion.div>
      )}
    </div>
  );
}
