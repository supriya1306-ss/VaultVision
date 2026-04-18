"use client";
import React, { useState } from "react";
import DragDropZone from "@/components/DragDropZone";
import RiskReport, { AnalysisResponse } from "@/components/RiskReport";
import { uploadOfficialAsset, detectSuspiciousAsset } from "@/lib/api";
import { Shield, LayoutDashboard, Activity } from "lucide-react";

export default function Dashboard() {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [detectLoading, setDetectLoading] = useState(false);
  const [reportData, setReportData] = useState<AnalysisResponse | null>(null);

  const handleRegister = async (file: File) => {
    setRegisterLoading(true);
    try {
      const result = await uploadOfficialAsset(file);
      alert(result.message || "Asset successfully registered to the Vault.");
    } catch (error: any) {
      alert(`Registration error: ${error.message}`);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDetect = async (file: File) => {
    setDetectLoading(true);
    setReportData(null);
    try {
      const result = await detectSuspiciousAsset(file);
      setReportData(result);
    } catch (error: any) {
      setReportData({
        is_protected: false,
        confidence: 0,
        matches: [],
        error: error.message,
      });
    } finally {
      setDetectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-blue-500/30">
      {/* Top Navigation */}
      <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              VaultVision
            </span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="flex items-center gap-2 text-white border-b-2 border-blue-500 px-1 py-5">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors px-1 py-5">
              <Activity className="w-4 h-4" /> Activity Log
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-4">
            Enterprise Risk Analysis
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Register your official digital assets securely into the Vault, and use the AI Risk Scanner to detect copyright infringements dynamically.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Drag & Drop Zones */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Vault Registration Panel */}
            <div className="h-[400px]">
              <DragDropZone
                title="1. The Vault"
                subtitle="Upload official media to register it safely in the vector database."
                buttonText="Protect Asset"
                highlightColor="blue"
                isLoading={registerLoading}
                onAction={handleRegister}
              />
            </div>

            {/* Risk Scanner Panel */}
            <div className="h-[400px]">
              <DragDropZone
                title="2. Risk Scanner"
                subtitle="Upload a suspicious image from the web to check for unauthorized use."
                buttonText="Scan for Infringement"
                highlightColor="red"
                isLoading={detectLoading}
                onAction={handleDetect}
              />
            </div>
          </div>

          {/* Right Column: AI Report Panel */}
          <div className="lg:col-span-7 h-[824px]">
            <RiskReport data={reportData} />
          </div>

        </div>
      </main>
    </div>
  );
}
