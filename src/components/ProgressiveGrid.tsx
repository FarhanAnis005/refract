"use client";

import React, { useState } from "react";
import JSZip from "jszip";
import {
  Download,
  Printer,
  ZoomIn,
  CheckCircle2,
  Sparkles,
  Loader2,
  Package,
  Layers,
  FileCheck,
  X,
  Palette,
  Eye,
  Hash,
} from "lucide-react";
import { PageResult } from "@/types/refract";

interface ProgressiveGridProps {
  pages: PageResult[];
  activeVariantIndex: 1 | 2 | 3 | 4 | null;
  isStreaming: boolean;
  onDownloadZip?: () => void;
}

const SLOT_DEFINITIONS = [
  {
    index: 1,
    title: "Faithful Keepsake Portrait",
    mode: "img2img_faithful" as const,
    badge: "Keepsake #1",
    description: "Faithful family portrait matching real faces, smiles, and vacation outfit styling.",
    estimatedSec: "~8.9s",
  },
  {
    index: 2,
    title: "Sandcastle Architects",
    mode: "txt2img_adventure" as const,
    badge: "Adventure #2",
    description: "Kids constructing an epic multi-tower sandcastle with shovel and friendly crab.",
    estimatedSec: "~9.2s",
  },
  {
    index: 3,
    title: "Ocean Friends Playtime",
    mode: "txt2img_adventure" as const,
    badge: "Adventure #3",
    description: "Snorkeling underwater fantasy with sea turtles, leaping dolphin, and coral reef.",
    estimatedSec: "~9.1s",
  },
  {
    index: 4,
    title: "Beach Day Souvenir",
    mode: "txt2img_adventure" as const,
    badge: "Souvenir #4",
    description: "Cozy sunset campfire marshmallow roast with palm trees and souvenir ribbon.",
    estimatedSec: "~9.0s",
  },
];

