"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRefract } from "@/context/RefractContext";
import {
  Sparkles,
  ArrowRight,
  Printer,
  Zap,
  DollarSign,
  Cpu,
  Layers,
  ChevronRight,
  Image as ImageIcon,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Flame,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { triggerWarmup, warmupStatus, setSelectedSamplePhoto } = useRefract();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeShowcasePack, setActiveShowcasePack] = useState<"pack5" | "pack3">("pack5");

  // Real photos and line art from user's uploaded packs
  const showcaseData = {
    pack5: {
      photo: "/samples/pack-family-5/images.jpg",
      coloring: "/samples/pack-family-5/01_faithful_keepsake_portrait.png",
      title: "Family of 5 in Ocean Waves",
      headcount: 5,
      resolution: "368 × 544",
      cost: "~$0.012 / page",
    },
    pack3: {
      photo: "/samples/pack-family-3/istockphoto-2157349912-612x612.jpg",
      coloring: "/samples/pack-family-3/01_faithful_keepsake_portrait.png",
      title: "Family of 3 on Sunlit Beach",
      headcount: 3,
      resolution: "608 × 416",
      cost: "~$0.008 / page",
    },
  };

  const activeShowcase = showcaseData[activeShowcasePack];

  const handleGetStarted = (samplePhotoUrl?: string) => {
    if (samplePhotoUrl) {
      setSelectedSamplePhoto(samplePhotoUrl);
    }
    triggerWarmup(true);
    router.push("/studio");
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative text-center pt-8 sm:pt-14 max-w-4xl mx-auto space-y-6">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-studio-accent/20 to-studio-cyan/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Micro Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold text-slate-200 shadow-glow">
          <Sparkles className="w-4 h-4 text-studio-accent animate-spin" style={{ animationDuration: "8s" }} />
          <span>Next-Gen Editorial Kids&apos; Coloring Studio</span>
          <span className="text-slate-600">•</span>
          <span className="font-mono text-emerald-400 font-bold">
            Gemma 4 VLM + Modal T4
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Turn your family vacation photos into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-accent via-amber-400 to-orange-500 text-glow-accent">
            printable coloring books
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Refract extracts a left-to-right Character Bible with Gemma 4 Vision-Language analysis, then streams 4
          high-contrast, printable vector coloring pages over serverless NVIDIA T4 diffusion.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <button
            onClick={() => handleGetStarted("/samples/pack-family-5/images.jpg")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-studio-accent via-orange-600 to-amber-600 hover:opacity-95 text-white font-extrabold text-base shadow-glow hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Start Coloring Studio</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push("/telemetry")}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel hover:bg-white/10 text-white font-bold text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Inspect FinOps &amp; Latency</span>
          </button>
        </div>

        {/* Live Container Status Badge in Hero */}
        <div className="flex items-center justify-center gap-2.5 text-xs font-mono text-slate-400 pt-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              warmupStatus.state === "warm"
                ? "bg-emerald-400 shadow-[0_0_10px_#34D399]"
                : warmupStatus.state === "warming"
                ? "bg-amber-400 animate-ping"
                : "bg-slate-500"
            }`}
          />
          <span>Modal T4 Status:</span>
          <strong
            className={`uppercase ${
              warmupStatus.state === "warm"
                ? "text-emerald-400 font-bold"
                : warmupStatus.state === "warming"
                ? "text-amber-400 font-bold"
                : "text-slate-300"
            }`}
          >
            {warmupStatus.state === "warm" ? "Container Warm & Ready" : warmupStatus.state}
          </strong>
          <span className="text-slate-500 hidden sm:inline">
            (Pre-warms automatically on button click)
          </span>
        </div>
      </section>

      {/* Interactive Before & After Showcase Slider with Real Photos! */}
      <section className="max-w-5xl mx-auto">
        <div className="p-5 sm:p-7 rounded-3xl glass-panel-elevated space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-studio-accent">
                  Interactive AI Transformation
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-studio-accent/20 text-studio-accent font-mono font-bold">
                  Real AI Output
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeShowcase.title}
              </h2>
            </div>

            {/* Showcase Pack Switcher */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold">
              <button
                onClick={() => setActiveShowcasePack("pack5")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeShowcasePack === "pack5"
                    ? "bg-studio-accent text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Family of 5 (Beach)
              </button>
              <button
                onClick={() => setActiveShowcasePack("pack3")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeShowcasePack === "pack3"
                    ? "bg-studio-accent text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Family of 3 (Coast)
              </button>
            </div>
          </div>

          {/* Interactive Comparison Slider */}
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none border border-white/15 bg-black shadow-2xl"
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                setSliderPosition(Math.round(pos));
              }
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const pos = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
              setSliderPosition(Math.round(pos));
            }}
          >
            {/* "After" Image (Right: Real Vacation Photo) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeShowcase.photo}
              alt="Real Vacation Snapshot"
              className="absolute inset-0 w-full h-full object-contain bg-slate-950"
            />

            {/* "Before" Layer Clipped (Left: Real AI Coloring Line Art) */}
            <div
              className="absolute inset-0 overflow-hidden bg-white"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="w-full h-full flex items-center justify-center bg-white" style={{ width: "100%", height: "100%" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeShowcase.coloring}
                  alt="Real AI Line Art Coloring Page"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Tag for Left side */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/85 text-white text-xs font-bold tracking-wide flex items-center gap-2 backdrop-blur-md border border-white/20 shadow-lg">
                <Printer className="w-3.5 h-3.5 text-studio-accent" />
                <span>#000000 on #FFFFFF Line Art</span>
              </div>
            </div>

            {/* Tag for Right side */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/85 text-white text-xs font-bold tracking-wide flex items-center gap-2 backdrop-blur-md border border-white/20 shadow-lg pointer-events-none">
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Original Vacation Photo</span>
            </div>

            {/* Slider Divider Bar with Glass Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-studio-accent via-white to-studio-cyan shadow-[0_0_15px_rgba(249,115,22,0.8)] cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-studio-accent shadow-glow flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-studio-accent" />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Before/After comparison slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />
          </div>

          {/* Slider Meta Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 font-mono px-1">
            <div className="flex items-center gap-4">
              <span>
                <strong>Headcount:</strong> {activeShowcase.headcount} persons
              </span>
              <span>
                <strong>Resolution:</strong> {activeShowcase.resolution}
              </span>
              <span>
                <strong>Modal Cost:</strong>{" "}
                <span className="text-emerald-400 font-bold">{activeShowcase.cost}</span>
              </span>
            </div>
            <div className="text-slate-400 text-[11px] font-sans">
              Drag slider horizontally to inspect line detail
            </div>
          </div>
        </div>
      </section>

      {/* 1-Click Vacation Presets */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-studio-accent">
            Ready-to-Test Packs
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Choose a Real Family Photo Preset
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            One-click triggers pre-warm and loads the complete 4-page coloring pack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preset 1: Family of 5 */}
          <div
            onClick={() => handleGetStarted("/samples/pack-family-5/images.jpg")}
            className="group cursor-pointer rounded-3xl glass-panel p-5 hover:border-studio-accent/70 hover:shadow-glow transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/pack-family-5/images.jpg"
                  alt="Beach Family of 5"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-white border border-white/15">
                  Pack #1 • 5 Family Members
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30">
                  4 Pages • 368×544
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-studio-accent transition-colors flex items-center justify-between">
                  <span>Ocean Beach Waves (Family of 5)</span>
                  <Flame className="w-4 h-4 text-studio-accent" />
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Faithful Keepsake Portrait, Sandcastle Architects, Ocean Friends Playtime with dolphins, and Beach Day Souvenir banner.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-studio-accent">
              <span>Launch Studio with Pack 1</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Preset 2: Family of 3 */}
          <div
            onClick={() => handleGetStarted("/samples/pack-family-3/istockphoto-2157349912-612x612.jpg")}
            className="group cursor-pointer rounded-3xl glass-panel p-5 hover:border-studio-accent/70 hover:shadow-glow transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/pack-family-3/istockphoto-2157349912-612x612.jpg"
                  alt="Beach Family of 3"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-white border border-white/15">
                  Pack #2 • 3 Family Members
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30">
                  4 Pages • 608×416
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-studio-accent transition-colors flex items-center justify-between">
                  <span>Sunlit Coastal Shore (Family of 3)</span>
                  <Flame className="w-4 h-4 text-studio-accent" />
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Recreated beach pose, massive sandcastle building scene, playful wave splashing with dolphins, and framed souvenir poster.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-studio-accent">
              <span>Launch Studio with Pack 2</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-3xl glass-panel space-y-3 border-t-2 border-t-studio-accent">
          <div className="w-10 h-10 rounded-xl bg-studio-accent/20 border border-studio-accent/30 text-studio-accent flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Gemma 4 VLM Character Bible</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Extracts exact headcount, left-to-right character styling, clothing, and smiles to maintain
            faithful character consistency across all 4 book pages.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 border-t-2 border-t-studio-cyan">
          <div className="w-10 h-10 rounded-xl bg-studio-cyan/20 border border-studio-cyan/30 text-studio-cyan flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Progressive SSE Stream</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Zero blocking waits. Pages arrive in the Studio one-by-one as each KSampler + VAE stage completes. Fast Demo (4x) reveals all in ~10 seconds.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 border-t-2 border-t-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Real-Time Modal T4 FinOps</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            GPU compute tracked to the millisecond ($0.000164/sec). Each 4-page pack costs ~$0.03 - $0.04 on real T4 hardware.
          </p>
        </div>
      </section>
    </div>
  );
}
