"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart,
  Line,
} from "recharts";
import { RunTelemetry } from "@/types/refract";
import {
  Cpu,
  DollarSign,
  Zap,
  Timer,
  Layers,
  Sparkles,
  BarChart3,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Code2,
} from "lucide-react";

interface TelemetryChartsProps {
  run: RunTelemetry | null;
  runs: RunTelemetry[];
  onSelectRun: (runId: string) => void;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ run, runs, onSelectRun }) => {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  if (!run) {
    return (
      <div className="p-12 text-center glass-panel rounded-3xl">
        <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">No Telemetry Available</h3>
        <p className="text-xs text-slate-400 mt-1">
          Generate a 4-page coloring pack in the Studio to view real-time latency and FinOps analytics.
        </p>
      </div>
    );
  }

  // Calculate Unit Economics
  const avgCostPerPage =
    run.pages.length > 0
      ? (run.total_pack_cost_usd / run.pages.length).toFixed(4)
      : (0.012).toFixed(4);
  const totalPackCost = run.total_pack_cost_usd.toFixed(4);
  const packsPerDollar = run.packs_per_dollar || Math.round(1 / run.total_pack_cost_usd);

  // 1. Waterfall Pipeline Latency Data
  const waterfallData = [
    {
      stage: "Warmup",
      duration: run.warmup_overlap_sec || 1.2,
      type: "Infrastructure",
    },
    {
      stage: "VLM TTFT",
      duration: Number((run.vlm_ttft_ms / 1000).toFixed(2)),
      type: "Vision-Language",
    },
    {
      stage: "VLM Bible",
      duration: Number(((run.vlm_total_ms - run.vlm_ttft_ms) / 1000).toFixed(2)),
      type: "Vision-Language",
    },
    ...run.pages.flatMap((page) => [
      {
        stage: `P${page.variant_index} KSampler`,
        duration: Number((page.ksampler_ms / 1000).toFixed(2)),
        type: "Diffusion",
      },
      {
        stage: `P${page.variant_index} VAE`,
        duration: Number((page.vae_decode_ms / 1000).toFixed(2)),
        type: "Decode",
      },
    ]),
  ];

  // 2. Per-Page Time & Modal T4 Cost Data (Composed Chart)
  const perPageData = run.pages.map((p) => ({
    name: `Page ${p.variant_index}`,
    title: p.page_title,
    ksampler_sec: Number((p.ksampler_ms / 1000).toFixed(2)),
    vae_sec: Number((p.vae_decode_ms / 1000).toFixed(2)),
    total_sec: Number((p.total_render_ms / 1000).toFixed(2)),
    cost_usd: Number(p.cost_usd.toFixed(6)),
  }));

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(run, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-white/20 text-white text-xs p-3.5 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-bold text-studio-accent mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex justify-between gap-6 py-0.5 font-mono">
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.value}
                {entry.unit || ""}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header & Multi-Run Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Modal NVIDIA T4 &amp; Gemma 4 Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time serverless inference profiling, token throughput, and exact GPU billing accounting.
          </p>
        </div>

        {/* Multi-Run Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-300">Selected Run:</label>
          <select
            value={run.run_id}
            onChange={(e) => onSelectRun(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-950/90 border border-white/15 text-xs font-mono font-semibold text-white shadow-xs focus:border-studio-accent focus:outline-hidden cursor-pointer"
          >
            {runs.map((r, i) => (
              <option key={r.run_id} value={r.run_id}>
                {r.run_id.startsWith("bench") ? "⭐ [Production Pack] " : `Run #${runs.length - i} `}
                ({r.run_id.slice(0, 16)}) • {r.pages.length} Pages • {r.vacation_setting?.slice(0, 18)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards: Unit Economics & Hardware Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Cost per Page */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 border-t-2 border-t-emerald-400">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cost / Page</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white text-glow-emerald">
            ${avgCostPerPage}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono block">
            Modal T4 @ $0.000164/s
          </span>
        </div>

        {/* Cost per 4-Page Pack */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 border-t-2 border-t-studio-accent">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cost / 4-Pack</span>
            <Flame className="w-4 h-4 text-studio-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white text-glow-accent">
            ${totalPackCost}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Complete Coloring Book
          </span>
        </div>

        {/* Packs per $1.00 */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 border-t-2 border-t-amber-400">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Packs / $1.00</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {packsPerDollar}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            packs generated per $1
          </span>
        </div>

        {/* Active VLM Model */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 border-t-2 border-t-studio-cyan">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active VLM</span>
            <Sparkles className="w-4 h-4 text-studio-cyan" />
          </div>
          <div className="text-sm font-bold font-mono text-white truncate" title={run.active_vlm_model}>
            {run.active_vlm_model}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            Character Bible Spec
          </span>
        </div>

        {/* Token Throughput */}
        <div className="p-5 rounded-3xl glass-panel space-y-2 col-span-2 md:col-span-1 border-t-2 border-t-purple-400">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">VLM Speed</span>
            <Timer className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {run.tokens_per_sec}
          </div>
          <span className="text-[11px] text-slate-400 font-medium block">
            tok/s (TTFT: {(run.vlm_ttft_ms / 1000).toFixed(2)}s)
          </span>
        </div>
      </div>

      {/* Chart 1: Pipeline Latency Waterfall */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-studio-accent" />
              Pipeline Latency Waterfall (Stage by Stage)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown of Warmup Overlap, Gemma 4 VLM Analysis, and per-page KSampler vs. VAE Decode.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-white">
            Total E2E: {run.total_e2e_sec}s
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={waterfallData}
              margin={{ top: 10, right: 30, left: 110, bottom: 10 }}
            >
              <defs>
                <linearGradient id="waterfallGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#FB923C" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis
                type="number"
                unit="s"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                domain={[0, "dataMax + 2"]}
              />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fontSize: 11, fill: "#E2E8F0", fontWeight: 600 }}
                width={120}
              />
              <Tooltip content={renderCustomTooltip} />
              <Bar dataKey="duration" name="Duration (sec)" fill="url(#waterfallGradient)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Per-Page Time & Modal T4 Cost (Composed Bar + Line Chart) */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Per-Page Time &amp; Modal T4 Compute Cost
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Plots KSampler + VAE render duration (sec) on primary axis with exact GPU compute cost ($) on secondary axis.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 font-mono">
            T4 Billing: $0.000164 / sec
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={perPageData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="ksamplerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="vaeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#D97706" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#E2E8F0", fontWeight: 600 }} />
              <YAxis
                yAxisId="left"
                unit="s"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                label={{ value: "Render Duration (s)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94A3B8" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                unit="$"
                tick={{ fontSize: 11, fill: "#34D399" }}
                label={{ value: "Cost ($ USD)", angle: 90, position: "insideRight", fontSize: 11, fill: "#34D399" }}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar
                yAxisId="left"
                dataKey="ksampler_sec"
                name="KSampler Duration (s)"
                stackId="render"
                fill="url(#ksamplerGradient)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="vae_sec"
                name="VAE Decode (s)"
                stackId="render"
                fill="url(#vaeGradient)"
                radius={[6, 6, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cost_usd"
                name="Modal T4 Cost ($ USD)"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10B981", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gemma 4 Character Bible & Production Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Character Bible Spec */}
        <div className="p-6 rounded-3xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-studio-accent" />
              Gemma 4 VLM Character Bible Spec
            </h4>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white font-semibold">
              Headcount: {run.exact_headcount}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
            {run.character_bible}
          </div>
          <div className="text-[11px] text-slate-400">
            Vacation Setting: <strong className="text-white">{run.vacation_setting}</strong>
          </div>
        </div>

        {/* Raw Telemetry JSON Inspector */}
        <div className="p-6 rounded-3xl glass-panel space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-studio-cyan" />
              Raw Production Telemetry JSON
            </h4>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-[11px] font-mono text-emerald-400 max-h-60 overflow-y-auto">
            <pre>{JSON.stringify(run, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
