"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRefract } from "@/context/RefractContext";
import {
  Palette,
  BarChart3,
  Cpu,
  Sparkles,
  Zap,
  RotateCw,
  Home,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { warmupStatus, triggerWarmup, checkWarmup } = useRefract();
  const [showContainerModal, setShowContainerModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkWarmup();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-paper-50/95 backdrop-blur-md border-b border-paper-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-paper-900 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-studio-accent" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-paper-900 flex items-center gap-1.5">
                REFRACT
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-studio-accent text-white uppercase font-bold tracking-widest">
                  v1.0
                </span>
              </span>
              <p className="text-[10px] text-paper-800/70 font-medium hidden sm:block">
                Vacation Photo $\rightarrow$ Kids&apos; Coloring Studio
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname === "/"
                  ? "bg-paper-200 text-paper-900"
                  : "text-paper-800 hover:text-paper-900 hover:bg-paper-100"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </Link>

            <Link
              href="/studio"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname === "/studio"
                  ? "bg-studio-dark text-white shadow-xs"
                  : "text-paper-800 hover:text-paper-900 hover:bg-paper-100"
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-studio-accent" />
              <span>Studio</span>
            </Link>

            <Link
              href="/telemetry"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname === "/telemetry"
                  ? "bg-paper-900 text-white shadow-xs"
                  : "text-paper-800 hover:text-paper-900 hover:bg-paper-100"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telemetry &amp; FinOps</span>
            </Link>
          </nav>
        </div>

        {/* Live Container Warmup Status Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (warmupStatus.state === "cold") {
                triggerWarmup();
              } else {
                setShowContainerModal(!showContainerModal);
              }
            }}
            title="Click to view container status or pre-warm"
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all shadow-xs border ${
              warmupStatus.state === "warm"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                : warmupStatus.state === "warming"
                ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse"
                : "bg-paper-100 text-paper-800 border-paper-300 hover:bg-paper-200"
            }`}
          >
            {/* Status indicator dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                warmupStatus.state === "warm"
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : warmupStatus.state === "warming"
                  ? "bg-amber-500 animate-ping"
                  : "bg-paper-400"
              }`}
            />

            <span>
              {warmupStatus.state === "warm"
                ? "T4 Ready"
                : warmupStatus.state === "warming"
                ? "Warming T4 Container..."
                : "Cold (Click to Warm)"}
            </span>

            <span className="hidden md:inline text-[10px] text-paper-800/60 font-sans">
              [{warmupStatus.gpu}]
            </span>
          </button>

          {/* Quick Refresh Icon */}
          <button
            onClick={handleRefresh}
            title="Refresh status"
            className="p-2 rounded-lg text-paper-800 hover:bg-paper-200 transition-colors"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Container Details Dropdown Modal */}
      {showContainerModal && (
        <div className="absolute right-6 top-18 z-50 w-80 p-4 rounded-xl bg-white border border-paper-300 shadow-xl text-xs space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 border-b border-paper-200">
            <span className="font-bold text-paper-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-studio-accent" />
              Modal T4 Container Spec
            </span>
            <button
              onClick={() => setShowContainerModal(false)}
              className="text-paper-800/60 hover:text-paper-900 font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-paper-800/80">Container State:</span>
              <span
                className={`font-bold uppercase ${
                  warmupStatus.state === "warm"
                    ? "text-emerald-700"
                    : warmupStatus.state === "warming"
                    ? "text-amber-600"
                    : "text-paper-800"
                }`}
              >
                {warmupStatus.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-paper-800/80">Hardware:</span>
              <span className="text-paper-900">{warmupStatus.gpu}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-paper-800/80">Container ID:</span>
              <span className="text-paper-900 truncate max-w-[140px]">
                {warmupStatus.container_id || "modal-t4-c89b2f"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-paper-800/80">Warmup Elapsed:</span>
              <span className="text-paper-900">
                {(warmupStatus.elapsed_ms / 1000).toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-paper-800/80">Modal Billing Rate:</span>
              <span className="text-emerald-700 font-bold">$0.000164 / sec</span>
            </div>
          </div>

          {warmupStatus.state === "cold" && (
            <button
              onClick={() => {
                triggerWarmup();
                setShowContainerModal(false);
              }}
              className="w-full py-2 rounded-lg bg-studio-accent hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              Pre-Warm Modal T4 Container
            </button>
          )}
        </div>
      )}
    </header>
  );
};
