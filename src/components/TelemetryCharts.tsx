"use client";

import React from "react";
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
} from "lucide-react";

interface TelemetryChartsProps {
  run: RunTelemetry | null;
  runs: RunTelemetry[];
  onSelectRun: (runId: string) => void;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({ run, runs, onSelectRun }) => {
  if (!run) {
    return (
      <div className="p-12 text-center bg-paper-100 rounded-2xl border border-paper-300">
        <Cpu className="w-10 h-10 text-paper-800/40 mx-auto mb-3" />
        <h3 className="text-base font-bold text-paper-900">No Telemetry Available</h3>
        <p className="text-xs text-paper-800/70 mt-1">
          Generate a 4-page coloring pack in the Studio to view real-time latency and FinOps analytics.
        </p>
      </div>
    );
  }

  // Calculate Unit Economics
  const avgCostPerPage =
    run.pages.length > 0
      ? (run.total_pack_cost_usd / run.pages.length).toFixed(5)
      : (0.0015).toFixed(5);
  const totalPackCost = run.total_pack_cost_usd.toFixed(5);
  const packsPerDollar = run.packs_per_dollar || Math.round(1 / run.total_pack_cost_usd);

  // 1. Waterfall Pipeline Latency Data
  // Each pipeline stage plotted as horizontal stacked bar segments
  const waterfallData = [
    {
      stage: "Warmup Overlap",
      duration: run.warmup_overlap_sec || 1.2,
      type: "Infrastructure",
    },
    {
      stage: "VLM TTFT",
      duration: Number((run.vlm_ttft_ms / 1000).toFixed(2)),
      type: "Vision-Language",
    },
    {
      stage: "VLM Bible Stream",
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
        stage: `P${page.variant_index} VAE Decode`,
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
    cost_millicents: Number((p.cost_usd * 1000).toFixed(3)), // for readable visual scale
  }));

  // Tooltip custom formatter
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-paper-900 text-white text-xs p-3 rounded-lg shadow-xl border border-paper-800">
          <p className="font-bold text-studio-accent mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex justify-between gap-4 py-0.5">
              <span className="text-paper-200">{entry.name}:</span>
              <span className="font-mono font-bold">
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
      {/* Run Selector & Active Run Meta Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-paper-100 border border-paper-300">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-bold text-paper-900">Modal T4 + Gemma 4 FinOps Telemetry</h2>
          </div>
          <p className="text-xs text-paper-800/80 mt-1">
            Real-time inference latency waterfall, GPU compute accounting, and unit economics.
          </p>
        </div>

        {/* Multi-Run Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-paper-800">Selected Run:</label>
          <select
            value={run.run_id}
            onChange={(e) => onSelectRun(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-paper-300 text-xs font-mono font-semibold text-paper-900 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-studio-accent"
          >
            {runs.map((r, i) => (
              <option key={r.run_id} value={r.run_id}>
                {r.run_id.startsWith("bench") ? "⭐ [Benchmark] " : `Run #${runs.length - i} `}
                ({r.run_id.slice(0, 10)}) • {r.pages.length} Pages • {r.vacation_setting?.slice(0, 16)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards: Unit-Economics & Model Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Cost per Page */}
        <div className="p-4 rounded-xl bg-white border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between text-paper-800/80 mb-2">
            <span className="text-xs font-semibold">Cost per Page</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-paper-900">${avgCostPerPage}</div>
          <span className="text-[11px] text-emerald-700 font-medium">NVIDIA T4 ($0.000164/s)</span>
        </div>

        {/* Cost per 4-Page Pack */}
        <div className="p-4 rounded-xl bg-white border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between text-paper-800/80 mb-2">
            <span className="text-xs font-semibold">Cost per 4-Page Pack</span>
            <Flame className="w-4 h-4 text-studio-accent" />
          </div>
          <div className="text-2xl font-black font-mono text-paper-900">${totalPackCost}</div>
          <span className="text-[11px] text-paper-800/80 font-medium">Complete Kids&apos; Book</span>
        </div>

        {/* Packs per $1.00 */}
        <div className="p-4 rounded-xl bg-white border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between text-paper-800/80 mb-2">
            <span className="text-xs font-semibold">Packs per $1.00</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-paper-900">{packsPerDollar}</div>
          <span className="text-[11px] text-paper-800/80 font-medium">packs / dollar spend</span>
        </div>

        {/* Active VLM Model */}
        <div className="p-4 rounded-xl bg-white border border-paper-300 shadow-xs">
          <div className="flex items-center justify-between text-paper-800/80 mb-2">
            <span className="text-xs font-semibold">Active VLM Model</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-sm font-bold font-mono text-paper-900 truncate" title={run.active_vlm_model}>
            {run.active_vlm_model}
          </div>
          <span className="text-[11px] text-paper-800/80 font-medium">Character Bible Spec</span>
        </div>

