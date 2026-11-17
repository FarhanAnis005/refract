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
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { triggerWarmup, warmupStatus, setSelectedSamplePhoto } = useRefract();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isPrewarming, setIsPrewarming] = useState(false);

  // Intent-driven pre-warm on "Get Started"
  const handleGetStarted = (samplePhotoUrl?: string) => {
    setIsPrewarming(true);
    if (samplePhotoUrl) {
      setSelectedSamplePhoto(samplePhotoUrl);
    }
    // Fire non-blocking warmup POST
    triggerWarmup(true);
    // Smooth transition to Studio
    router.push("/studio");
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="text-center pt-8 sm:pt-14 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-paper-200/80 border border-paper-300 text-xs font-semibold text-paper-900 shadow-2xs">
          <Sparkles className="w-4 h-4 text-studio-accent" />
          <span>Next-Gen Editorial Family Keepsake Studio</span>
          <span className="text-paper-800/40">•</span>
          <span className="font-mono text-[11px] text-emerald-700 font-bold">
            ~$0.006 per 4-page pack
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-paper-900 tracking-tight leading-[1.1]">
          Turn your family vacation photos into{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-studio-accent via-amber-600 to-orange-700">
            printable kids&apos; coloring books
          </span>
          .
        </h1>

        <p className="text-base sm:text-lg text-paper-800/80 max-w-2xl mx-auto leading-relaxed">
          Refract pairs Gemma 4 Vision-Language analysis with fast serverless diffusion to synthesize a
          personalized 4-page adventure storybook from any family snapshot in seconds.
        </p>

        {/* Intent-Driven Pre-Warm Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => handleGetStarted("/samples/beach-family.svg")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-studio-dark hover:bg-black text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Start Coloring Studio</span>
            <ArrowRight className="w-5 h-5 text-studio-accent group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push("/telemetry")}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-paper-100 hover:bg-paper-200 text-paper-900 font-bold text-base border border-paper-300 transition-colors flex items-center justify-center gap-2"
          >
            <Cpu className="w-5 h-5 text-paper-800" />
            <span>Inspect Telemetry &amp; FinOps</span>
          </button>
        </div>

        {/* Live Container Status Badge in Hero */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-paper-800/80">
          <span
            className={`w-2 h-2 rounded-full ${
              warmupStatus.state === "warm"
                ? "bg-emerald-500"
                : warmupStatus.state === "warming"
                ? "bg-amber-500 animate-ping"
                : "bg-paper-400"
            }`}
          />
          <span>Modal NVIDIA T4 Container:</span>
          <strong
            className={`uppercase ${
              warmupStatus.state === "warm"
                ? "text-emerald-700 font-bold"
                : warmupStatus.state === "warming"
                ? "text-amber-600 font-bold"
                : "text-paper-800"
            }`}
          >
            {warmupStatus.state === "warm" ? "Ready (0s wait)" : warmupStatus.state}
          </strong>
          <span className="text-paper-800/60 hidden sm:inline">
            (Pre-warms automatically on &quot;Start Studio&quot;)
          </span>
        </div>
      </section>

      {/* Interactive Before & After Comparison Slider */}
      <section className="max-w-5xl mx-auto">
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-paper-300 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-studio-accent">
                Interactive Showcase
              </span>
              <h2 className="text-xl font-bold text-paper-900">
                Vacation Snapshot $\rightarrow$ Pure B&amp;W Coloring Line Art
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-paper-800/70">
              <span>Drag slider to compare:</span>
              <span className="font-mono bg-paper-100 px-2 py-0.5 rounded text-paper-900 font-bold">
                {sliderPosition}%
              </span>
            </div>
          </div>

          {/* Slider Container */}
          <div
            className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden select-none border border-paper-200 bg-paper-100"
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
            {/* "After" Image (Right: Clean Black & White Coloring Art) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/samples/beach-family.svg"
              alt="Family Vacation Photo"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.95]"
            />

            {/* "Before" Layer Clipped (Left: Coloring Line Art) */}
            <div
              className="absolute inset-0 overflow-hidden bg-white"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Using Page 1 Coloring Art */}
              <div
                className="w-full h-full bg-white flex items-center justify-center p-4"
                style={{ width: "100%", height: "100%" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/beach-family.svg"
                  alt="Coloring Page Outline"
                  className="w-full h-full object-cover filter grayscale contrast-200 brightness-105 invert"
                />
              </div>

              {/* Tag for Left side */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 backdrop-blur-xs">
                <Printer className="w-3.5 h-3.5 text-studio-accent" />
                Coloring Line Art (#000000 / #FFFFFF)
              </div>
            </div>

            {/* Tag for Right side */}
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 backdrop-blur-xs pointer-events-none">
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              Original Vacation Photo
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg border-2 border-studio-dark flex items-center justify-center">
                <div className="w-1.5 h-4 flex justify-between">
                  <div className="w-0.5 h-full bg-paper-800 rounded-full" />
                  <div className="w-0.5 h-full bg-paper-800 rounded-full" />
                </div>
              </div>
            </div>

            {/* Slider input control overlay for accessibility */}
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

          <div className="flex flex-wrap items-center justify-between text-xs text-paper-800/80 px-1 pt-1">
            <span>✨ Pure vector-ready black lines optimized for home laser &amp; inkjet printing.</span>
            <span className="font-mono">8.5&quot; x 11&quot; US Letter &amp; A4 Standard</span>
          </div>
        </div>
      </section>

      {/* 1-Click Vacation Presets */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-paper-900">Try a 1-Click Vacation Preset</h2>
          <p className="text-sm text-paper-800/80">
            Click any sample family photo below to pre-warm the GPU container and launch the Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preset 1 */}
          <div
            onClick={() => handleGetStarted("/samples/beach-family.svg")}
            className="group cursor-pointer rounded-2xl bg-white border border-paper-300 p-4 shadow-xs hover:shadow-lg hover:border-studio-accent transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-paper-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/beach-family.svg"
                  alt="Beach Family"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono">
                  5 Family Members
                </span>
              </div>
              <div>
                <h3 className="font-bold text-paper-900 group-hover:text-studio-accent transition-colors">
                  Tropical Beach Vacation
                </h3>
                <p className="text-xs text-paper-800/80 mt-1">
                  Sun hats, sunglasses, and sandcastles on a sunny Hawaiian coast.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-paper-200 flex items-center justify-between text-xs font-bold text-studio-accent">
              <span>Launch Studio</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 2 */}
          <div
            onClick={() => handleGetStarted("/samples/mountain-hike.svg")}
            className="group cursor-pointer rounded-2xl bg-white border border-paper-300 p-4 shadow-xs hover:shadow-lg hover:border-studio-accent transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-paper-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/mountain-hike.svg"
                  alt="Mountain Hike"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono">
                  4 Hikers
                </span>
              </div>
              <div>
                <h3 className="font-bold text-paper-900 group-hover:text-studio-accent transition-colors">
                  Rocky Mountain Alpine Trail
                </h3>
                <p className="text-xs text-paper-800/80 mt-1">
                  Backpacks, pine forests, and snowy peaks on a family alpine adventure.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-paper-200 flex items-center justify-between text-xs font-bold text-studio-accent">
              <span>Launch Studio</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Preset 3 */}
          <div
            onClick={() => handleGetStarted("/samples/lake-camping.svg")}
            className="group cursor-pointer rounded-2xl bg-white border border-paper-300 p-4 shadow-xs hover:shadow-lg hover:border-studio-accent transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-paper-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/samples/lake-camping.svg"
                  alt="Lake Tahoe Campfire"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono">
                  Canoe &amp; Tent
                </span>
              </div>
              <div>
                <h3 className="font-bold text-paper-900 group-hover:text-studio-accent transition-colors">
                  Lakeside Twilight Campfire
                </h3>
                <p className="text-xs text-paper-800/80 mt-1">
                  Tents, roasted marshmallows, and starry reflections on mirror water.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-paper-200 flex items-center justify-between text-xs font-bold text-studio-accent">
              <span>Launch Studio</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-paper-100 border border-paper-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-paper-900 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-studio-accent" />
          </div>
          <h3 className="text-base font-bold text-paper-900">Gemma 4 VLM Character Bible</h3>
          <p className="text-xs text-paper-800/80 leading-relaxed">
            Extracts exact headcount, left-to-right character styling, colors, and setting to maintain
            faithful character consistency across all 4 book pages.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-paper-100 border border-paper-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-paper-900 text-white flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-base font-bold text-paper-900">Progressive SSE Stream</h3>
          <p className="text-xs text-paper-800/80 leading-relaxed">
            Zero multi-minute blocking waits. Pages appear in the Studio one-by-one as each KSampler + VAE
            stage finishes on the serverless GPU container.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-paper-100 border border-paper-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-paper-900 text-white flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-paper-900">Real-Time FinOps Telemetry</h3>
          <p className="text-xs text-paper-800/80 leading-relaxed">
            NVIDIA T4 billing tracked down to the microsecond ($0.000164/sec). Each 4-page coloring pack
            costs ~$0.006 total, giving 160+ packs per $1.
          </p>
        </div>
      </section>
    </div>
  );
}
