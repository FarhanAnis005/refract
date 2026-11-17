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
} from "lucide-react";

const SAMPLE_PRESETS = [
  {
    id: "beach",
    title: "Beach Family (5)",
    setting: "Sunny Maui Tropical Beach",
    headcount: 5,
    previewUrl: "/samples/beach-family.svg",
    badge: "5 Family Members",
  },
  {
    id: "mountain",
    title: "Mountain Alpine Hike (4)",
    setting: "Rocky Mountain Alpine Trail",
    headcount: 4,
    previewUrl: "/samples/mountain-hike.svg",
    badge: "4 Hikers",
  },
  {
    id: "lake",
    title: "Lakeside Campfire",
    setting: "Lake Tahoe Twilight Campfire",
    headcount: 4,
    previewUrl: "/samples/lake-camping.svg",
    badge: "Campfire & Canoe",
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
  const [vacationSetting, setVacationSetting] = useState<string>("Sunny Maui Tropical Beach");
  const [headcount, setHeadcount] = useState<number>(5);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activePhoto = uploadedImage || selectedSamplePhoto;

  // Handle local file upload
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-paper-300 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-studio-accent flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Coloring Book Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-paper-900 tracking-tight">
            Family Keepsake Generator
          </h1>
          <p className="text-xs sm:text-sm text-paper-800/80 mt-1">
            Feed in a family photo $\rightarrow$ Gemma 4 drafts a Character Bible $\rightarrow$ Modal T4 streams 4 printable coloring pages.
          </p>
        </div>

        {/* Speed Multiplier & Fast Demo Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-paper-100 border border-paper-300 shadow-2xs">
            <button
              onClick={() => setSpeedMultiplier(4)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                speedMultiplier === 4
                  ? "bg-studio-accent text-white shadow-xs"
                  : "text-paper-800 hover:text-paper-900 hover:bg-paper-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Fast Demo (4x • ~10s)</span>
            </button>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                speedMultiplier === 1
                  ? "bg-paper-900 text-white shadow-xs"
                  : "text-paper-800 hover:text-paper-900 hover:bg-paper-200"
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
        {/* Left Column: Photo Upload & Presets (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-paper-300 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-paper-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-studio-accent" />
                Input Vacation Photo
              </h2>
              {uploadedImage && (
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-[11px] font-semibold text-rose-600 hover:underline"
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
              className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex flex-col items-center justify-center group ${
                isDragOver
                  ? "border-studio-accent bg-orange-50/50 scale-[1.01]"
                  : "border-dashed border-paper-300 hover:border-paper-800/60 bg-paper-50"
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
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-paper-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1">
                    <Upload className="w-5 h-5 text-studio-accent" />
                    <span>Click or Drag to Swap Photo</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-2 text-paper-800">
                  <Upload className="w-8 h-8 text-paper-800/50 mx-auto" />
                  <p className="text-xs font-bold text-paper-900">Drag &amp; drop a family photo</p>
                  <p className="text-[11px] text-paper-800/70">PNG, JPG, or SVG up to 10MB</p>
                </div>
              )}
            </div>

            {/* 1-Click Sample Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-paper-900 block">
                Or Select a 1-Click Sample Photo:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_PRESETS.map((preset) => {
                  const isSelected = activePhoto === preset.previewUrl;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-studio-accent bg-orange-50/70 ring-1 ring-studio-accent shadow-xs"
                          : "border-paper-200 bg-paper-100/60 hover:bg-paper-100 text-paper-800"
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-md overflow-hidden bg-paper-200 mb-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.previewUrl}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[11px] font-bold text-paper-900 truncate">{preset.title}</p>
                      <span className="text-[10px] text-paper-800/70 block truncate">
                        {preset.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Setting & Headcount Customization */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-paper-200 text-xs">
              <div>
                <label className="font-semibold text-paper-800 mb-1 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Vacation Setting
                </label>
                <input
                  type="text"
                  value={vacationSetting}
                  onChange={(e) => setVacationSetting(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-paper-50 border border-paper-300 text-xs text-paper-900 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-paper-800 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  Headcount
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={headcount}
                  onChange={(e) => setHeadcount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-paper-50 border border-paper-300 text-xs text-paper-900 font-medium"
                />
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="pt-2">
              {isStreaming ? (
                <button
                  onClick={cancelGeneration}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Cancel Generation Stream
                </button>
              ) : (
                <button
                  onClick={handleStartRun}
                  className="w-full py-3.5 rounded-xl bg-studio-dark hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <Play className="w-4 h-4 fill-studio-accent text-studio-accent group-hover:scale-110 transition-transform" />
                  <span>Generate 4-Page Coloring Book</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Gemma 4 VLM Character Bible Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live VLM Character Bible Card */}
          <div className="p-5 rounded-2xl bg-white border border-paper-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-paper-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-studio-accent animate-pulse" />
                <h3 className="text-sm font-bold text-paper-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-studio-accent" />
                  Gemma 4 VLM Analysis &amp; Character Bible Stream
                </h3>
              </div>

              {vlmAnalysis && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  Confidence: {((vlmAnalysis.confidence_score || 0.985) * 100).toFixed(1)}%
                </span>
              )}
            </div>

            {/* Streaming Progress Bar */}
            {isStreaming && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-paper-800 font-semibold">
                    {streamStage === "vlm_analyzing"
                      ? "Gemma 4 analyzing family photo..."
                      : `Streaming Coloring Pages (${currentPages.length}/4)...`}
                  </span>
                  <span className="font-bold text-studio-accent">{streamProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-paper-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-studio-accent to-amber-500 transition-all duration-300"
                    style={{ width: `${streamProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* VLM Content or Placeholder */}
            {vlmAnalysis ? (
              <div className="space-y-3 animate-in fade-in">
                {/* VLM Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-paper-100 border border-paper-200">
                    <span className="text-paper-800/60 block text-[10px]">Model</span>
                    <strong className="text-paper-900">{vlmAnalysis.active_vlm_model}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-paper-100 border border-paper-200">
                    <span className="text-paper-800/60 block text-[10px]">Headcount</span>
                    <strong className="text-paper-900">{vlmAnalysis.exact_headcount} Persons</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-paper-100 border border-paper-200">
                    <span className="text-paper-800/60 block text-[10px]">VLM TTFT</span>
                    <strong className="text-paper-900">
                      {(vlmAnalysis.vlm_ttft_ms / 1000).toFixed(2)}s
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-paper-100 border border-paper-200">
                    <span className="text-paper-800/60 block text-[10px]">Tokens / Sec</span>
                    <strong className="text-emerald-700">{vlmAnalysis.tokens_per_sec} tok/s</strong>
                  </div>
                </div>

                {/* Left-to-Right Character Bible Output */}
                <div className="p-3.5 rounded-xl bg-paper-900 text-paper-100 font-mono text-xs leading-relaxed space-y-1.5 shadow-inner">
                  <div className="text-[11px] text-studio-accent font-bold tracking-wider uppercase flex items-center justify-between">
                    <span>Character Bible (Left-to-Right Ordering):</span>
                    <span className="text-paper-400 font-normal">
                      Tokens: {vlmAnalysis.prompt_tokens} in / {vlmAnalysis.output_tokens} out
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-paper-200">{vlmAnalysis.character_bible}</p>
                </div>
              </div>
            ) : isStreaming ? (
              <div className="p-8 text-center space-y-3 bg-paper-50 rounded-xl border border-dashed border-paper-300">
                <div className="w-8 h-8 rounded-full border-2 border-studio-accent border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-bold text-paper-900">
                  Gemma 4 Vision-Language Model analyzing character geometry...
                </p>
                <p className="text-[11px] text-paper-800/70 font-mono">
                  Calculating TTFT &amp; building left-to-right character tokens
                </p>
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 bg-paper-50 rounded-xl border border-dashed border-paper-300 text-paper-800">
                <Sparkles className="w-7 h-7 text-paper-400 mx-auto stroke-[1.5]" />
                <p className="text-xs font-bold text-paper-900">Awaiting Generation Trigger</p>
                <p className="text-[11px] text-paper-800/70 max-w-sm mx-auto">
                  Click &quot;Generate 4-Page Coloring Book&quot; to begin streaming the Gemma 4 Character Bible and
                  4 sequential coloring illustrations.
                </p>
              </div>
            )}

            {/* Stream Error Alert if any */}
            {streamError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{streamError}</span>
              </div>
            )}

            {/* Generation Completed Banner */}
            {streamStage === "completed" && activeRunTelemetry && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">4-Page Pack Generation Complete!</span>
                    <span className="text-[11px] text-emerald-700 block font-mono">
                      E2E Duration: {activeRunTelemetry.total_e2e_sec}s • Total Cost: $
                      {activeRunTelemetry.total_pack_cost_usd.toFixed(5)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetStudio}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold transition-colors text-xs"
                  >
                    Reset Studio
                  </button>
                  <Link
                    href="/telemetry"
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors text-xs flex items-center gap-1 shadow-xs"
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