export const ProgressiveGrid: React.FC<ProgressiveGridProps> = ({
  pages,
  activeVariantIndex,
  isStreaming,
}) => {
  const [zoomPage, setZoomPage] = useState<PageResult | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const [crayonMode, setCrayonMode] = useState<boolean>(false);

  // Helper to trigger individual print
  const handlePrint = (page: PageResult) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${page.page_title} - Refract Coloring Page</title>
          <style>
            @page { size: portrait; margin: 0.5in; }
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: #FFF; }
            img { max-width: 100%; height: auto; max-height: 96vh; }
          </style>
        </head>
        <body>
          <img src="${page.image_data_url}" alt="${page.page_title}" onload="window.print();window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Helper to download individual image file (PNG or SVG)
  const handleDownloadSingle = async (page: PageResult) => {
    const isPng = page.image_data_url.endsWith(".png") || page.image_data_url.startsWith("data:image/png");
    const link = document.createElement("a");
    link.href = page.image_data_url;
    link.download = `refract-page-${page.variant_index}-${page.page_title.toLowerCase().replace(/\s+/g, "-")}.${isPng ? "png" : "svg"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to package and download full ZIP
  const handleDownloadZipPack = async () => {
    if (pages.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder("refract-family-coloring-book");

      // Readme metadata
      const readme = `================================================
REFRACT KIDS' COLORING BOOK STUDIO
Printable 4-Page Family Keepsake Pack
================================================
Generated: ${new Date().toLocaleString()}
Resolution: Crisp High-Contrast Pure #000000 Ink on #FFFFFF Background
Hardware: Modal NVIDIA T4 Compute Engine ($0.000164/sec)

PAGES IN THIS PACK:
${pages
  .map(
    (p) => `
- Page ${p.variant_index}: ${p.page_title}
  Mode: ${p.mode}
  Seed: ${p.seed || "Auto"}
  Render Time: ${(p.total_render_ms / 1000).toFixed(2)}s (KSampler: ${(p.ksampler_ms / 1000).toFixed(2)}s, VAE: ${(p.vae_decode_ms / 1000).toFixed(2)}s)
  Modal T4 Cost: $${p.cost_usd.toFixed(6)}
  Prompt: ${p.prompt_used}
`
  )
  .join("")}

INSTRUCTIONS FOR PRINTING:
1. Open any image file in your browser or preview application.
2. Select File -> Print.
3. Set Paper Size to US Letter or A4, Margins to 'None' or 'Minimum'.
4. Hand out crayons, markers, or colored pencils and enjoy!
`;
      folder?.file("README_COLORING_PACK.txt", readme);

      // Fetch each image file and add to ZIP
      for (const p of pages) {
        const isDataUrl = p.image_data_url.startsWith("data:");
        const isPng = p.image_data_url.endsWith(".png") || p.image_data_url.startsWith("data:image/png");
        const ext = isPng ? "png" : "svg";
        const fileName = `page-${p.variant_index}-${p.page_title.toLowerCase().replace(/\s+/g, "-")}.${ext}`;

        if (isDataUrl) {
          const base64Data = p.image_data_url.split(",")[1];
          folder?.file(fileName, base64Data, { base64: true });
        } else {
          // Fetch relative asset
          const res = await fetch(p.image_data_url);
          const blob = await res.blob();
          folder?.file(fileName, blob);
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `refract-coloring-pack-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header with Pack Actions & Crayon Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-studio-accent to-orange-600 text-white flex items-center justify-center font-bold shadow-glow">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white">4-Page Progressive Coloring Pack</h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-studio-accent/20 border border-studio-accent/40 text-studio-accent">
                {pages.length}/4 Pages Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              High-contrast vector line art • Pure #000000 on #FFFFFF • High-res print ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Crayon / Watercolor Tint Preview Toggle */}
          <button
            onClick={() => setCrayonMode(!crayonMode)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              crayonMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
            }`}
          >
            <Palette className={`w-3.5 h-3.5 ${crayonMode ? "text-amber-400" : ""}`} />
            <span>{crayonMode ? "Tinted Preview On" : "Preview Color Tint"}</span>
          </button>

          {/* Download Complete Pack ZIP */}
          <button
            onClick={handleDownloadZipPack}
            disabled={pages.length === 0 || isZipping}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-glow cursor-pointer ${
              pages.length > 0
                ? "bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white"
                : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
            }`}
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Packaging ZIP...
              </>
            ) : (
              <>
                <Package className="w-4 h-4" />
                Download Pack (.ZIP)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progressive 4-Slot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SLOT_DEFINITIONS.map((slot) => {
          const readyPage = pages.find((p) => p.variant_index === slot.index);
          const isCurrentlyRendering = activeVariantIndex === slot.index;

          return (
            <div
              key={slot.index}
              className={`group flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 ${
                readyPage
                  ? "glass-panel hover:border-studio-accent/70 hover:shadow-glow"
                  : isCurrentlyRendering
                  ? "glass-panel-elevated border-studio-accent ring-2 ring-studio-accent/30 shadow-glow"
                  : "glass-panel border-dashed border-white/10 opacity-70"
              }`}
            >
              {/* Slot Header Banner */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      readyPage
                        ? "bg-emerald-400 shadow-[0_0_8px_#34D399]"
                        : isCurrentlyRendering
                        ? "bg-studio-accent animate-ping"
                        : "bg-slate-600"
                    }`}
                  />
                  <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
                    Page #{slot.index}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full ${
                    readyPage
                      ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                      : isCurrentlyRendering
                      ? "bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {readyPage ? "Ready" : isCurrentlyRendering ? "Synthesizing" : "Pending"}
                </span>
              </div>

              {/* Artwork Preview Canvas */}
              <div className="relative aspect-[3/4] bg-white flex items-center justify-center overflow-hidden border-b border-white/10 group/canvas">
                {readyPage ? (
                  <div className="relative w-full h-full p-2.5 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={readyPage.image_data_url}
                      alt={readyPage.page_title}
                      className={`w-full h-full object-contain transition-all duration-300 ${
                        crayonMode
                          ? "sepia-[0.35] hue-rotate-15 saturate-150 contrast-105"
                          : ""
                      }`}
                    />

                    {/* Quick Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px] opacity-0 group-hover/canvas:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                      <button
                        onClick={() => setZoomPage(readyPage)}
                        title="Zoom / Inspect"
                        className="p-3 rounded-xl bg-white/10 hover:bg-white text-slate-200 hover:text-black border border-white/20 shadow-md hover:scale-110 transition-all cursor-pointer"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(readyPage)}
                        title="Print Page"
                        className="p-3 rounded-xl bg-white/10 hover:bg-white text-slate-200 hover:text-black border border-white/20 shadow-md hover:scale-110 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadSingle(readyPage)}
                        title="Download Image"
                        className="p-3 rounded-xl bg-studio-accent text-white hover:bg-orange-600 shadow-glow hover:scale-110 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : isCurrentlyRendering ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90 text-white w-full h-full">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-studio-accent animate-spin" />
                      <Sparkles className="w-5 h-5 text-studio-accent absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Diffusion Stream Active</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        KSampler 4-Step $\rightarrow$ VAE Decode
                      </p>
                    </div>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-studio-accent animate-pulse" style={{ width: "75%" }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400 bg-slate-950/40 w-full h-full">
                    <FileCheck className="w-8 h-8 opacity-30 stroke-[1.5]" />
                    <p className="text-xs font-medium text-slate-400">Awaiting Pipeline Stage</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-500">
                      Estimated: {slot.estimatedSec}
                    </span>
                  </div>
                )}
              </div>

              {/* Slot Meta Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">
                    {readyPage ? readyPage.page_title : slot.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {readyPage ? readyPage.scene_action : slot.description}
                  </p>
                </div>

                {/* Performance & FinOps Telemetry Pill */}
                {readyPage ? (
                  <div className="pt-2.5 border-t border-white/10 space-y-2">
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                      <div className="bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
                        <span className="text-[9px] text-slate-400 block uppercase">Render</span>
                        <span className="font-bold text-white">
                          {(readyPage.total_render_ms / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <div className="bg-white/5 rounded-lg px-2.5 py-1 border border-white/5">
                        <span className="text-[9px] text-slate-400 block uppercase">Modal Cost</span>
                        <span className="font-bold text-emerald-400">
                          ${readyPage.cost_usd.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Footer */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => handlePrint(readyPage)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                      </button>
                      <button
                        onClick={() => handleDownloadSingle(readyPage)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-glow cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{slot.mode}</span>
                    <span>T4: ~$0.012</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Zoom Modal */}
      {zoomPage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative glass-panel-elevated rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-studio-accent font-mono">
                  Page #{zoomPage.variant_index} • {zoomPage.mode}
                </span>
                <h3 className="text-xl font-bold text-white">{zoomPage.page_title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCrayonMode(!crayonMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    crayonMode
                      ? "bg-amber-500/30 text-amber-300 border border-amber-500/50"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>{crayonMode ? "Crayon Tint" : "Black & White"}</span>
                </button>
                <button
                  onClick={() => handlePrint(zoomPage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={() => handleDownloadSingle(zoomPage)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-studio-accent to-orange-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-glow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Save Image
                </button>
                <button
                  onClick={() => setZoomPage(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Vector Coloring Art Canvas */}
            <div className="flex-1 overflow-auto p-6 bg-slate-950 flex items-center justify-center">
              <div className="bg-white p-3 rounded-2xl shadow-2xl max-w-lg w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={zoomPage.image_data_url}
                  alt={zoomPage.page_title}
                  className={`w-full h-auto object-contain transition-all ${
                    crayonMode ? "sepia-[0.35] hue-rotate-15 saturate-150 contrast-105" : ""
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer: FinOps Details */}
            <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-4">
              <div className="flex items-center gap-4 font-mono">
                {zoomPage.seed && (
                  <span>
                    <strong className="text-slate-400">Seed:</strong> {zoomPage.seed}
                  </span>
                )}
                <span>
                  <strong className="text-slate-400">Render:</strong>{" "}
                  {(zoomPage.total_render_ms / 1000).toFixed(2)}s
                </span>
                <span>
                  <strong className="text-slate-400">T4 Cost:</strong>{" "}
                  <span className="text-emerald-400 font-bold">${zoomPage.cost_usd.toFixed(6)}</span>
                </span>
              </div>
              <div className="text-slate-400 font-mono text-[11px] truncate max-w-md">
                Prompt: {zoomPage.prompt_used}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
