import { NextRequest, NextResponse } from "next/server";
import { WarmupStatus } from "@/types/refract";

// Global in-memory state for mock backend warmup
interface MockContainerState {
  state: "cold" | "warming" | "warm";
  startedAt: number | null;
  warmedAt: number | null;
  containerId: string;
}

const mockState: MockContainerState = {
  state: "cold",
  startedAt: null,
  warmedAt: null,
  containerId: "t4-modal-" + Math.random().toString(36).substring(2, 8),
};

const WARMUP_DURATION_MS = 2400; // Simulated cold start container provision time

export async function GET() {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_BACKEND !== "false";
  const modalWarmupUrl = process.env.NEXT_PUBLIC_MODAL_WARMUP_URL;

  // Real backend proxy if configured
  if (!useMock && modalWarmupUrl) {
    try {
      const res = await fetch(modalWarmupUrl, { method: "GET" });
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json(
        { state: "cold", error: err.message, gpu: "NVIDIA T4 (16GB)", elapsed_ms: 0 },
        { status: 502 }
      );
    }
  }

  // Check state transition
  const now = Date.now();
  if (mockState.state === "warming" && mockState.startedAt) {
    const elapsed = now - mockState.startedAt;
    if (elapsed >= WARMUP_DURATION_MS) {
      mockState.state = "warm";
      mockState.warmedAt = now;
    }
  }

  const elapsed = mockState.startedAt ? now - mockState.startedAt : 0;

  const response: WarmupStatus = {
    state: mockState.state,
    elapsed_ms: elapsed,
    gpu: "NVIDIA T4 (16GB)",
    container_id: mockState.containerId,
    last_ping: new Date().toISOString(),
  };

  return NextResponse.json(response);
}

export async function POST(req: NextRequest) {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_BACKEND !== "false";
  const modalWarmupUrl = process.env.NEXT_PUBLIC_MODAL_WARMUP_URL;

  // Real backend proxy if configured
  if (!useMock && modalWarmupUrl) {
    try {
      const res = await fetch(modalWarmupUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trigger: "intent_prewarm" }),
      });
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json(
        { state: "cold", error: err.message, gpu: "NVIDIA T4 (16GB)", elapsed_ms: 0 },
        { status: 502 }
      );
    }
  }

  // Initiate mock container warm up
  const now = Date.now();
  if (mockState.state === "cold") {
    mockState.state = "warming";
    mockState.startedAt = now;
  }

  const elapsed = mockState.startedAt ? now - mockState.startedAt : 0;
  if (elapsed >= WARMUP_DURATION_MS) {
    mockState.state = "warm";
    mockState.warmedAt = now;
  }

  const response: WarmupStatus = {
    state: mockState.state,
    elapsed_ms: elapsed,
    gpu: "NVIDIA T4 (16GB)",
    container_id: mockState.containerId,
    last_ping: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
