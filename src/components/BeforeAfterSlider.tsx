"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { SlidersHorizontal, Printer, Image as ImageIcon, Sparkles } from "lucide-react";

interface BeforeAfterSliderProps {
  photoUrl: string;
  coloringUrl: string;
  title: string;
  width?: number; // native pixel width
  height?: number; // native pixel height
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  photoUrl,
  coloringUrl,
  title,
  width = 365,
  height = 544,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
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

  const aspectRatio = `${width} / ${height}`;

  return (
    <div className="flex flex-col items-center">
      {/* Compact, Crisp Native Container (Capped at 320px to 380px so it NEVER stretches or pixelates) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ aspectRatio }}
        className="relative w-full max-w-[320px] sm:max-w-[340px] rounded-2xl overflow-hidden select-none border-2 border-white/20 bg-slate-950 shadow-2xl cursor-ew-resize group"
      >
        {/* Layer 1 (Bottom): Real Vacation Photo */}
        <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="Original Vacation Photo"
            className="w-full h-full object-cover pointer-events-none"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
        </div>

        {/* Layer 2 (Top): Real AI Coloring Line Art with precise CSS clip-path */}
        <div
          className="absolute inset-0 w-full h-full bg-white flex items-center justify-center pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coloringUrl}
            alt="Coloring Page Line Art"
            className="w-full h-full object-cover pointer-events-none"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 pointer-events-none flex items-center gap-1">
          <Printer className="w-3 h-3 text-studio-accent" />
          <span>Coloring Art</span>
        </div>

        <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 pointer-events-none flex items-center gap-1">
          <ImageIcon className="w-3 h-3 text-blue-400" />
          <span>Photo</span>
        </div>

        {/* Slider Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-studio-accent via-white to-studio-cyan shadow-[0_0_12px_rgba(249,115,22,1)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Compact Slider Knob */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-studio-accent shadow-glow flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform">
            <SlidersHorizontal className="w-3.5 h-3.5 text-studio-accent" />
          </div>
        </div>

        {/* Drag Hint Footer */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono text-slate-300 border border-white/10 pointer-events-none whitespace-nowrap">
          Slide left/right to compare
        </div>
      </div>

      {/* Quick Jump Buttons below image */}
      <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono text-slate-400">
        <button
          onClick={() => setSliderPosition(0)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            sliderPosition === 0 ? "bg-studio-accent text-white font-bold" : "hover:text-white bg-white/5"
          }`}
        >
          Photo (0%)
        </button>
        <button
          onClick={() => setSliderPosition(50)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            sliderPosition === 50 ? "bg-studio-accent text-white font-bold" : "hover:text-white bg-white/5"
          }`}
        >
          Split (50%)
        </button>
        <button
          onClick={() => setSliderPosition(100)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            sliderPosition === 100 ? "bg-studio-accent text-white font-bold" : "hover:text-white bg-white/5"
          }`}
        >
          Art (100%)
        </button>
      </div>
    </div>
  );
};
