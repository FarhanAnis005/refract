"use client";

import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { RunTelemetry } from "@/types/refract";
import {
  Cpu,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Zap,
} from "lucide-react";

interface WorkflowGraphProps {
  run: RunTelemetry;
  runs: RunTelemetry[];
  onSelectRun: (id: string) => void;
}

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ run, runs, onSelectRun }) => {
  // Construct the workflow steps data with exact time and price
  const vlmSec = Number((run.vlm_total_ms / 1000).toFixed(2));
  const vlmTtftSec = Number((run.vlm_ttft_ms / 1000).toFixed(2));

  const stepsData = [
    {
      stepNumber: 1,
      name: "1. VLM Analysis",
      fullName: "Gemma 4 VLM Character Bible",
      duration_sec: vlmSec,
      price_usd: 0.0,
      description: `Extracts ${run.exact_headcount} characters & outfits (TTFT: ${vlmTtftSec}s, ${run.tokens_per_sec} tok/s)`,
      type: "Vision-Language",
    },
    ...run.pages.map((p) => ({
      stepNumber: p.variant_index + 1,
      name: `Step ${p.variant_index + 1}: Page ${p.variant_index}`,
      fullName: `Page ${p.variant_index}: ${p.page_title}`,
      duration_sec: Number((p.total_render_ms / 1000).toFixed(2)),
      price_usd: Number(p.cost_usd.toFixed(6)),
      description: `${p.mode === "img2img_faithful" ? "Img2Img Pose Faithful" : "Txt2Img Story Adventure"} • KSampler ${(p.ksampler_ms / 1000).toFixed(1)}s`,
      type: "Diffusion",
    })),
  ];

  const totalTimeSec = run.total_e2e_sec;
  const totalPriceUsd = run.total_pack_cost_usd.toFixed(4);
  const avgPricePerPage = (run.total_pack_cost_usd / (run.pages.length || 4)).toFixed(4);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const step = stepsData.find((s) => s.name === label);
      return (
        <div className="bg-slate-950/95 border border-white/20 text-white text-xs p-3.5 rounded-xl shadow-2xl backdrop-blur-md space-y-1.5 font-mono">
          <p className="font-bold text-studio-accent">{step?.fullName || label}</p>
          <p className="text-[11px] text-slate-300 font-sans">{step?.description}</p>
          <div className="pt-1 border-t border-white/10 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Duration:</span>
              <strong className="text-amber-400">{payload[0]?.value}s</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">T4 Compute Price:</span>
              <strong className="text-emerald-400">${payload[1]?.value?.toFixed(5)}</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Run Selector & Top Summary Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-studio-accent">
            AI Inference Pipeline
          </span>
          <h2 className="text-xl font-black text-white">Workflow Steps: Time &amp; Price</h2>
        </div>

        {/* Run Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400">Active Workflow:</label>
          <select
            value={run.run_id}
            onChange={(e) => onSelectRun(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/15 text-xs font-mono font-semibold text-white shadow-xs focus:border-studio-accent focus:outline-hidden cursor-pointer"
          >
            {runs.map((r, i) => (
              <option key={r.run_id} value={r.run_id}>
                {r.run_id.startsWith("bench") ? "⭐ Pack " : `Run #${runs.length - i} `}
                ({r.run_id.slice(0, 16)}) • {r.pages.length} Pages • {r.vacation_setting?.slice(0, 16)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 High-Impact KPI Badges: Total Time, Total Price, Price per Page */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Time */}
        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4 border-t-2 border-t-amber-400">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Pipeline Time</span>
            <span className="text-2xl font-black font-mono text-white">{totalTimeSec}s</span>
          </div>
        </div>

        {/* Total Compute Price */}
        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4 border-t-2 border-t-emerald-400">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Pack Price</span>
            <span className="text-2xl font-black font-mono text-emerald-400">${totalPriceUsd}</span>
          </div>
        </div>

        {/* Price per Page */}
        <div className="p-5 rounded-2xl glass-panel flex items-center gap-4 border-t-2 border-t-studio-cyan">
          <div className="w-12 h-12 rounded-xl bg-studio-cyan/20 text-studio-cyan flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Price / Coloring Page</span>
            <span className="text-2xl font-black font-mono text-white">${avgPricePerPage}</span>
          </div>
        </div>
      </div>

      {/* Visual Workflow Steps Pipeline Graph (Node Flowchart) */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-studio-accent" />
          Step-by-Step AI Workflow Pipeline
        </h3>

        {/* Step Nodes Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Step 1: VLM */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2 py-0.5 rounded-full bg-studio-accent/20 text-studio-accent font-bold">
                Step 1
              </span>
              <span className="text-slate-400">Gemma 4</span>
            </div>
            <h4 className="font-bold text-white text-xs">VLM Analysis</h4>
            <div className="pt-2 border-t border-white/10 flex justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">{vlmSec}s</span>
              <span className="text-emerald-400 font-bold">$0.00</span>
            </div>
          </div>

          {/* Steps 2-5: Diffusion Pages */}
          {run.pages.map((p, idx) => (
            <div key={p.variant_index} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded-full bg-studio-cyan/20 text-studio-cyan font-bold">
                  Step {idx + 2}
                </span>
                <span className="text-slate-400">Modal T4</span>
              </div>
              <h4 className="font-bold text-white text-xs truncate" title={p.page_title}>
                P{p.variant_index}: {p.page_title}
              </h4>
              <div className="pt-2 border-t border-white/10 flex justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">
                  {(p.total_render_ms / 1000).toFixed(1)}s
                </span>
                <span className="text-emerald-400 font-bold">${p.cost_usd.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Graph: Workflow Steps Time & Price */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">AI Workflow Graph: Time (sec) vs. Price ($ USD)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bar plots active duration in seconds; line plots exact Modal compute price ($ USD) across each step.
            </p>
          </div>
          <div className="text-xs font-mono text-emerald-400 font-bold">
            Modal T4 Rate: $0.000164 / sec
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={stepsData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="timeBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#C2410C" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#E2E8F0", fontWeight: 600 }} />
              <YAxis
                yAxisId="left"
                unit="s"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                label={{ value: "Time (seconds)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94A3B8" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                unit="$"
                tick={{ fontSize: 11, fill: "#34D399" }}
                label={{ value: "Price ($ USD)", angle: 90, position: "insideRight", fontSize: 11, fill: "#34D399" }}
              />
              <Tooltip content={customTooltip} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar
                yAxisId="left"
                dataKey="duration_sec"
                name="Duration (seconds)"
                fill="url(#timeBarGradient)"
                radius={[6, 6, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="price_usd"
                name="Price ($ USD)"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10B981", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
