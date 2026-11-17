export type WarmupState = "cold" | "warming" | "warm";

export interface WarmupStatus {
  state: WarmupState;
  elapsed_ms: number;
  gpu: "NVIDIA T4 (16GB)";
  container_id?: string;
  last_ping?: string;
}

export interface PageResult {
  variant_index: 1 | 2 | 3 | 4;
  page_title: string;
  mode: "img2img_faithful" | "txt2img_adventure";
  scene_action: string;
  image_data_url: string;
  ksampler_ms: number;
  vae_decode_ms: number;
  total_render_ms: number;
  cost_usd: number;
  prompt_used: string;
}

export interface VlmAnalysis {
  active_vlm_model: string;
  exact_headcount: number;
  vacation_setting: string;
  character_bible: string;
  vlm_ttft_ms: number;
  vlm_total_ms: number;
  tokens_per_sec: number;
  prompt_tokens: number;
  output_tokens: number;
  confidence_score?: number;
}

export interface RunTelemetry {
  run_id: string;
  timestamp: string;
  input_preview_url: string;
  active_vlm_model: string;
  exact_headcount: number;
  character_bible: string;
  vacation_setting?: string;
  vlm_ttft_ms: number;
  vlm_total_ms: number;
  tokens_per_sec: number;
  prompt_tokens: number;
  output_tokens: number;
  pages: PageResult[];
  total_e2e_sec: number;
  total_pack_cost_usd: number;
  packs_per_dollar: number;
  warmup_overlap_sec?: number;
}

export type SseEventName = "vlm_status" | "page_ready" | "telemetry_complete" | "error";

export interface SseVlmEvent {
  event: "vlm_status";
  data: VlmAnalysis;
}

export interface SsePageEvent {
  event: "page_ready";
  data: PageResult;
}

export interface SseCompleteEvent {
  event: "telemetry_complete";
  data: RunTelemetry;
}

export interface SseErrorEvent {
  event: "error";
  data: { message: string };
}

export type SseServerMessage = SseVlmEvent | SsePageEvent | SseCompleteEvent | SseErrorEvent;

export interface SamplePreset {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  headcount: number;
  setting: string;
  previewUrl: string;
  characterBible: string;
}
