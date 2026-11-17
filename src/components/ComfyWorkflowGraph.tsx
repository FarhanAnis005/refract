"use client";

import React, { useState, useRef, useEffect } from "react";
import { RunTelemetry } from "@/types/refract";
import {
  Cpu,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  Zap,
  Maximize2,
  Minimize2,
  Terminal,
  Printer,
  Package,
  Activity,
  Sliders,
  Play,
  RotateCcw,
  Info,
  Check,
  Hash,
} from "lucide-react";

interface ComfyWorkflowGraphProps {
  run: RunTelemetry;
  runs: RunTelemetry[];
  onSelectRun: (id: string) => void;
}

export const ComfyWorkflowGraph: React.FC<ComfyWorkflowGraphProps> = ({
  run,
  runs,
  onSelectRun,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node_vlm");
  const [isSimulatingRun, setIsSimulatingRun] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(5); // 0 to 5 (5 = all complete)

  const vlmTtftSec = Number((run.vlm_ttft_ms / 1000).toFixed(2));
  const vlmTotalSec = Number((run.vlm_total_ms / 1000).toFixed(2));
  const totalTokens = (run.prompt_tokens || 705) + (run.output_tokens || 811);
  const totalKsamplerSec = Number(
    (run.pages.reduce((acc, p) => acc + p.ksampler_ms, 0) / 1000).toFixed(2)
  );
  const totalVaeSec = Number(
    (run.pages.reduce((acc, p) => acc + p.vae_decode_ms, 0) / 1000).toFixed(2)
  );
  const totalCostUsd = run.total_pack_cost_usd.toFixed(4);

  // ComfyUI Nodes definition
  const nodes = [
    {
      id: "node_input",
      title: "Load Image & Container Pre-Warm",
      category: "Input",
      headerColor: "from-blue-600 to-indigo-700",
      pillColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      inPorts: [],
      outPorts: [
        { name: "IMAGE", type: "image", color: "#38BDF8" },
        { name: "CONTAINER", type: "system", color: "#818CF8" },
      ],
      time: "1.20s",
      tokens: "—",
      cost: "$0.00020",
      status: "Cached / Ready",
      details: {
        device: "NVIDIA T4 (16GB GDDR6)",
        resolution: run.pages[0]?.resolution || "368 × 544",
        inputUrl: run.input_preview_url,
        action: "Non-blocking intent pre-warm during photo upload",
      },
    },
    {
      id: "node_vlm",
      title: "Gemma 4 VLM Character Bible",
      category: "Vision-Language",
      headerColor: "from-purple-600 to-pink-700",
      pillColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      inPorts: [{ name: "IMAGE", type: "image", color: "#38BDF8" }],
      outPorts: [
        { name: "CHARACTER_BIBLE", type: "tokens", color: "#C084FC" },
        { name: "CONDITIONING", type: "prompt", color: "#FB923C" },
      ],
      time: `${vlmTotalSec}s (TTFT: ${vlmTtftSec}s)`,
      tokens: `${totalTokens} tokens (${run.prompt_tokens} in / ${run.output_tokens} out @ ${run.tokens_per_sec} tok/s)`,
      cost: "$0.00000",
      status: "Executed (41.9 tok/s)",
      details: {
        model: run.active_vlm_model,
        headcount: `${run.exact_headcount} Persons Identified`,
        characterBibleSnippet: run.character_bible,
        action: "Extracts left-to-right character geometry & outfit tokens",
      },
    },
    {
      id: "node_ksampler",
      title: "KSampler 4-Step Diffusion",
      category: "Sampling",
      headerColor: "from-amber-600 to-orange-700",
      pillColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      inPorts: [
        { name: "CONDITIONING", type: "prompt", color: "#FB923C" },
        { name: "CONTAINER", type: "system", color: "#818CF8" },
      ],
      outPorts: [{ name: "LATENT", type: "latent", color: "#F59E0B" }],
      time: `${totalKsamplerSec}s (avg ${(totalKsamplerSec / 4).toFixed(1)}s/page)`,
      tokens: "512 latent tokens",
      cost: `$${(Number(totalCostUsd) * 0.94).toFixed(5)}`,
      status: "4 Pages Rendered",
      details: {
        steps: "4 Steps (SDXL Turbo / Lightning)",
        sampler: "Euler Ancestral (CFG 2.0)",
        seeds: run.pages.map((p) => p.seed || "Auto").join(", "),
        action: "Synthesizes 4 sequential high-contrast coloring scenes",
      },
    },
    {
      id: "node_vae",
      title: "VAE Decode (FP16 Latent)",
      category: "Latent",
      headerColor: "from-cyan-600 to-teal-700",
      pillColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      inPorts: [{ name: "LATENT", type: "latent", color: "#F59E0B" }],
      outPorts: [{ name: "IMAGE_RGB", type: "image", color: "#2DD4BF" }],
      time: `${totalVaeSec}s (~${(totalVaeSec / 4).toFixed(2)}s/page)`,
      tokens: "—",
      cost: `$${(Number(totalCostUsd) * 0.06).toFixed(5)}`,
      status: "Decoded to RGB",
      details: {
        precision: "FP16 Tensor Decode",
        palette: "Pure #000000 on #FFFFFF",
        resolution: run.pages[0]?.resolution || "368 × 544",
        action: "Decompresses latent grid into high-contrast vector lines",
      },
    },
    {
      id: "node_output",
      title: "Coloring Pack Output & ZIP",
      category: "Output",
      headerColor: "from-emerald-600 to-green-700",
      pillColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      inPorts: [{ name: "IMAGE_RGB", type: "image", color: "#2DD4BF" }],
      outPorts: [
        { name: "ZIP_PACK", type: "file", color: "#34D399" },
        { name: "PRINT_FEED", type: "printer", color: "#A7F3D0" },
      ],
      time: `${run.total_e2e_sec}s E2E`,
      tokens: "4 Vector Pages",
      cost: `$${totalCostUsd} Pack Cost`,
      status: "Ready for Print",
      details: {
        pages: run.pages.map((p) => `#${p.variant_index} ${p.page_title}`).join(" • "),
        format: "SVG & PNG Print-Ready Standard",
        unitEconomics: `${run.packs_per_dollar} complete packs per $1.00 USD`,
      },
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1];

  const handleSimulateExecution = () => {
    setIsSimulatingRun(true);
    setActiveStageIndex(0);

    const stages = [0, 1, 2, 3, 4, 5];
    stages.forEach((stage, i) => {
      setTimeout(() => {
        setActiveStageIndex(stage);
        if (stage === 5) {
          setIsSimulatingRun(false);
        }
      }, (i + 1) * 700);
    });
  };

  return (
    <div className="space-y-6">
      {/* ComfyUI Top Control Bar */}
      <div className="p-4 rounded-3xl glass-panel-elevated flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-2xl">
        {/* Left: Pack Switcher & Execution Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
            <span className="text-white font-bold">ComfyUI Graph Mode</span>
          </div>

          <select
            value={run.run_id}
            onChange={(e) => onSelectRun(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-white/15 text-xs font-mono font-semibold text-white shadow-xs focus:border-studio-accent focus:outline-hidden cursor-pointer"
          >
            {runs.map((r, i) => (
              <option key={r.run_id} value={r.run_id}>
                {r.run_id.startsWith("bench") ? "⭐ Pack " : `Run #${runs.length - i} `}
                ({r.run_id.slice(0, 16)}) • {r.pages.length} Pages • {r.vacation_setting?.slice(0, 16)}
              </option>
            ))}
          </select>
        </div>

        {/* Center: Real-Time Stats (Time, Tokens, Cost) */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Time: <strong>{run.total_e2e_sec}s</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Tokens: <strong>{totalTokens}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cost: <strong>${totalCostUsd}</strong></span>
          </div>
        </div>

        {/* Right: Simulate Step Execution Flow */}
        <button
          onClick={handleSimulateExecution}
          disabled={isSimulatingRun}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white text-xs font-bold shadow-glow transition-all cursor-pointer"
        >
          <Play className={`w-3.5 h-3.5 fill-white ${isSimulatingRun ? "animate-spin" : ""}`} />
          <span>{isSimulatingRun ? "Executing Graph..." : "Simulate Signal Flow"}</span>
        </button>
      </div>

      {/* ComfyUI Interactive Node Graph Canvas */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0B0F19] border border-white/15 overflow-hidden shadow-2xl min-h-[540px]">
        {/* ComfyUI Dot Grid Texture Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: "radial-gradient(#64748B 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Glowing Cable Lines in Background between Nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="cableGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#C084FC" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="cableGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB923C" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="cableGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="cableGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          {/* Cable 1: Input -> VLM */}
          <path
            d="M 230 180 C 260 180, 260 220, 290 220"
            fill="none"
            stroke="url(#cableGradient1)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />

          {/* Cable 2: VLM -> KSampler */}
          <path
            d="M 520 220 C 550 220, 550 200, 580 200"
            fill="none"
            stroke="url(#cableGradient2)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />

          {/* Cable 3: KSampler -> VAE */}
          <path
            d="M 810 200 C 840 200, 840 240, 870 240"
            fill="none"
            stroke="url(#cableGradient3)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />

          {/* Cable 4: VAE -> Output */}
          <path
            d="M 1100 240 C 1130 240, 1130 210, 1160 210"
            fill="none"
            stroke="url(#cableGradient4)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />
        </svg>

        {/* ComfyUI Nodes Grid Layout */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const isNodeActive = index <= activeStageIndex;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? "ring-2 ring-studio-accent shadow-glow scale-[1.02] border-studio-accent bg-slate-900/95"
                    : isNodeActive
                    ? "border-white/20 bg-slate-900/85 hover:border-white/40 hover:bg-slate-900/95"
                    : "border-white/10 bg-slate-950/70 opacity-60"
                }`}
              >
                {/* ComfyUI Node Header Bar */}
                <div
                  className={`px-3.5 py-2 bg-gradient-to-r ${node.headerColor} flex items-center justify-between text-white text-xs font-bold shadow-md`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="truncate">{node.title}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80 shrink-0">#{index + 1}</span>
                </div>

                {/* Node Body with Input/Output Sockets */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 text-xs font-mono">
                  {/* Socket Pins Area */}
                  <div className="space-y-1.5 pb-2 border-b border-white/10 text-[10px]">
                    {/* Input sockets on left */}
                    {node.inPorts.map((port) => (
                      <div key={port.name} className="flex items-center gap-1.5 text-slate-300">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: port.color }}
                        />
                        <span className="truncate font-semibold">&bull; IN: {port.name}</span>
                      </div>
                    ))}

                    {/* Output sockets on right */}
                    {node.outPorts.map((port) => (
                      <div key={port.name} className="flex items-center justify-end gap-1.5 text-slate-300 text-right">
                        <span className="truncate font-semibold">&bull; OUT: {port.name}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: port.color }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Node Metrics: Time, Tokens, Cost */}
                  <div className="space-y-2 text-[11px]">
                    {/* Time */}
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>TIME</span>
                        </span>
                      </div>
                      <span className="font-bold text-amber-300 truncate block">{node.time}</span>
                    </div>

                    {/* Tokens */}
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-purple-400" />
                          <span>TOKENS</span>
                        </span>
                      </div>
                      <span className="font-bold text-purple-300 truncate block">{node.tokens}</span>
                    </div>

                    {/* Cost */}
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-400" />
                          <span>COST</span>
                        </span>
                      </div>
                      <span className="font-bold text-emerald-400 truncate block">{node.cost}</span>
                    </div>
                  </div>

                  {/* Status Footer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">{node.category}</span>
                    <span className="text-white font-bold">{node.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected ComfyUI Node Inspector Panel */}
      {selectedNode && (
        <div className="p-6 rounded-3xl glass-panel-elevated space-y-4 border border-white/15 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${selectedNode.headerColor} shadow-glow`}
              />
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{selectedNode.title}</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  [{selectedNode.category} Node]
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                Time: {selectedNode.time}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                Tokens: {selectedNode.tokens}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                Cost: {selectedNode.cost}
              </span>
            </div>
          </div>

          {/* Node Parameter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Left Parameters */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Node Properties &amp; Parameters
              </h4>
              <div className="space-y-1.5 text-slate-300">
                {Object.entries(selectedNode.details).map(([key, value]) => {
                  if (key === "characterBibleSnippet") return null;
                  return (
                    <div key={key} className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <strong className="text-white text-right max-w-[280px] truncate">{value}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Character Bible or Output Preview */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Node Output Stream</span>
                <span className="text-studio-accent font-mono text-[10px]">Verified Output</span>
              </h4>

              {selectedNode.id === "node_input" ? (
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={run.input_preview_url}
                    alt="Loaded Input Photo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : selectedNode.id === "node_vlm" ? (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-[11px] text-slate-200 whitespace-pre-line leading-relaxed max-h-44 overflow-y-auto">
                  {run.character_bible}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {run.pages.map((p) => (
                    <div
                      key={p.variant_index}
                      className="rounded-lg overflow-hidden border border-white/10 bg-white aspect-[3/4] flex items-center justify-center p-0.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image_data_url}
                        alt={p.page_title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
