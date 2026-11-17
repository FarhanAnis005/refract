"use client";

import React from "react";
import Link from "next/link";
import { useRefract } from "@/context/RefractContext";
import { TelemetryCharts } from "@/components/TelemetryCharts";
import {
  BarChart3,
  Palette,
  Sparkles,
  Cpu,
  Zap,
  TrendingDown,
  Layers,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";

export default function TelemetryPage() {
  const { runs, selectedTelemetryRun, setSelectedRunId } = useRefract();

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            Infrastructure &amp; FinOps Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Pipeline Latency &amp; Cost Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time inference profiling for Gemma 4 (26B A4B-IT) and Modal NVIDIA T4 serverless diffusion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white text-xs font-bold shadow-glow transition-all"
          >
            <Palette className="w-4 h-4" />
            <span>Go to Studio</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Recharts Component */}
      <TelemetryCharts
        run={selectedTelemetryRun}
        runs={runs}
        onSelectRun={(id) => setSelectedRunId(id)}
      />

      {/* FinOps Economics Reference Section */}
      <section className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          Unit Economics &amp; Serverless Cold-Start Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-studio-accent" />
              1. Intent-Driven Pre-Warm
            </h4>
            <p className="text-slate-400">
              When a user clicks &quot;Start Coloring Studio&quot; on the landing page, Refract fires a non-blocking{" "}
              <code className="font-mono bg-black/60 px-1.5 py-0.5 rounded text-studio-accent">POST /api/warmup</code> with{" "}
              <code className="font-mono bg-black/60 px-1.5 py-0.5 rounded text-studio-accent">keepalive: true</code>. By the time they
              arrive in the Studio, the NVIDIA T4 container is already warm, cutting user-perceived cold start to 0 seconds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-400" />
              2. NVIDIA T4 Compute Cost
            </h4>
            <p className="text-slate-400">
              Modal bills NVIDIA T4 instances at <strong className="text-white font-mono">$0.000164/sec</strong> ($0.59/hr).
              With 4-step diffusion generating each coloring page in ~8–35s, an entire 4-page coloring pack costs between{" "}
              <strong className="text-emerald-400 font-mono">$0.006 – $0.048</strong> on real production hardware.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-studio-cyan" />
              3. Progressive SSE Streaming
            </h4>
            <p className="text-slate-400">
              Rather than blocking until all 4 pages are rendered, Refract delivers Page 1, Page 2, Page 3, and Page 4 sequentially
              over a single SSE channel. In Fast Demo mode (4x), all 4 arrive in ~10 seconds for rapid evaluator demonstrations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
