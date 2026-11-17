"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { PageResult, RunTelemetry, VlmAnalysis, WarmupStatus } from "@/types/refract";

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

const STORAGE_KEY = "refract_telemetry_history_v2";

// Authentic Production Run 1 (Family of 5 - Pack 1)
const SEED_RUN_PACK_5: RunTelemetry = {
  run_id: "bench_pack1_family5",
  timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  input_preview_url: "/samples/pack-family-5/images.jpg",
  active_vlm_model: "gemma-4-26b-a4b-it",
  exact_headcount: 5,
  vacation_setting: "Ocean Beach Waves",
  character_bible:
    "1. Father (far left): Bald, beard, white shirt, tan shorts, standing in surf.\n2. Mother (center-left): Long wavy dark hair, navy striped dress, joyful smile.\n3. Daughter 1 (center): Long dark hair, striped sundress, standing in shallow water.\n4. Son (center-right): Short light brown hair, checkered shirt, tan shorts.\n5. Daughter 2 (far right): Curly light brown hair, floral sun-dress, smiling.",
  vlm_ttft_ms: 2341.6,
  vlm_total_ms: 19375.4,
  tokens_per_sec: 41.9,
  prompt_tokens: 705,
  output_tokens: 811,
  warmup_overlap_sec: 1.2,
  pages: [
    {
      variant_index: 1,
      page_title: "Faithful Keepsake Portrait",
      mode: "img2img_faithful",
      scene_action: "The family stands together in the ocean waves, mimicking the original photo's pose.",
      image_data_url: "/samples/pack-family-5/01_faithful_keepsake_portrait.png",
      ksampler_ms: 36340,
      vae_decode_ms: 920,
      total_render_ms: 37260,
      cost_usd: 0.01281,
      seed: 180703703849778,
      resolution: "368x544",
      prompt_used: "Coloring book page, bold #000000 black ink outlines on a pure #FFFFFF white background. A family of five standing in shallow ocean waves. Thick lines, large open spaces for coloring, high contrast, simple details.",
    },
    {
      variant_index: 2,
      page_title: "Sandcastle Architects",
      mode: "txt2img_adventure",
      scene_action: "The family is actively building a massive, elaborate sandcastle on the beach together.",
      image_data_url: "/samples/pack-family-5/02_sandcastle_architects.png",
      ksampler_ms: 35357,
      vae_decode_ms: 960,
      total_render_ms: 36317,
      cost_usd: 0.012058,
      seed: 85545222457286,
      resolution: "368x544",
      prompt_used: "Coloring book page, crisp #000000 black ink line art on a pure #FFFFFF white background. The family of five are kneeling on the sand, building a giant sandcastle with buckets and shovels. Dynamic angle, storybook style, bold outlines.",
    },
    {
      variant_index: 3,
      page_title: "Ocean Friends Playtime",
      mode: "txt2img_adventure",
      scene_action: "The family is playfully splashing in the waves with friendly dolphins jumping nearby.",
      image_data_url: "/samples/pack-family-5/03_ocean_friends_playtime.png",
      ksampler_ms: 34368,
      vae_decode_ms: 966,
      total_render_ms: 35334,
      cost_usd: 0.011926,
      seed: 242602428482158,
      resolution: "368x544",
      prompt_used: "Coloring book page, bold #000000 ink lines on a flat #FFFFFF white background. The family of five splashing in ocean waves with friendly dolphins jumping in background. Whimsical cartoon style, thick lines, expressive faces.",
    },
    {
      variant_index: 4,
      page_title: "Beach Day Souvenir",
      mode: "txt2img_adventure",
      scene_action: "The family is cheering in a celebratory group pose, framed by a decorative border.",
      image_data_url: "/samples/pack-family-5/04_beach_day_souvenir.png",
      ksampler_ms: 35029,
      vae_decode_ms: 937,
      total_render_ms: 35966,
      cost_usd: 0.012028,
      seed: 187352021450410,
      resolution: "368x544",
      prompt_used: "Coloring book page, #000000 black ink on #FFFFFF white. The family of five cheering and smiling in celebratory group pose surrounded by decorative hand-drawn border of seashells, starfish, and sun icons. High contrast, clean lines.",
    },
  ],
  total_e2e_sec: 317.27,
  total_pack_cost_usd: 0.048822,
  packs_per_dollar: 20,
};

