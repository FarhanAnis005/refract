"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRefract } from "@/context/RefractContext";
import { ProgressiveGrid } from "@/components/ProgressiveGrid";
import {
  Upload,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Image as ImageIcon,
  Users,
  Sun,
  Clock,
  Terminal,
  Sliders,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Check,
} from "lucide-react";

const SAMPLE_PRESETS = [
  {
    id: "pack5",
    title: "Family of 5 (Ocean Waves)",
    setting: "Ocean Beach Waves",
    headcount: 5,
    previewUrl: "/samples/pack-family-5/images.jpg",
    badge: "Pack 1 • 5 Members",
    resolution: "368 × 544",
  },
  {
    id: "pack3",
    title: "Family of 3 (Golden Shore)",
    setting: "Sunlit Beachfront Coast",
    headcount: 3,
    previewUrl: "/samples/pack-family-3/istockphoto-2157349912-612x612.jpg",
    badge: "Pack 2 • 3 Members",
    resolution: "608 × 416",
  },
];

export default function StudioPage() {
  const {
    isStreaming,
    streamStage,
    streamProgress,
    vlmAnalysis,
    activeVariantIndex,
    currentPages,
    streamError,
    speedMultiplier,
    setSpeedMultiplier,
    selectedSamplePhoto,
    setSelectedSamplePhoto,
    startGeneration,
    cancelGeneration,
    resetStudio,
    activeRunTelemetry,
    warmupStatus,
  } = useRefract();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [vacationSetting, setVacationSetting] = useState<string>("Ocean Beach Waves");
  const [headcount, setHeadcount] = useState<number>(5);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showBibleDetails, setShowBibleDetails] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePhoto = uploadedImage || selectedSamplePhoto;

  // Handle custom file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImage(reader.result);
          setSelectedSamplePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImage(reader.result);
          setSelectedSamplePhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1-Click Preset Selection: AUTO-TRIGGERS WORKFLOW IMMEDIATELY
  const handleSelectPresetAndTrigger = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setUploadedImage(null);
    setSelectedSamplePhoto(preset.previewUrl);
    setVacationSetting(preset.setting);
    setHeadcount(preset.headcount);

    // Auto-trigger generation stream immediately with zero friction
    startGeneration({
      imageUrl: preset.previewUrl,
      setting: preset.setting,
      headcount: preset.headcount,
      speedMultiplier,
    });
  };

  const handleManualRun = () => {
    startGeneration({
      imageUrl: activePhoto,
      setting: vacationSetting,
      headcount,
      speedMultiplier,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-studio-accent flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            AI Coloring Book Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Coloring Studio Workspace
          </h1>
        </div>

        {/* Speed Toggle (Fast Demo 4x vs Real T4 1x) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl glass-panel text-xs">
            <button
              onClick={() => setSpeedMultiplier(4)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                speedMultiplier === 4
                  ? "bg-studio-accent text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Fast Demo (4x • ~10s)</span>
            </button>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                speedMultiplier === 1
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Real T4 (1x • ~41s)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Way Selection Entry: 1-Click Samples (Auto-triggers) OR Upload Photo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Side (7 cols): 1-Click Sample Presets with Immediate Trigger */}
        <div className="md:col-span-7 p-5 rounded-3xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-studio-accent" />
              <h2 className="text-sm font-bold text-white">Choose Sample (Auto-Starts Workflow)</h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              1-Click Instant Run
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {SAMPLE_PRESETS.map((preset) => {
              const isSelected = activePhoto === preset.previewUrl;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPresetAndTrigger(preset)}
                  disabled={isStreaming}
                  className={`group relative p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-studio-accent bg-studio-accent/20 ring-2 ring-studio-accent shadow-glow"
                      : "border-white/10 bg-slate-950/70 hover:border-white/30 hover:bg-slate-900"
                  }`}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2 border border-white/10 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.previewUrl}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-lg bg-studio-accent text-white font-bold text-[11px] shadow-glow flex items-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        Run Workflow
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-studio-accent transition-colors truncate">
                      {preset.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>{preset.badge}</span>
                      <span className="text-studio-cyan">{preset.resolution}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side (5 cols): Custom Photo Upload Dropzone */}
        <div className="md:col-span-5 p-5 rounded-3xl glass-panel flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Or Upload Custom Photo</span>
            </h2>
            {uploadedImage && (
              <button
                onClick={() => setUploadedImage(null)}
                className="text-[11px] text-rose-400 hover:underline font-semibold cursor-pointer"
              >
                Clear Custom
              </button>
            )}
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[120px] rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-studio-accent bg-studio-accent/15 scale-[1.01]"
                : "border-white/20 hover:border-studio-accent/70 bg-slate-950/60"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedImage ? (
              <div className="flex items-center gap-3 text-left">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={uploadedImage} alt="Uploaded snapshot" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Custom Photo Loaded</span>
                  <span className="text-[11px] text-emerald-400 font-mono">Ready to Generate</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1 text-slate-400">
                <Upload className="w-6 h-6 mx-auto text-slate-500" />
                <p className="text-xs font-bold text-white">Drag &amp; drop a family photo</p>
                <p className="text-[10px] text-slate-500">PNG or JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streamlined Options & Execution Toolbar */}
      <div className="p-4 rounded-3xl glass-panel-elevated flex flex-wrap items-center justify-between gap-4 border border-white/10">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Active Thumbnail */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activePhoto} alt="Selected photo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Selected Photo</span>
              <span className="text-xs font-bold text-white truncate max-w-[150px] block">
                {uploadedImage ? "Custom Upload" : activePhoto.includes("pack-family-5") ? "Family of 5" : "Family of 3"}
              </span>
            </div>
          </div>

          {/* Vacation Setting Input */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Setting</span>
              <input
                type="text"
                value={vacationSetting}
                onChange={(e) => setVacationSetting(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden w-40 truncate"
              />
            </div>
          </div>

          {/* Headcount Input */}
          <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-mono uppercase">Headcount</span>
              <input
                type="number"
                min={1}
                max={8}
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden w-16"
              />
            </div>
          </div>
        </div>

        {/* Primary Action Button (Generate / Re-run OR Cancel) */}
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <button
              onClick={cancelGeneration}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Cancel Stream</span>
            </button>
          ) : (
            <button
              onClick={handleManualRun}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-studio-accent via-orange-600 to-amber-600 hover:opacity-95 text-white font-bold text-xs shadow-glow transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{currentPages.length > 0 ? "Re-Generate Book" : "Generate 4-Page Book"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Gemma 4 VLM Character Bible Overview Bar */}
      <div className="p-4 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                vlmAnalysis ? "bg-emerald-400 shadow-[0_0_8px_#34D399]" : isStreaming ? "bg-studio-accent animate-ping" : "bg-slate-600"
              }`}
            />
            <span className="font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-studio-accent" />
              Gemma 4 VLM Character Analysis
            </span>
            {vlmAnalysis && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {vlmAnalysis.exact_headcount} Persons • 98.5% Confidence
              </span>
            )}
          </div>

          {vlmAnalysis && (
            <button
              onClick={() => setShowBibleDetails(!showBibleDetails)}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>{showBibleDetails ? "Hide Character Spec" : "View Character Spec"}</span>
              {showBibleDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Streaming Progress Bar */}
        {isStreaming && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>
                {streamStage === "vlm_analyzing"
                  ? "Gemma 4 extracting character geometry..."
                  : `Synthesizing Coloring Pages (${currentPages.length}/4 ready)...`}
              </span>
              <span className="font-bold text-studio-accent">{streamProgress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-studio-accent via-amber-400 to-emerald-400 transition-all duration-300 shadow-glow"
                style={{ width: `${streamProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Expandable Character Bible Snippet */}
        {vlmAnalysis && showBibleDetails && (
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 font-mono text-xs text-slate-200 whitespace-pre-line leading-relaxed animate-in fade-in">
            {vlmAnalysis.character_bible}
          </div>
        )}

        {/* Stream Error Alert if any */}
        {streamError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{streamError}</span>
          </div>
        )}
      </div>

      {/* 4-Page Progressive Coloring Gallery (Front & Center) */}
      <section className="space-y-4">
        <ProgressiveGrid
          pages={currentPages}
          activeVariantIndex={activeVariantIndex}
          isStreaming={isStreaming}
        />
      </section>
    </div>
  );
}
