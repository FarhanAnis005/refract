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
  ChevronRight,
  Shield,
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
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-studio-accent to-orange-700 flex items-center justify-center font-black shadow-glow group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
              <div className="absolute -inset-0.5 rounded-xl bg-studio-accent opacity-30 blur-xs -z-10 group-hover:opacity-60 transition-opacity" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white flex items-center gap-2">
                REFRACT
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-studio-accent/20 border border-studio-accent/40 text-studio-accent uppercase font-bold tracking-widest shadow-2xs">
                  v1.0
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Vacation Photo $\rightarrow$ Kids&apos; Coloring Studio
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/"
                  ? "bg-white/10 text-white border border-white/15 shadow-xs"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Overview</span>
            </Link>

            <Link
              href="/studio"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/studio"
                  ? "bg-gradient-to-r from-studio-accent to-orange-600 text-white shadow-glow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Studio</span>
            </Link>

            <Link
              href="/telemetry"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pathname === "/telemetry"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-glow-emerald"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
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
            className={`group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer border ${
              warmupStatus.state === "warm"
                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:border-emerald-400 shadow-glow-emerald"
                : warmupStatus.state === "warming"
                ? "bg-amber-950/60 text-amber-300 border-amber-500/40 hover:border-amber-400 animate-pulse"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500"
            }`}
          >
            {/* Status indicator dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                warmupStatus.state === "warm"
                  ? "bg-emerald-400 shadow-[0_0_10px_#34D399]"
                  : warmupStatus.state === "warming"
                  ? "bg-amber-400 animate-ping"
                  : "bg-slate-500"
              }`}
            />

            <span>
              {warmupStatus.state === "warm"
                ? "T4 Ready"
                : warmupStatus.state === "warming"
                ? "Warming T4 Container..."
                : "Cold (Click to Warm)"}
            </span>

            <span className="hidden md:inline text-[10px] text-slate-400 font-sans">
              [{warmupStatus.gpu}]
            </span>
          </button>

          {/* Quick Refresh Icon */}
          <button
            onClick={handleRefresh}
            title="Refresh status"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-studio-accent" : ""}`} />
          </button>
        </div>
      </div>

      {/* Container Details Dropdown Modal */}
      {showContainerModal && (
        <div className="absolute right-6 top-18 z-50 w-84 p-5 rounded-2xl glass-panel-elevated text-xs space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-studio-accent" />
              Modal T4 Container Spec
            </span>
            <button
              onClick={() => setShowContainerModal(false)}
              className="text-slate-400 hover:text-white font-bold p-1 rounded-md"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Container State:</span>
              <span
                className={`font-bold uppercase ${
                  warmupStatus.state === "warm"
                    ? "text-emerald-400"
                    : warmupStatus.state === "warming"
                    ? "text-amber-400"
                    : "text-slate-300"
                }`}
              >
                {warmupStatus.state}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Hardware:</span>
              <span className="text-slate-200">{warmupStatus.gpu}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Container ID:</span>
              <span className="text-studio-cyan font-bold truncate max-w-[140px]">
                {warmupStatus.container_id || "modal-t4-c89b2f"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Warmup Elapsed:</span>
              <span className="text-slate-200">
                {(warmupStatus.elapsed_ms / 1000).toFixed(2)}s
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Modal Billing Rate:</span>
              <span className="text-emerald-400 font-bold">$0.000164 / sec</span>
            </div>
          </div>

          {warmupStatus.state === "cold" && (
            <button
              onClick={() => {
                triggerWarmup();
                setShowContainerModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-glow cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              Pre-Warm Modal T4 Container
            </button>
          )}
        </div>
      )}
    </header>
  );
};
