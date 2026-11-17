"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { PageResult, RunTelemetry, VlmAnalysis, WarmupStatus } from "@/types/refract";
import { generateColoringSvg, svgToDataUrl } from "@/lib/mockColoringSvg";

interface GenerationParams {
  imageUrl: string;
  setting: string;
  headcount: number;
  speedMultiplier?: number;
}

interface RefractContextType {
  // Warmup container state
  warmupStatus: WarmupStatus;
  triggerWarmup: (nonBlocking?: boolean) => Promise<void>;
  checkWarmup: () => Promise<void>;

  // Streaming generation state
  isStreaming: boolean;
  streamStage: "idle" | "vlm_analyzing" | "rendering_pages" | "completed" | "error";
  streamProgress: number; // 0 to 100%
  vlmAnalysis: VlmAnalysis | null;
  activeVariantIndex: 1 | 2 | 3 | 4 | null;
  currentPages: PageResult[];
  activeRunTelemetry: RunTelemetry | null;
  streamError: string | null;
  speedMultiplier: number;
  setSpeedMultiplier: (multiplier: number) => void;
  selectedSamplePhoto: string;
  setSelectedSamplePhoto: (url: string) => void;

  // Actions
  startGeneration: (params?: Partial<GenerationParams>) => Promise<void>;
  cancelGeneration: () => void;
  resetStudio: () => void;

  // Telemetry runs history
  runs: RunTelemetry[];
  selectedTelemetryRun: RunTelemetry | null;
  setSelectedRunId: (runId: string) => void;
}

const STORAGE_KEY = "refract_telemetry_history_v1";

// Seed benchmark run
const INITIAL_BENCHMARK_RUN: RunTelemetry = {
  run_id: "bench_t4_gemma4_init",
  timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  input_preview_url: "/samples/beach-family.svg",
  active_vlm_model: "gemma-4-26b-a4b-it",
  exact_headcount: 5,
  vacation_setting: "Sunny Maui Tropical Beach",
  character_bible:
    "1. Father (left): Teal aloha shirt, sunglasses, relaxed beach smile.\n2. Daughter (mid-left): Golden yellow sundress, braided chestnut hair.\n3. Son (center): Striped tee, reversed red cap, holding beach ball.\n4. Mother (mid-right): Coral wrap dress, wide-brim straw hat, bright smile.\n5. Toddler (right): Mint green romper, green bucket, joyful.",
  vlm_ttft_ms: 1240,
  vlm_total_ms: 5120,
  tokens_per_sec: 40.9,
  prompt_tokens: 528,
  output_tokens: 159,
  warmup_overlap_sec: 1.2,
  pages: [
    {
      variant_index: 1,
      page_title: "Faithful Keepsake Portrait",
      mode: "img2img_faithful",
      scene_action: "High-fidelity family portrait preserving exact left-to-right character positioning and smiles",
      image_data_url: svgToDataUrl(generateColoringSvg({ variantIndex: 1, pageTitle: "Faithful Keepsake Portrait" })),
      ksampler_ms: 7850,
      vae_decode_ms: 1120,
      total_render_ms: 8970,
      cost_usd: 0.001471,
      prompt_used: "coloring book line art, faithful family portrait on beach, clean bold outlines, pure white fill",
    },
    {
      variant_index: 2,
      page_title: "Sandcastle Architects",
      mode: "txt2img_adventure",
      scene_action: "Action adventure of kids erecting a multi-tiered fortress sandcastle with friendly crab helper",
      image_data_url: svgToDataUrl(generateColoringSvg({ variantIndex: 2, pageTitle: "Sandcastle Architects" })),
      ksampler_ms: 8150,
      vae_decode_ms: 1140,
      total_render_ms: 9290,
      cost_usd: 0.001524,
      prompt_used: "coloring book illustration, children building giant sandcastle fortress with turrets, buckets, crabs",
    },
    {
      variant_index: 3,
      page_title: "Ocean Friends Playtime",
      mode: "txt2img_adventure",
      scene_action: "Underwater fantasy snorkeling adventure with sea turtles, leaping dolphins, and coral reef",
      image_data_url: svgToDataUrl(generateColoringSvg({ variantIndex: 3, pageTitle: "Ocean Friends Playtime" })),
      ksampler_ms: 8020,
      vae_decode_ms: 1130,
      total_render_ms: 9150,
      cost_usd: 0.001501,
      prompt_used: "coloring book page, kid snorkeling underwater with cheerful sea turtle, jumping dolphin, reef",
    },
    {
      variant_index: 4,
      page_title: "Beach Day Souvenir",
      mode: "txt2img_adventure",
      scene_action: "Sunset campfire celebration with marshmallow roasting, palm trees, and souvenir banner",
      image_data_url: svgToDataUrl(generateColoringSvg({ variantIndex: 4, pageTitle: "Beach Day Souvenir" })),
      ksampler_ms: 7920,
      vae_decode_ms: 1110,
      total_render_ms: 9030,
      cost_usd: 0.001481,
      prompt_used: "coloring book page, cozy beach campfire at sunset with palm trees, banner reading VACATION MEMORIES",
    },
  ],
  total_e2e_sec: 41.56,
  total_pack_cost_usd: 0.005977,
  packs_per_dollar: 167,
};

