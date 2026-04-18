"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface DragDropZoneProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onAction: (file: File) => Promise<void>;
  isLoading: boolean;
  highlightColor?: "blue" | "red";
}

export default function DragDropZone({
  title,
  subtitle,
  buttonText,
  onAction,
  isLoading,
  highlightColor = "blue",
}: DragDropZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const primaryColor = highlightColor === "red" ? "text-red-500" : "text-blue-500";
  const borderColor = highlightColor === "red" ? "border-red-500/50" : "border-blue-500/50";
  const bgHover = highlightColor === "red" ? "bg-red-500/10" : "bg-blue-500/10";
  const bgButton = highlightColor === "red" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500";

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center bg-zinc-900/50 backdrop-blur-md rounded-2xl p-6 border border-zinc-800 shadow-xl transition-all w-full h-full">
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-zinc-400 text-sm mb-6 text-center">{subtitle}</p>

      {!file ? (
        <div
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
            dragActive ? borderColor + " " + bgHover : "border-zinc-700 hover:border-zinc-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${dragActive ? primaryColor : "text-zinc-400"}`} />
          <p className="text-zinc-300 font-medium">Drag & drop your asset here</p>
          <p className="text-zinc-500 text-xs mt-1">or click to browse files</p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="w-full h-48 relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 flex items-center justify-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview!}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={clearFile}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <button
        onClick={() => file && onAction(file)}
        disabled={!file || isLoading}
        className={`mt-6 w-full py-3 px-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all ${
          !file || isLoading ? "opacity-50 cursor-not-allowed bg-zinc-800" : bgButton
        }`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
        ) : (
          <ImageIcon className="w-5 h-5" />
        )}
        {isLoading ? "Processing..." : buttonText}
      </button>
    </div>
  );
}