        {/* Token Throughput */}
        <div className="p-4 rounded-xl bg-white border border-paper-300 shadow-xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-paper-800/80 mb-2">
            <span className="text-xs font-semibold">VLM Throughput</span>
            <Timer className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-paper-900">{run.tokens_per_sec}</div>
          <span className="text-[11px] text-paper-800/80 font-medium">tokens / sec (TTFT: {(run.vlm_ttft_ms / 1000).toFixed(2)}s)</span>
        </div>
      </div>

      {/* Chart 1: Pipeline Latency Waterfall */}
      <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-paper-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-studio-accent" />
              Pipeline Latency Waterfall (Stage by Stage)
            </h3>
            <p className="text-xs text-paper-800/70 mt-0.5">
              Breakdown of Warmup Overlap, Gemma 4 VLM Analysis, and per-page KSampler vs. VAE Decode.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold bg-paper-100 px-3 py-1.5 rounded-lg text-paper-900">
            Total E2E: {run.total_e2e_sec}s
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={waterfallData}
              margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBE5DB" />
              <XAxis
                type="number"
                unit="s"
                tick={{ fontSize: 11, fill: "#64748B" }}
                domain={[0, "dataMax + 1"]}
              />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fontSize: 11, fill: "#2B2825", fontWeight: 600 }}
                width={110}
              />
              <Tooltip content={renderCustomTooltip} />
              <Bar dataKey="duration" name="Duration (sec)" fill="#F97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Per-Page Time & Modal T4 Cost (Composed Bar + Line Chart) */}
      <div className="p-6 rounded-2xl bg-white border border-paper-300 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-paper-200 pb-4">
          <div>
            <h3 className="text-base font-bold text-paper-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Per-Page Time &amp; Modal T4 Compute Cost
            </h3>
            <p className="text-xs text-paper-800/70 mt-0.5">
              Plots KSampler + VAE render duration (sec) on primary axis with exact GPU cost ($) on secondary line.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            Modal T4 Rate: $0.000164 / sec
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={perPageData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBE5DB" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#2B2825", fontWeight: 600 }} />
              <YAxis
                yAxisId="left"
                unit="s"
                tick={{ fontSize: 11, fill: "#64748B" }}
                domain={[0, 12]}
                label={{ value: "Render Duration (s)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#64748B" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                unit="$"
                tick={{ fontSize: 11, fill: "#15803D" }}
                domain={[0, 0.0025]}
                label={{ value: "Compute Cost ($ USD)", angle: 90, position: "insideRight", fontSize: 11, fill: "#15803D" }}
              />
              <Tooltip content={renderCustomTooltip} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar
                yAxisId="left"
                dataKey="ksampler_sec"
                name="KSampler Duration (s)"
                stackId="render"
                fill="#0F172A"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="vae_sec"
                name="VAE Decode Duration (s)"
                stackId="render"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cost_usd"
                name="Modal T4 Cost ($ USD)"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5, fill: "#10B981" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured Run Log & Character Bible Inspection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gemma 4 Character Bible */}
        <div className="p-5 rounded-2xl bg-white border border-paper-300 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-paper-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-studio-accent" />
              Gemma 4 VLM Character Bible Spec
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-paper-100 text-paper-800 font-semibold">
              Headcount: {run.exact_headcount}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-paper-50 border border-paper-200 text-xs font-mono text-paper-900 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
            {run.character_bible}
          </div>
          <div className="text-[11px] text-paper-800/70">
            Vacation Setting: <strong className="text-paper-900">{run.vacation_setting}</strong>
          </div>
        </div>

        {/* Generation Run Logs Table */}
        <div className="p-5 rounded-2xl bg-white border border-paper-300 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-paper-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Stage Breakdown &amp; Tokens
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-paper-100 text-paper-800/80">
                <tr>
                  <th className="py-2 px-3 rounded-l">Metric</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3 rounded-r">Cost/Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-200 text-paper-900">
                <tr>
                  <td className="py-2 px-3 text-paper-800 font-sans">Active VLM</td>
                  <td className="py-2 px-3 font-bold">{run.active_vlm_model}</td>
                  <td className="py-2 px-3 text-emerald-700">Gemma 4 IT</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-paper-800 font-sans">Prompt / Output Tok</td>
                  <td className="py-2 px-3 font-bold">
                    {run.prompt_tokens} / {run.output_tokens}
                  </td>
                  <td className="py-2 px-3 text-purple-700">{run.tokens_per_sec} tok/s</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-paper-800 font-sans">VLM TTFT</td>
                  <td className="py-2 px-3 font-bold">{(run.vlm_ttft_ms / 1000).toFixed(2)}s</td>
                  <td className="py-2 px-3 text-paper-800/70">Initial token delay</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-paper-800 font-sans">Total 4-Page Pack Cost</td>
                  <td className="py-2 px-3 font-bold text-emerald-700">${run.total_pack_cost_usd.toFixed(5)}</td>
                  <td className="py-2 px-3 text-paper-800/70">{run.packs_per_dollar} packs / $1</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-paper-800 font-sans">Timestamp</td>
                  <td className="py-2 px-3" colSpan={2}>
                    {new Date(run.timestamp).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