const RefractContext = createContext<RefractContextType | null>(null);

export const RefractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Warmup container state
  const [warmupStatus, setWarmupStatus] = useState<WarmupStatus>({
    state: "cold",
    elapsed_ms: 0,
    gpu: "NVIDIA T4 (16GB)",
  });

  // Streaming generation state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStage, setStreamStage] = useState<"idle" | "vlm_analyzing" | "rendering_pages" | "completed" | "error">("idle");
  const [streamProgress, setStreamProgress] = useState(0);
  const [vlmAnalysis, setVlmAnalysis] = useState<VlmAnalysis | null>(null);
  const [activeVariantIndex, setActiveVariantIndex] = useState<1 | 2 | 3 | 4 | null>(null);
  const [currentPages, setCurrentPages] = useState<PageResult[]>([]);
  const [activeRunTelemetry, setActiveRunTelemetry] = useState<RunTelemetry | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(4); // Default to Fast Demo Mode (4x) for snappy demos
  const [selectedSamplePhoto, setSelectedSamplePhoto] = useState<string>("/samples/beach-family.svg");

  // Telemetry run history
  const [runs, setRuns] = useState<RunTelemetry[]>([INITIAL_BENCHMARK_RUN]);
  const [selectedRunId, setSelectedRunId] = useState<string>(INITIAL_BENCHMARK_RUN.run_id);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load saved runs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRuns(parsed);
          setSelectedRunId(parsed[0].run_id);
        }
      }
    } catch (e) {
      console.warn("Failed to read runs from localStorage", e);
    }
  }, []);

  // Save runs to localStorage on update
  const persistRuns = useCallback((newRuns: RunTelemetry[]) => {
    setRuns(newRuns);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRuns));
    } catch (e) {
      console.warn("Failed to persist runs", e);
    }
  }, []);

  // Check warmup status via GET
  const checkWarmup = useCallback(async () => {
    try {
      const res = await fetch("/api/warmup", { method: "GET" });
      if (res.ok) {
        const data: WarmupStatus = await res.json();
        setWarmupStatus(data);
      }
    } catch (e) {
      console.warn("Warmup check error", e);
    }
  }, []);

  // Trigger Warmup (intent-driven POST)
  const triggerWarmup = useCallback(async (nonBlocking: boolean = true) => {
    setWarmupStatus((prev) => ({
      ...prev,
      state: prev.state === "warm" ? "warm" : "warming",
    }));

    const doFetch = async () => {
      try {
        const res = await fetch("/api/warmup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        });
        if (res.ok) {
          const data: WarmupStatus = await res.json();
          setWarmupStatus(data);
        }
      } catch (e) {
        console.warn("Warmup post error", e);
      }
    };

    if (nonBlocking) {
      doFetch();
    } else {
      await doFetch();
    }
  }, []);

  // Warmup poll interval when warming
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (warmupStatus.state === "warming") {
      timer = setInterval(() => {
        checkWarmup();
      }, 700);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [warmupStatus.state, checkWarmup]);

  // Initial check on mount
  useEffect(() => {
    checkWarmup();
  }, [checkWarmup]);

  // Start Generation SSE Stream
  const startGeneration = useCallback(
    async (params?: Partial<GenerationParams>) => {
      // Abort any active stream
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const imageUrl = params?.imageUrl || selectedSamplePhoto;
      const setting = params?.setting || "Sunny Tropical Beach";
      const headcount = params?.headcount || 4;
      const speed = params?.speedMultiplier ?? speedMultiplier;

      // Reset stream UI state
      setIsStreaming(true);
      setStreamStage("vlm_analyzing");
      setStreamProgress(10);
      setVlmAnalysis(null);
      setActiveVariantIndex(null);
      setCurrentPages([]);
      setActiveRunTelemetry(null);
      setStreamError(null);

      try {
        const response = await fetch("/api/generate-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input_image_url: imageUrl,
            setting,
            headcount,
            speedMultiplier: speed,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Generation failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const block of lines) {
            const eventMatch = block.match(/^event:\s*(.+)$/m);
            const dataMatch = block.match(/^data:\s*(.+)$/m);

            if (eventMatch && dataMatch) {
              const eventType = eventMatch[1].trim();
              const eventData = JSON.parse(dataMatch[1].trim());

              if (eventType === "vlm_status") {
                setVlmAnalysis(eventData);
                setStreamStage("rendering_pages");
                setActiveVariantIndex(1);
                setStreamProgress(25);
              } else if (eventType === "page_ready") {
                const newPage: PageResult = eventData;
                setCurrentPages((prev) => {
                  const filtered = prev.filter((p) => p.variant_index !== newPage.variant_index);
                  return [...filtered, newPage].sort((a, b) => a.variant_index - b.variant_index);
                });

                // Next variant indicator
                if (newPage.variant_index < 4) {
                  setActiveVariantIndex((newPage.variant_index + 1) as 1 | 2 | 3 | 4);
                } else {
                  setActiveVariantIndex(null);
                }

                // Progress increments: 25% + (variant * 18%) -> 43%, 61%, 79%, 97%
                setStreamProgress(25 + newPage.variant_index * 18);
              } else if (eventType === "telemetry_complete") {
                const telemetry: RunTelemetry = eventData;
                setActiveRunTelemetry(telemetry);
                setStreamStage("completed");
                setIsStreaming(false);
                setStreamProgress(100);
                setActiveVariantIndex(null);

                // Add to history runs
                persistRuns([telemetry, ...runs]);
                setSelectedRunId(telemetry.run_id);
              } else if (eventType === "error") {
                setStreamError(eventData.message);
                setStreamStage("error");
                setIsStreaming(false);
              }
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Stream was intentionally aborted");
        } else {
          setStreamError(err.message || "An unexpected error occurred during generation");
          setStreamStage("error");
          setIsStreaming(false);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [selectedSamplePhoto, speedMultiplier, runs, persistRuns]
  );

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setStreamStage("idle");
    setActiveVariantIndex(null);
  }, []);

  const resetStudio = useCallback(() => {
    cancelGeneration();
    setCurrentPages([]);
    setVlmAnalysis(null);
    setActiveRunTelemetry(null);
    setStreamProgress(0);
    setStreamStage("idle");
    setStreamError(null);
  }, [cancelGeneration]);

  const selectedTelemetryRun = runs.find((r) => r.run_id === selectedRunId) || runs[0] || null;

  return (
    <RefractContext.Provider
      value={{
        warmupStatus,
        triggerWarmup,
        checkWarmup,
        isStreaming,
        streamStage,
        streamProgress,
        vlmAnalysis,
        activeVariantIndex,
        currentPages,
        activeRunTelemetry,
        streamError,
        speedMultiplier,
        setSpeedMultiplier,
        selectedSamplePhoto,
        setSelectedSamplePhoto,
        startGeneration,
        cancelGeneration,
        resetStudio,
        runs,
        selectedTelemetryRun,
        setSelectedRunId,
      }}
    >
      {children}
    </RefractContext.Provider>
  );
};

export const useRefract = () => {
  const context = useContext(RefractContext);
  if (!context) {
    throw new Error("useRefract must be used within a RefractProvider");
  }
  return context;
};
