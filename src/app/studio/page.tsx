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
  ShieldCheck,
  Clock,
  Gauge,
  Sliders,
  Terminal,
  Cpu,
} from "lucide-react";

const SAMPLE_PRESETS = [
  {
    id: "pack5",
    title: "Family of 5 (Beach Waves)",
    setting: "Ocean Beach Waves",
    headcount: 5,
    previewUrl: "/samples/pack-family-5/images.jpg",
    badge: "5 Members • Pack 1",
    resolution: "368×544",
  },
  {
    id: "pack3",
    title: "Family of 3 (Golden Coast)",
    setting: "Sunny Beachfront Coast",
    headcount: 3,
    previewUrl: "/samples/pack-family-3/istockphoto-2157349912-612x612.jpg",
    badge: "3 Members • Pack 2",
    resolution: "608×416",
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePhoto = uploadedImage || selectedSamplePhoto;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedImage(reader.result);
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
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setUploadedImage(null);
    setSelectedSamplePhoto(preset.previewUrl);
    setVacationSetting(preset.setting);
    setHeadcount(preset.headcount);
  };

  const handleStartRun = () => {
    startGeneration({
      imageUrl: activePhoto,
      setting: vacationSetting,
      headcount,
      speedMultiplier,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-studio-accent flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Coloring Book Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Family Keepsake Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gemma 4 VLM analyzes character geometry $\rightarrow$ Modal T4 streams 4 printable coloring pages.
          </p>
        </div>

        {/* Speed Multiplier & Fast Demo Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel">
            <button
              onClick={() => setSpeedMultiplier(4)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                speedMultiplier === 4
                  ? "bg-gradient-to-r from-studio-accent to-orange-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Fast Demo (4x • ~10s)</span>
            </button>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

      {/* Main Studio Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Photo Upload & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-studio-accent" />
                Input Vacation Photo
              </h2>
              {uploadedImage && (
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-[11px] font-semibold text-rose-400 hover:underline cursor-pointer"
                >
                  Clear Custom Upload
                </button>
              )}
            </div>

            {/* Photo Preview / Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex flex-col items-center justify-center group ${
                isDragOver
                  ? "border-studio-accent bg-studio-accent/10 scale-[1.01]"
                  : "border-dashed border-white/20 hover:border-studio-accent/70 bg-slate-950/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {activePhoto ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activePhoto}
                    alt="Active Input Vacation Snapshot"
                    className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-2 backdrop-blur-xs">
                    <Upload className="w-5 h-5 text-studio-accent" />
                    <span>Click or Drag to Swap Photo</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2 text-slate-400">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-white">Drag &amp; drop a family photo</p>
                  <p className="text-[11px] text-slate-500">PNG, JPG, or SVG up to 10MB</p>
                </div>
              )}
            </div>

            {/* 1-Click Sample Presets with Real Photos */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 block">
                Or Select a Real Photo Preset:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {SAMPLE_PRESETS.map((preset) => {
                  const isSelected = activePhoto === preset.previewUrl;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-studio-accent bg-studio-accent/15 ring-1 ring-studio-accent shadow-glow"
                          : "border-white/10 glass-panel hover:bg-white/5 text-slate-300"
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-2 border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.previewUrl}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-bold text-white truncate">{preset.title}</p>
                      <span className="text-[10px] text-studio-accent font-mono block mt-0.5">
                        {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Setting & Headcount Customization */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
              <div>
                <label className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Vacation Setting
                </label>
                <input
                  type="text"
                  value={vacationSetting}
                  onChange={(e) => setVacationSetting(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/15 text-xs text-white font-medium focus:border-studio-accent focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  Headcount
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={headcount}
                  onChange={(e) => setHeadcount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/15 text-xs text-white font-medium focus:border-studio-accent focus:outline-hidden"
                />
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="pt-2">
              {isStreaming ? (
                <button
                  onClick={cancelGeneration}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Cancel Generation Stream
                </button>
              ) : (
                <button
                  onClick={handleStartRun}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-studio-accent via-orange-600 to-amber-600 hover:opacity-95 text-white font-extrabold text-sm shadow-glow hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Play className="w-4 h-4 fill-white text-white group-hover:scale-115 transition-transform" />
                  <span>Generate 4-Page Coloring Book</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Gemma 4 VLM Character Bible Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-studio-accent animate-pulse" />
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-studio-accent" />
                  Gemma 4 VLM Analysis Terminal
                </h3>
              </div>

              {vlmAnalysis && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-bold">
                  Confidence: {((vlmAnalysis.confidence_score || 0.985) * 100).toFixed(1)}%
                </span>
              )}
            </div>

            {/* Streaming Progress Bar */}
            {isStreaming && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-studio-accent animate-ping" />
                    {streamStage === "vlm_analyzing"
                      ? "Gemma 4 extracting character tokens..."
                      : `Streaming Coloring Pages (${currentPages.length}/4)...`}
                  </span>
                  <span className="font-bold text-studio-accent">{streamProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-studio-accent via-amber-400 to-emerald-400 transition-all duration-300 shadow-glow"
                    style={{ width: `${streamProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* VLM Content Card */}
            {vlmAnalysis ? (
              <div className="space-y-4 animate-in fade-in">
                {/* VLM Metric Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] font-mono">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Model</span>
                    <strong className="text-white truncate block">{vlmAnalysis.active_vlm_model}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Headcount</span>
                    <strong className="text-white">{vlmAnalysis.exact_headcount} Persons</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">VLM TTFT</span>
                    <strong className="text-white">
                      {(vlmAnalysis.vlm_ttft_ms / 1000).toFixed(2)}s
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Throughput</span>
                    <strong className="text-emerald-400">{vlmAnalysis.tokens_per_sec} tok/s</strong>
                  </div>
                </div>

                {/* Left-to-Right Character Bible Terminal View */}
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 font-mono text-xs leading-relaxed space-y-2 shadow-inner">
                  <div className="text-[11px] text-studio-accent font-bold tracking-wider uppercase flex items-center justify-between pb-1 border-b border-white/10">
                    <span>Character Bible (Left-to-Right Ordering):</span>
                    <span className="text-slate-400 font-normal">
                      Tokens: {vlmAnalysis.prompt_tokens} in / {vlmAnalysis.output_tokens} out
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-slate-200">{vlmAnalysis.character_bible}</p>
                </div>
              </div>
            ) : isStreaming ? (
              <div className="p-10 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-dashed border-white/15">
                <div className="w-10 h-10 rounded-full border-2 border-studio-accent border-t-transparent animate-spin mx-auto" />
                <p className="text-sm font-bold text-white">
                  Gemma 4 Vision-Language Model analyzing character geometry...
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Calculating TTFT &amp; building left-to-right character tokens
                </p>
              </div>
            ) : (
              <div className="p-10 text-center space-y-2 bg-slate-950/40 rounded-2xl border border-dashed border-white/10 text-slate-400">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto stroke-[1.5]" />
                <p className="text-xs font-bold text-white">Awaiting Generation Trigger</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Click &quot;Generate 4-Page Coloring Book&quot; to begin streaming the Gemma 4 Character Bible and
                  4 sequential coloring illustrations.
                </p>
              </div>
            )}

            {/* Stream Error Alert if any */}
            {streamError && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{streamError}</span>
              </div>
            )}

            {/* Generation Completed Banner */}
            {streamStage === "completed" && activeRunTelemetry && (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-200 animate-in fade-in shadow-glow-emerald">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm">4-Page Pack Generation Complete!</span>
                    <span className="text-[11px] text-emerald-400 block font-mono mt-0.5">
                      E2E Duration: {activeRunTelemetry.total_e2e_sec}s • Total Cost: $
                      {activeRunTelemetry.total_pack_cost_usd.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetStudio}
                    className="px-3.5 py-2 rounded-xl glass-panel hover:bg-white/10 text-white font-bold transition-all text-xs cursor-pointer"
                  >
                    Reset Studio
                  </button>
                  <Link
                    href="/telemetry"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs flex items-center gap-1.5 shadow-glow-emerald"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Inspect FinOps
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progressive 4-Slot Gallery */}
      <section className="space-y-4 pt-4">
        <ProgressiveGrid
          pages={currentPages}
          activeVariantIndex={activeVariantIndex}
          isStreaming={isStreaming}
        />
      </section>
    </div>
  );
}
