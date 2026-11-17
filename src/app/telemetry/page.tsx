"use client";

import React from "react";
import Link from "next/link";
import { useRefract } from "@/context/RefractContext";
import { WorkflowGraph } from "@/components/WorkflowGraph";
import { Palette, Activity, ArrowLeft } from "lucide-react";

export default function TelemetryPage() {
  const { runs, selectedTelemetryRun, setSelectedRunId } = useRefract();

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5" />
            AI Workflow Metrics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
            Pipeline Steps: Time &amp; Price
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/studio"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white text-xs font-bold shadow-glow transition-all"
          >
            <Palette className="w-4 h-4" />
            <span>Open Studio</span>
          </Link>
        </div>
      </div>

      {/* Clean AI Workflow Graph (Step nodes + Time vs Price Chart) */}
      {selectedTelemetryRun ? (
        <WorkflowGraph
          run={selectedTelemetryRun}
          runs={runs}
          onSelectRun={(id) => setSelectedRunId(id)}
        />
      ) : (
        <div className="p-12 text-center glass-panel rounded-3xl text-slate-400">
          <p>No active workflow run found. Generate a coloring pack in the Studio first.</p>
        </div>
      )}
    </div>
  );
}
