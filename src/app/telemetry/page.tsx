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
} from "lucide-react";

export default function TelemetryPage() {
  const { runs, selectedTelemetryRun, setSelectedRunId } = useRefract();

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-paper-300 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Infrastructure &amp; FinOps Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-paper-900 tracking-tight">
            Pipeline Latency &amp; Cost Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-paper-800/80 mt-1">
            Real-time inference profiling for Gemma 4 (26B A4B-IT) and Modal NVIDIA T4 serverless diffusion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-studio-dark hover:bg-black text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Palette className="w-4 h-4 text-studio-accent" />
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
      <section className="p-6 rounded-2xl bg-paper-100 border border-paper-300 space-y-4">
        <h3 className="text-base font-bold text-paper-900 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-emerald-600" />
          Unit Economics &amp; Serverless Cold-Start Strategy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-paper-800/80 leading-relaxed">
          <div className="p-4 rounded-xl bg-white border border-paper-200 space-y-1.5">
            <h4 className="font-bold text-paper-900 text-sm">1. Intent-Driven Pre-Warm</h4>
            <p>
              When a user clicks &quot;Get Started&quot; or selects a sample photo on the landing page, Refract fires a
              non-blocking <code className="font-mono bg-paper-100 px-1 py-0.5 rounded">POST /api/warmup</code> with{" "}
              <code className="font-mono bg-paper-100 px-1 py-0.5 rounded">keepalive: true</code>. By the time they
              arrive in the Studio, the NVIDIA T4 container is already warm, cutting user-perceived cold start to 0.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-paper-200 space-y-1.5">
            <h4 className="font-bold text-paper-900 text-sm">2. NVIDIA T4 Compute Cost</h4>
            <p>
              Modal bills NVIDIA T4 instances at <strong className="text-paper-900 font-mono">$0.000164/sec</strong> ($0.59/hr).
              With 4-step SDXL Lightning/Turbo diffusion generating each coloring page in ~8.9s ($0.00147), an entire
              4-page coloring pack costs approximately <strong className="text-emerald-700 font-mono">$0.006</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-paper-200 space-y-1.5">
            <h4 className="font-bold text-paper-900 text-sm">3. Progressive SSE Streaming</h4>
            <p>
              Rather than blocking until all 4 pages are rendered (~41s), Refract delivers Page 1 in ~11s, Page 2 in ~21s,
              Page 3 in ~31s, and Page 4 in ~41s over a single SSE channel. In Fast Demo mode (4x), all 4 arrive in ~10s.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
