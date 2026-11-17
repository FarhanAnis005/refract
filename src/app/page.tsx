"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useRefract } from "@/context/RefractContext";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import {
  Sparkles,
  ArrowRight,
  Printer,
  Zap,
  DollarSign,
  Cpu,
  Layers,
  ChevronRight,
  Flame,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { triggerWarmup, warmupStatus, setSelectedSamplePhoto } = useRefract();
  const [activePack, setActivePack] = useState<"pack5" | "pack3">("pack5");

  const packs = {
    pack5: {
      photo: "/samples/pack-family-5/images.jpg",
      coloring: "/samples/pack-family-5/01_faithful_keepsake_portrait.png",
      title: "Family of 5 in Ocean Waves",
      headcount: 5,
      width: 365,
      height: 544,
      tag: "5 Persons • Ocean Waves",
    },
    pack3: {
      photo: "/samples/pack-family-3/istockphoto-2157349912-612x612.jpg",
      coloring: "/samples/pack-family-3/01_faithful_keepsake_portrait.png",
      title: "Family of 3 on Sunlit Beach",
      headcount: 3,
      width: 608,
      height: 416,
      tag: "3 Persons • Sunlit Shore",
    },
  };

  const current = packs[activePack];

  const handleStart = (photoUrl: string) => {
    setSelectedSamplePhoto(photoUrl);
    triggerWarmup(true);
    router.push("/studio");
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 space-y-10">
      {/* Compact Split-Screen Hero: Value Prop on Left, Crisp Native Slider on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (7 cols): Headline & Fast Actions */}
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
            <span>Refract AI Coloring Studio</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-emerald-400 font-bold">Gemma 4 + Modal T4</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
            Turn family vacation photos into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-studio-accent via-amber-400 to-orange-500">
              printable kids&apos; coloring books
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Gemma 4 extracts a left-to-right Character Bible from your family snapshot, then streams 4
            pure black-and-white vector coloring pages over serverless NVIDIA T4 diffusion.
          </p>

          {/* Sample Pack Switcher */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Select Sample Family Pack:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActivePack("pack5")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePack === "pack5"
                    ? "bg-studio-accent text-white shadow-glow"
                    : "glass-panel text-slate-300 hover:text-white"
                }`}
              >
                🌊 Family of 5 (Ocean Waves)
              </button>
              <button
                onClick={() => setActivePack("pack3")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePack === "pack3"
                    ? "bg-studio-accent text-white shadow-glow"
                    : "glass-panel text-slate-300 hover:text-white"
                }`}
              >
                🏖️ Family of 3 (Beach Coast)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => handleStart(current.photo)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-studio-accent via-orange-600 to-amber-600 hover:opacity-95 text-white font-extrabold text-sm shadow-glow transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Start Coloring Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push("/telemetry")}
              className="px-6 py-3.5 rounded-xl glass-panel hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>AI Workflow Graph</span>
            </button>
          </div>

          {/* Warmup Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
            <span
              className={`w-2 h-2 rounded-full ${
                warmupStatus.state === "warm"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34D399]"
                  : warmupStatus.state === "warming"
                  ? "bg-amber-400 animate-ping"
                  : "bg-slate-500"
              }`}
            />
            <span>Modal T4:</span>
            <strong
              className={`uppercase ${
                warmupStatus.state === "warm"
                  ? "text-emerald-400 font-bold"
                  : warmupStatus.state === "warming"
                  ? "text-amber-400 font-bold"
                  : "text-slate-300"
              }`}
            >
              {warmupStatus.state === "warm" ? "Ready (0s wait)" : warmupStatus.state}
            </strong>
          </div>
        </div>

        {/* Right Column (5 cols): Crisp Native-Resolution Slider (Never Stretched!) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="p-4 rounded-3xl glass-panel-elevated space-y-3">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-studio-accent" />
                {current.title}
              </span>
              <span className="text-[10px] font-mono text-studio-accent font-bold">
                1:1 Native Scale
              </span>
            </div>

            {/* Crisp Slider */}
            <BeforeAfterSlider
              photoUrl={current.photo}
              coloringUrl={current.coloring}
              title={current.title}
              width={current.width}
              height={current.height}
            />
          </div>
        </div>
      </div>

      {/* 3 Quick Value Badges (Compact, No Scrolling Needed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10">
        <div className="p-4 rounded-2xl glass-panel space-y-1.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-studio-accent" />
            <span>Gemma 4 Character Bible</span>
          </div>
          <p className="text-xs text-slate-400">
            Extracts exact headcount, positioning, and attire for character consistency across all 4 pages.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel space-y-1.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Layers className="w-4 h-4 text-studio-cyan" />
            <span>Progressive 4-Page Stream</span>
          </div>
          <p className="text-xs text-slate-400">
            Pages stream sequentially as they finish rendering. Fast Demo mode delivers all 4 pages in ~10 seconds.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel space-y-1.5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Modal T4 Compute Pricing</span>
          </div>
          <p className="text-xs text-slate-400">
            Microsecond billing at $0.000164/sec. Complete 4-page pack costs ~$0.03 – $0.04.
          </p>
        </div>
      </div>
    </div>
  );
}
