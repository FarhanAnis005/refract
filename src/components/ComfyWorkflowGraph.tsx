"use client";

import React, { useState } from "react";
import { RunTelemetry } from "@/types/refract";
import {
  Sparkles,
  Clock,
  DollarSign,
  Terminal,
  Play,
  Layers,
  Printer,
  Package,
  Image as ImageIcon,
  CheckCircle2,
  FileCheck,
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
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node_diffusion");
  const [isSimulatingRun, setIsSimulatingRun] = useState<boolean>(false);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(4); // 0 to 4 (4 = all complete)

  const vlmTtftSec = Number((run.vlm_ttft_ms / 1000).toFixed(2));
  const vlmTotalSec = Number((run.vlm_total_ms / 1000).toFixed(2));
  const totalTokens = (run.prompt_tokens || 705) + (run.output_tokens || 811);
  const totalRenderSec = Number(
    (run.pages.reduce((acc, p) => acc + p.total_render_ms, 0) / 1000).toFixed(1)
  );
  const totalCostUsd = run.total_pack_cost_usd.toFixed(4);

  // 4 Broad, High-Level ComfyUI Nodes (Keeping the image part broad as requested)
  const nodes = [
    {
      id: "node_input",
      title: "Input Vacation Photo",
      category: "Input",
      headerColor: "from-blue-600 to-indigo-700",
      inPorts: [],
      outPorts: [{ name: "IMAGE", color: "#38BDF8" }],
      time: "1.20s",
      tokens: "—",
      cost: "$0.00020",
      status: "Photo Loaded & Pre-warmed",
      summary: `Original family snapshot (${run.pages[0]?.resolution || "368×544"}) with non-blocking container pre-warm`,
      details: {
        resolution: run.pages[0]?.resolution || "368 × 544",
        hardware: "NVIDIA T4 (16GB GDDR6)",
        headcountTarget: `${run.exact_headcount} Persons`,
        photoUrl: run.input_preview_url,
      },
    },
    {
      id: "node_vlm",
      title: "Gemma 4 VLM Vision Model",
      category: "Vision-Language",
      headerColor: "from-purple-600 to-pink-700",
      inPorts: [{ name: "IMAGE", color: "#38BDF8" }],
      outPorts: [{ name: "CONDITIONING", color: "#FB923C" }],
      time: `${vlmTotalSec}s (TTFT: ${vlmTtftSec}s)`,
      tokens: `${totalTokens} tokens @ ${run.tokens_per_sec} tok/s`,
      cost: "$0.00000",
      status: "Character Bible Extracted",
      summary: `Analyzed ${run.exact_headcount} family members: extracted left-to-right clothing, smiles, and scene tokens`,
      details: {
        model: run.active_vlm_model,
        headcount: `${run.exact_headcount} Persons Identified`,
        tokensPrompt: `${run.prompt_tokens} prompt tokens`,
        tokensOutput: `${run.output_tokens} output tokens`,
        throughput: `${run.tokens_per_sec} tokens/sec`,
        bibleSnippet: run.character_bible,
      },
    },
    {
      id: "node_diffusion",
      title: "Modal T4 Image Diffusion",
      category: "Image Generation",
      headerColor: "from-amber-600 to-orange-700",
      inPorts: [{ name: "CONDITIONING", color: "#FB923C" }],
      outPorts: [{ name: "4X_COLORING_PAGES", color: "#F59E0B" }],
      time: `${totalRenderSec}s (4 Pages Synthesized)`,
      tokens: "512 latent tokens",
      cost: `$${totalCostUsd}`,
      status: "4 Pages Rendered",
      summary: "Broad unified stage: synthesizes all 4 progressive coloring scenes (Faithful Keepsake + 3 Adventures)",
      details: {
        engine: "Modal NVIDIA T4 Serverless Diffusion",
        pagesCount: "4 Vector Coloring Pages",
        avgPerPageSec: `${(Number(totalRenderSec) / 4).toFixed(1)}s per page`,
        resolution: run.pages[0]?.resolution || "368 × 544",
        seeds: run.pages.map((p) => p.seed || "Auto").join(", "),
        pagesList: run.pages.map((p) => `#${p.variant_index} ${p.page_title}`).join(" • "),
      },
    },
    {
      id: "node_output",
      title: "4-Page Coloring Pack Output",
      category: "Export & Delivery",
      headerColor: "from-emerald-600 to-green-700",
      inPorts: [{ name: "4X_COLORING_PAGES", color: "#F59E0B" }],
      outPorts: [{ name: "PRINT_READY", color: "#34D399" }, { name: "ZIP_BUNDLE", color: "#A7F3D0" }],
      time: `${run.total_e2e_sec}s Total E2E`,
      tokens: "4 Vector Pages",
      cost: `$${totalCostUsd} Pack Total`,
      status: "Ready for Print & Download",
      summary: "Pure #000000 on #FFFFFF vector coloring artwork ready for browser print and complete .ZIP export",
      details: {
        totalCost: `$${totalCostUsd} USD`,
        packsPerDollar: `${run.packs_per_dollar} complete packs per $1.00 USD`,
        formats: "SVG, PNG, Print-Ready (A4 / US Letter)",
        delivery: "Direct One-Click ZIP Pack & Native Print",
      },
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  const handleSimulateExecution = () => {
    setIsSimulatingRun(true);
    setActiveStageIndex(0);

    const stages = [0, 1, 2, 3, 4];
    stages.forEach((stage, i) => {
      setTimeout(() => {
        setActiveStageIndex(stage);
        if (stage === 4) {
          setIsSimulatingRun(false);
        }
      }, (i + 1) * 650);
    });
  };

  return (
    <div className="space-y-6">
      {/* ComfyUI Top Control Bar */}
      <div className="p-4 rounded-3xl glass-panel-elevated flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-2xl">
        {/* Left: Pack Switcher */}
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

        {/* Center: High-Level Stats (Time, Tokens, Cost) */}
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
          <span>{isSimulatingRun ? "Simulating..." : "Simulate Flow"}</span>
        </button>
      </div>

      {/* ComfyUI Interactive Node Graph Canvas (4 Broad Nodes) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0B0F19] border border-white/15 overflow-hidden shadow-2xl min-h-[460px]">
        {/* Dot Grid Texture Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: "radial-gradient(#64748B 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Connecting Curved Bézier Cables between the 4 Nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
          style={{ zIndex: 0 }}
        >
          <defs>
            <linearGradient id="cable1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#FB923C" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="cable2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FB923C" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="cable3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#34D399" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          {/* Cable 1: Input -> VLM */}
          <path
            d="M 280 180 C 320 180, 340 180, 380 180"
            fill="none"
            stroke="url(#cable1)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />

          {/* Cable 2: VLM -> Diffusion */}
          <path
            d="M 640 180 C 680 180, 700 180, 740 180"
            fill="none"
            stroke="url(#cable2)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />

          {/* Cable 3: Diffusion -> Output */}
          <path
            d="M 1000 180 C 1040 180, 1060 180, 1100 180"
            fill="none"
            stroke="url(#cable3)"
            strokeWidth="3.5"
            strokeDasharray={isSimulatingRun ? "6 4" : "none"}
            className={isSimulatingRun ? "animate-pulse" : ""}
          />
        </svg>

        {/* 4 Broad Nodes Grid Layout */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {/* ComfyUI Colored Header */}
                <div
                  className={`px-3.5 py-2.5 bg-gradient-to-r ${node.headerColor} flex items-center justify-between text-white text-xs font-bold shadow-md`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="truncate">{node.title}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80 shrink-0">#{index + 1}</span>
                </div>

                {/* Node Sockets Area */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 text-xs font-mono">
                  {/* Socket Pins */}
                  <div className="space-y-1.5 pb-2 border-b border-white/10 text-[10px]">
                    {node.inPorts.map((port) => (
                      <div key={port.name} className="flex items-center gap-1.5 text-slate-300">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                          style={{ backgroundColor: port.color }}
                        />
                        <span className="truncate font-semibold">&bull; IN: {port.name}</span>
                      </div>
                    ))}

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

                  {/* High-Level Metrics: Time, Tokens, Cost */}
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
                    <span className="truncate font-sans">{node.category}</span>
                    <span className="text-white font-bold">{node.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
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

          <p className="text-xs text-slate-300 font-sans">{selectedNode.summary}</p>

          {/* Node Parameter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono pt-1">
            {/* Left Parameters */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Node Properties &amp; Parameters
              </h4>
              <div className="space-y-1.5 text-slate-300">
                {Object.entries(selectedNode.details).map(([key, value]) => {
                  if (key === "bibleSnippet" || key === "photoUrl") return null;
                  return (
                    <div key={key} className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                      <strong className="text-white text-right max-w-[280px] truncate">{value}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Preview (Input Photo, Character Bible, or 4 Coloring Pages) */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Output Data Preview</span>
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