// Authentic Production Run 2 (Family of 3 - Pack 2)
const SEED_RUN_PACK_3: RunTelemetry = {
  run_id: "bench_pack2_family3",
  timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
  input_preview_url: "/samples/pack-family-3/istockphoto-2157349912-612x612.jpg",
  active_vlm_model: "gemma-4-26b-a4b-it",
  exact_headcount: 3,
  vacation_setting: "Sunny Beachfront Coast",
  character_bible:
    "1. Mother (left): Afro textured hair, yellow top, shorts, radiant smile.\n2. Daughter (center): Wavy shoulder hair, patterned sundress, joyfully splashing.\n3. Father (right): Short hair, collared button-up shirt, boardshorts.",
  vlm_ttft_ms: 1469.1,
  vlm_total_ms: 17120,
  tokens_per_sec: 43.7,
  prompt_tokens: 796,
  output_tokens: 749,
  warmup_overlap_sec: 67.17,
  pages: [
    {
      variant_index: 1,
      page_title: "Faithful Keepsake Portrait",
      mode: "img2img_faithful",
      scene_action: "The family recreates their original pose on the beach.",
      image_data_url: "/samples/pack-family-3/01_faithful_keepsake_portrait.png",
      ksampler_ms: 8407,
      vae_decode_ms: 244,
      total_render_ms: 8651,
      cost_usd: 0.002194,
      seed: 210011811705191,
      resolution: "608x416",
      prompt_used: "Three people together, one adult female, one child, and one adult male. Bold #000000 black ink outlines, pure #FFFFFF unshaded white interiors. The family is posing on a beach with ocean waves.",
    },
    {
      variant_index: 2,
      page_title: "Action Adventure Scene",
      mode: "txt2img_adventure",
      scene_action: "The family is building a giant sandcastle together.",
      image_data_url: "/samples/pack-family-3/02_action_adventure_scene.png",
      ksampler_ms: 32176,
      vae_decode_ms: 261,
      total_render_ms: 32437,
      cost_usd: 0.010507,
      seed: 156254422869066,
      resolution: "608x416",
      prompt_used: "Three people together building massive detailed sandcastle with buckets and shovels. Bold #000000 black ink outlines, pure #FFFFFF white. Crisp storybook line art style.",
    },
    {
      variant_index: 3,
      page_title: "Whimsical Playful Moment",
      mode: "txt2img_adventure",
      scene_action: "The family is splashing in the waves with dolphins.",
      image_data_url: "/samples/pack-family-3/03_whimsical_playful_moment.png",
      ksampler_ms: 32164,
      vae_decode_ms: 290,
      total_render_ms: 32454,
      cost_usd: 0.010615,
      seed: 238080375264315,
      resolution: "608x416",
      prompt_used: "Three people splashing joyfully in shallow ocean waves while friendly dolphins leap in the background. Bold #000000 black ink outlines.",
    },
    {
      variant_index: 4,
      page_title: "Framed Souvenir Poster",
      mode: "txt2img_adventure",
      scene_action: "The family is cheering in a celebratory pose within a decorated frame.",
      image_data_url: "/samples/pack-family-3/04_framed_souvenir_poster.png",
      ksampler_ms: 32207,
      vae_decode_ms: 333,
      total_render_ms: 32540,
      cost_usd: 0.010601,
      seed: 117965645890203,
      resolution: "608x416",
      prompt_used: "Three people cheering with arms raised in celebratory group pose surrounded by hand-drawn coloring border of seashells, suns, and travel doodles.",
    },
  ],
  total_e2e_sec: 224.07,
  total_pack_cost_usd: 0.033916,
  packs_per_dollar: 29,
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
  const [currentPages, setCurrentPages] = useState<PageResult[]>(SEED_RUN_PACK_5.pages);
  const [activeRunTelemetry, setActiveRunTelemetry] = useState<RunTelemetry | null>(SEED_RUN_PACK_5);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(4); // Default to Fast Demo Mode (4x)
  const [selectedSamplePhoto, setSelectedSamplePhoto] = useState<string>("/samples/pack-family-5/images.jpg");

  // Telemetry run history
  const [runs, setRuns] = useState<RunTelemetry[]>([SEED_RUN_PACK_5, SEED_RUN_PACK_3]);
  const [selectedRunId, setSelectedRunId] = useState<string>(SEED_RUN_PACK_5.run_id);

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const imageUrl = params?.imageUrl || selectedSamplePhoto;
      const setting = params?.setting || "Sunny Tropical Beach";
      const headcount = params?.headcount || 5;
      const speed = params?.speedMultiplier ?? speedMultiplier;

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

                if (newPage.variant_index < 4) {
                  setActiveVariantIndex((newPage.variant_index + 1) as 1 | 2 | 3 | 4);
                } else {
                  setActiveVariantIndex(null);
                }

                setStreamProgress(25 + newPage.variant_index * 18);
              } else if (eventType === "telemetry_complete") {
                const telemetry: RunTelemetry = eventData;
                setActiveRunTelemetry(telemetry);
                setStreamStage("completed");
                setIsStreaming(false);
                setStreamProgress(100);
                setActiveVariantIndex(null);

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
