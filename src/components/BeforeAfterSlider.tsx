"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  Columns,
  Play,
  Pause,
  Printer,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface BeforeAfterSliderProps {
  photoUrl: string;
  coloringUrl: string;
  title: string;
  aspectRatioClass?: string;
  headcount?: number;
  resolution?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  photoUrl,
  coloringUrl,
  title,
  aspectRatioClass = "aspect-[368/544]",
  headcount = 5,
  resolution = "368 × 544",
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slider" | "sideBySide">("slider");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoPlayRef = useRef<number | null>(null);
  const autoPlayDirectionRef = useRef<number>(1);

  // Auto-play scanner effect
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current) cancelAnimationFrame(autoPlayRef.current);
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setSliderPosition((prev) => {
        let next = prev + autoPlayDirectionRef.current * delta * 35; // 35% per second
        if (next >= 85) {
          next = 85;
          autoPlayDirectionRef.current = -1;
        } else if (next <= 15) {
          next = 15;
          autoPlayDirectionRef.current = 1;
        }
        return next;
      });

      autoPlayRef.current = requestAnimationFrame(animate);
    };

    autoPlayRef.current = requestAnimationFrame(animate);
    return () => {
      if (autoPlayRef.current) cancelAnimationFrame(autoPlayRef.current);
    };
  }, [isAutoPlaying]);

  // Position calculation from clientX
  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="space-y-4">
      {/* View Mode & Preset Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-2.5 rounded-2xl border border-white/10 text-xs">
        {/* Quick Position Jump Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Split:</span>
          {[
            { label: "0% (Photo)", value: 0 },
            { label: "25%", value: 25 },
            { label: "50% (Split)", value: 50 },
            { label: "75%", value: 75 },
            { label: "100% (Line Art)", value: 100 },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => {
                setIsAutoPlaying(false);
                setSliderPosition(btn.value);
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                Math.round(sliderPosition) === btn.value
                  ? "bg-studio-accent text-white font-bold shadow-glow"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Action Controls: Auto-Play & View Mode */}
        <div className="flex items-center gap-2">
          {/* Auto-Play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isAutoPlaying
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoPlaying ? "Pause Auto-Scan" : "Auto-Scan"}</span>
          </button>

          {/* Side-by-Side Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "slider" ? "sideBySide" : "slider")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              viewMode === "sideBySide"
                ? "bg-studio-accent/20 text-studio-accent border-studio-accent/40 shadow-glow"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{viewMode === "sideBySide" ? "Slider View" : "Side-by-Side"}</span>
          </button>
        </div>
      </div>

      {/* Main Display: Slider Mode vs Side-by-Side Mode */}
      {viewMode === "sideBySide" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Original Vacation Photo */}
          <div className="rounded-2xl overflow-hidden border border-white/15 bg-slate-950 flex flex-col shadow-xl">
            <div className="p-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                Original Vacation Photo
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                Input Snapshot
              </span>
            </div>
            <div className={`relative w-full ${aspectRatioClass} flex items-center justify-center p-2 bg-slate-950`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Original Family Vacation Photo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Right: Real AI Coloring Line Art */}
          <div className="rounded-2xl overflow-hidden border border-white/15 bg-white flex flex-col shadow-xl">
            <div className="p-3 border-b border-paper-200 bg-paper-100 flex items-center justify-between text-paper-900">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-studio-accent" />
                Faithful Keepsake Line Art (#000000 on #FFFFFF)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                Real AI Output
              </span>
            </div>
            <div className={`relative w-full ${aspectRatioClass} flex items-center justify-center p-2 bg-white`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coloringUrl}
                alt="AI Generated Coloring Page Line Art"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Bulletproof Interactive Before/After Slider */
        <div className="flex justify-center">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`relative max-w-2xl w-full ${aspectRatioClass} rounded-2xl overflow-hidden select-none border-2 border-white/20 bg-slate-950 shadow-2xl cursor-ew-resize group`}
          >
            {/* Layer 1 (Bottom): Original Vacation Photo */}
            <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Original Vacation Photo"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Layer 2 (Top): Pure White AI Coloring Line Art with precise CSS clip-path */}
            <div
              className="absolute inset-0 w-full h-full bg-white flex items-center justify-center p-2 pointer-events-none transition-none"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coloringUrl}
                alt="Coloring Book Line Art"
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Corner Badge Left: Line Art */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/85 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-lg pointer-events-none">
              <Printer className="w-3.5 h-3.5 text-studio-accent" />
              <span>Coloring Line Art</span>
            </div>

            {/* Corner Badge Right: Original Photo */}
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 backdrop-blur-md border border-white/20 shadow-lg pointer-events-none">
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Original Photo</span>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-studio-accent via-white to-studio-cyan shadow-[0_0_15px_rgba(249,115,22,0.9)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Glowing Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-slate-900 border-2 border-studio-accent shadow-glow flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="w-4 h-4 text-studio-accent" />
              </div>
            </div>

            {/* Subtle Drag Hint Overlay on First Load */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono text-slate-300 border border-white/10 pointer-events-none">
              Slide left/right or click to inspect
            </div>
          </div>
        </div>
      )}

      {/* Meta Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-1 px-1">
        <div className="flex items-center gap-4">
          <span>
            <strong>Headcount:</strong> {headcount} persons
          </span>
          <span>
            <strong>AI Resolution:</strong> {resolution}
          </span>
          <span className="text-emerald-400 font-bold">
            100% Pure #000000 on #FFFFFF Vector Art
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-sans">
          Exact character faces, hairstyles, and vacation attire preserved
        </div>
      </div>
    </div>
  );
};
