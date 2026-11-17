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
  ExternalLink,
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

  // Helper to download individual SVG
  const handleDownloadSingle = (page: PageResult) => {
    const link = document.createElement("a");
    link.href = page.image_data_url;
    link.download = `refract-page-${page.variant_index}-${page.page_title.toLowerCase().replace(/\s+/g, "-")}.svg`;
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
Resolution: 800 x 1050 (Standard US Letter 8.5" x 11" & A4 ready)
Palette: Pure Crisp #000000 on #FFFFFF (Coloring ready)

PAGES IN THIS PACK:
${pages
  .map(
    (p) => `
- Page ${p.variant_index}: ${p.page_title}
  Mode: ${p.mode}
  Render Time: ${(p.total_render_ms / 1000).toFixed(2)}s (KSampler: ${(p.ksampler_ms / 1000).toFixed(2)}s, VAE: ${(p.vae_decode_ms / 1000).toFixed(2)}s)
  Modal T4 Cost: $${p.cost_usd.toFixed(6)}
  Scene: ${p.scene_action}
`
  )
  .join("")}

INSTRUCTIONS FOR PRINTING:
1. Open any .svg or .png file in your browser or image viewer.
2. Select File -> Print.
3. Set Paper Size to US Letter or A4, Margins to 'None' or 'Minimum'.
4. Hand out crayons, markers, or colored pencils and enjoy!
`;
      folder?.file("README_COLORING_PACK.txt", readme);

      // Add each page SVG
      for (const p of pages) {
        // Extract base64 part
        const base64Data = p.image_data_url.split(",")[1];
        folder?.file(
          `page-${p.variant_index}-${p.page_title.toLowerCase().replace(/\s+/g, "-")}.svg`,
          base64Data,
          { base64: true }
        );
      }

      const content = await zip.generateAsync({ type: "blob" });
      const blobUrl = URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `refract-coloring-book-${new Date().toISOString().slice(0, 10)}.zip`;
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
      {/* Gallery Header with Pack Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-paper-100 border border-paper-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-studio-dark text-white flex items-center justify-center font-bold shadow-sm">
            <Layers className="w-5 h-5 text-studio-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-paper-900">4-Page Progressive Coloring Pack</h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-studio-accent/15 text-studio-accent">
                {pages.length}/4 Pages Ready
              </span>
            </div>
            <p className="text-xs text-paper-800/80">
              High-contrast vector line art • Pure #000000 on #FFFFFF • Print ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadZipPack}
            disabled={pages.length === 0 || isZipping}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm ${
              pages.length > 0
                ? "bg-studio-dark hover:bg-black text-white hover:shadow-md cursor-pointer"
                : "bg-paper-200 text-paper-800/40 cursor-not-allowed"
            }`}
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-studio-accent" />
                Packaging ZIP...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 text-studio-accent" />
                Download Complete Pack (.ZIP)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progressive 4-Slot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {SLOT_DEFINITIONS.map((slot) => {
          const readyPage = pages.find((p) => p.variant_index === slot.index);
          const isCurrentlyRendering = activeVariantIndex === slot.index;
          const isPending = !readyPage && !isCurrentlyRendering;

          return (
            <div
              key={slot.index}
              className={`group flex flex-col rounded-xl overflow-hidden border transition-all duration-300 ${
                readyPage
                  ? "bg-white border-paper-300 shadow-sm hover:shadow-md hover:border-paper-800/40"
                  : isCurrentlyRendering
                  ? "bg-white border-studio-accent ring-2 ring-studio-accent/20 shadow-md"
                  : "bg-paper-50/70 border-dashed border-paper-300 opacity-80"
              }`}
            >
              {/* Slot Header Banner */}
              <div className="px-3.5 py-2.5 border-b border-paper-200 flex items-center justify-between bg-paper-100/60">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      readyPage
                        ? "bg-emerald-500"
                        : isCurrentlyRendering
                        ? "bg-studio-accent animate-ping"
                        : "bg-paper-300"
                    }`}
                  />
                  <span className="text-xs font-bold text-paper-900 tracking-wide uppercase">
                    Slot #{slot.index}
                  </span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    readyPage
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isCurrentlyRendering
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-paper-200 text-paper-800/60"
                  }`}
                >
                  {readyPage ? "Ready" : isCurrentlyRendering ? "Synthesizing" : "Pending"}
                </span>
              </div>

              {/* Artwork Preview Canvas */}
              <div className="relative aspect-[3/4] bg-white flex items-center justify-center overflow-hidden border-b border-paper-200">
                {readyPage ? (
                  <div className="relative w-full h-full p-2 flex items-center justify-center group/art">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={readyPage.image_data_url}
                      alt={readyPage.page_title}
                      className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover/art:scale-[1.02]"
                    />

                    {/* Quick Hover Overlay */}
                    <div className="absolute inset-0 bg-paper-900/40 backdrop-blur-[2px] opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setZoomPage(readyPage)}
                        title="Zoom / Inspect"
                        className="p-2.5 rounded-full bg-white text-paper-900 hover:bg-paper-100 shadow-md hover:scale-110 transition-transform"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(readyPage)}
                        title="Print Page"
                        className="p-2.5 rounded-full bg-white text-paper-900 hover:bg-paper-100 shadow-md hover:scale-110 transition-transform"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadSingle(readyPage)}
                        title="Download SVG"
                        className="p-2.5 rounded-full bg-studio-accent text-white hover:bg-orange-600 shadow-md hover:scale-110 transition-transform"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : isCurrentlyRendering ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-3 border-paper-200 border-t-studio-accent animate-spin" />
                      <Sparkles className="w-5 h-5 text-studio-accent absolute inset-0 m-auto" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-paper-900">Diffusion Stream Active</p>
                      <p className="text-[11px] text-paper-800/70 font-mono mt-0.5">
                        KSampler (4-Step) $\rightarrow$ VAE Decode
                      </p>
                    </div>
                    <div className="w-24 h-1.5 bg-paper-200 rounded-full overflow-hidden">
                      <div className="h-full bg-studio-accent animate-pulse" style={{ width: "70%" }} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-paper-800/40">
                    <FileCheck className="w-8 h-8 opacity-40 stroke-[1.5]" />
                    <p className="text-xs font-medium">Awaiting Pipeline Stage</p>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-paper-200/50">
                      Estimated: {slot.estimatedSec}
                    </span>
                  </div>
                )}
              </div>

              {/* Slot Meta Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="text-sm font-bold text-paper-900 leading-snug line-clamp-1">
                      {slot.title}
                    </h3>
                  </div>
                  <p className="text-xs text-paper-800/80 mt-1 line-clamp-2 leading-relaxed">
                    {readyPage ? readyPage.scene_action : slot.description}
                  </p>
                </div>

                {/* Performance & FinOps Telemetry Pill */}
                {readyPage ? (
                  <div className="pt-2 border-t border-paper-200">
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="bg-paper-100 rounded px-2 py-1 text-paper-800">
                        <span className="text-[10px] text-paper-800/60 block">Render Time</span>
                        <span className="font-mono font-bold text-paper-900">
                          {(readyPage.total_render_ms / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="bg-paper-100 rounded px-2 py-1 text-paper-800">
                        <span className="text-[10px] text-paper-800/60 block">Modal T4 Cost</span>
                        <span className="font-mono font-bold text-emerald-700">
                          ${readyPage.cost_usd.toFixed(5)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Footer */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <button
                        onClick={() => handlePrint(readyPage)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-paper-100 hover:bg-paper-200 text-paper-900 text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                      </button>
                      <button
                        onClick={() => handleDownloadSingle(readyPage)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-paper-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        SVG
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-paper-200/60 flex items-center justify-between text-[11px] text-paper-800/60 font-mono">
                    <span>{slot.mode}</span>
                    <span>T4: ~$0.0015</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Resolution Zoom Modal */}
      {zoomPage && (
        <div className="fixed inset-0 z-50 bg-paper-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-paper-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-paper-200 flex items-center justify-between bg-paper-100/50">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-studio-accent">
                  Page #{zoomPage.variant_index} • {zoomPage.mode}
                </span>
                <h3 className="text-xl font-bold text-paper-900">{zoomPage.page_title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(zoomPage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-paper-200 hover:bg-paper-300 text-paper-900 text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Page
                </button>
                <button
                  onClick={() => handleDownloadSingle(zoomPage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-studio-dark hover:bg-black text-white text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save SVG
                </button>
                <button
                  onClick={() => setZoomPage(null)}
                  className="p-1.5 rounded-lg text-paper-800 hover:bg-paper-200 transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Vector Coloring Art Canvas */}
            <div className="flex-1 overflow-auto p-6 bg-paper-50 flex items-center justify-center">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-paper-300 max-w-xl w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={zoomPage.image_data_url}
                  alt={zoomPage.page_title}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            {/* Modal Footer: FinOps Details */}
            <div className="px-6 py-3 border-t border-paper-200 bg-white flex flex-wrap items-center justify-between text-xs text-paper-800 gap-4">
              <div className="flex items-center gap-4">
                <span>
                  <strong className="text-paper-900 font-mono">KSampler:</strong>{" "}
                  {(zoomPage.ksampler_ms / 1000).toFixed(2)}s
                </span>
                <span>
                  <strong className="text-paper-900 font-mono">VAE Decode:</strong>{" "}
                  {(zoomPage.vae_decode_ms / 1000).toFixed(2)}s
                </span>
                <span>
                  <strong className="text-paper-900 font-mono">GPU Cost:</strong>{" "}
                  <span className="text-emerald-700 font-bold">${zoomPage.cost_usd.toFixed(6)}</span>
                </span>
              </div>
              <div className="text-paper-800/70 font-mono text-[11px] truncate max-w-md">
                Prompt: {zoomPage.prompt_used}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
