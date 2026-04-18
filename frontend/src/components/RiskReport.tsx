"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface MatchResult {
  asset_id: string;
  similarity: number;
}

export interface AnalysisResponse {
  is_protected: boolean;
  confidence: number;
  matches: MatchResult[];
  report_md?: string;
  error?: string;
}

interface RiskReportProps {
  data: AnalysisResponse | null;
}

export default function RiskReport({ data }: RiskReportProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
        <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
        <p>Awaiting analysis scan...</p>
        <p className="text-xs opacity-50 mt-2 text-center max-w-xs">Upload an image into the Risk Radar to search for copyright infringement.</p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-900 rounded-xl">
        <h3 className="text-red-500 font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Error During Scan
        </h3>
        <p className="text-red-400 mt-2">{data.error}</p>
      </div>
    );
  }

  if (!data.is_protected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-950/10 border border-green-900/30 rounded-2xl h-full min-h-[400px]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-500/10">
          <ShieldCheck className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-400">Safe & Cleared</h2>
        <p className="text-zinc-400 mt-2 text-center max-w-sm">
          No matches found in the Vault. This image appears to be clear of copyright infringement.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-red-950/10 border border-red-900/30 rounded-2xl h-full overflow-y-auto">
      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-red-900/30">
        <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ring-4 ring-red-500/10 animate-pulse">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-red-500 drop-shadow-sm">Infringement Warning</h2>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-red-500/10 text-red-400 text-sm font-bold rounded-md ring-1 ring-red-500/30 flex items-center gap-1">
              Confidence: {Math.round(data.confidence * 100)}%
            </span>
            {data.matches.map((m, i) => (
              <span key={i} className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-sm font-medium rounded-md ring-1 ring-yellow-500/30">
                Matched Target: {m.asset_id}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-red max-w-none text-zinc-300">
        {data.report_md ? (
          <ReactMarkdown>{data.report_md}</ReactMarkdown>
        ) : (
          <p>The AI Engine flagged an infringement but did not return a detailed report.</p>
        )}
      </div>
    </div>
  );
}
