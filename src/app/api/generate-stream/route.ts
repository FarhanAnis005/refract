import { NextRequest } from "next/server";
import { generateColoringSvg, svgToDataUrl } from "@/lib/mockColoringSvg";
import { PageResult, RunTelemetry, VlmAnalysis } from "@/types/refract";

// Modal T4 Compute Pricing ($/sec)
const T4_USD_PER_SEC = 0.000164;

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_BACKEND !== "false";
  const modalStreamUrl = process.env.NEXT_PUBLIC_MODAL_STREAM_URL;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  // Plug-and-play proxy to real Modal T4 endpoint if enabled
  if (!useMock && modalStreamUrl) {
    try {
      const response = await fetch(modalStreamUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    } catch (err: any) {
      return new Response(
        `event: error\ndata: ${JSON.stringify({ message: "Modal Proxy Error: " + err.message })}\n\n`,
        {
          status: 502,
          headers: { "Content-Type": "text/event-stream" },
        }
      );
    }
  }

  // --- Realistic Local Mock SSE Streamer ---
  const speedMultiplier = Number(body.speedMultiplier) > 0 ? Number(body.speedMultiplier) : 1;
  const inputImageUrl = body.input_image_url || "/samples/beach-family.svg";
  const setting = body.setting || "Sunny Tropical Beach";
  const headcount = Number(body.headcount) || 4;

  const runId = "run_" + Math.random().toString(36).substring(2, 9);
  const startTime = Date.now();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(20, ms / speedMultiplier)));

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Step 1: Simulate Gemma 4 VLM Analysis
        // Realistic Gemma 4 26B A4B-IT metrics:
        // TTFT ~1200ms, stream tokens @ 40.9 tok/s, prompt 512 tok, output ~168 tok
        const vlmTtft = 1240;
        const vlmStreamMs = 3880;
        const vlmTotalMs = vlmTtft + vlmStreamMs;
        const tokensPerSec = 40.9;
        const outputTokens = Math.round((vlmStreamMs / 1000) * tokensPerSec);
        const promptTokens = 528;

        // Wait TTFT
        await sleep(vlmTtft);

        const characterBible =
          headcount >= 5
            ? "1. Father (left): Teal hibiscus shirt, dark wayfarer sunglasses, relaxed posture.\n2. Daughter (mid-left): Yellow sundress, braided chestnut hair, curious smile.\n3. Son (center): Royal blue tee, reversed red baseball cap, beach ball in hands.\n4. Mother (mid-right): Coral wrap dress, wide-brim straw hat, bright smile.\n5. Toddler (right): Mint green romper, green bucket, barefoot."
            : "1. Father (left): Navy expedition jacket, khaki cargo shorts, hiking pole, warm grin.\n2. Mother (center-left): Magenta fleece vest, dark trail tights, joyful expression.\n3. Junior Boy (center-right): Pine green outdoor tee, small blue daypack, energetic pose.\n4. Daughter (right): Violet sweater, carrying yellow toy camera, curious gaze.";

        const vlmPayload: VlmAnalysis = {
          active_vlm_model: "gemma-4-26b-a4b-it",
          exact_headcount: headcount,
          vacation_setting: setting,
          character_bible: characterBible,
          vlm_ttft_ms: vlmTtft,
          vlm_total_ms: vlmTotalMs,
          tokens_per_sec: tokensPerSec,
          prompt_tokens: promptTokens,
          output_tokens: outputTokens,
          confidence_score: 0.985,
        };

        sendEvent("vlm_status", vlmPayload);

        // Finish remaining VLM analysis stream delay
        await sleep(vlmStreamMs);

        // Step 2: Stream 4 Progressive Coloring Pages
        const pageConfigs: Array<{
          variant: 1 | 2 | 3 | 4;
          title: string;
          mode: "img2img_faithful" | "txt2img_adventure";
          scene_action: string;
          ksampler_ms: number;
          vae_decode_ms: number;
          prompt: string;
        }> = [
          {
            variant: 1,
            title: "Faithful Keepsake Portrait",
            mode: "img2img_faithful",
            scene_action: "High-fidelity family portrait preserving exact left-to-right character positioning, smiles, and vacation attire in crisp line-art",
            ksampler_ms: 7850,
            vae_decode_ms: 1120,
            prompt: `coloring book line art, faithful family portrait on ${setting}, clean bold black outlines, pure white fill, zero shading, 8k coloring page, high fidelity`,
          },
          {
            variant: 2,
            title: "Sandcastle Architects",
            mode: "txt2img_adventure",
            scene_action: "Action adventure of kids erecting a multi-tiered fortress sandcastle with towers, flags, shovels, and a friendly crab assistant",
            ksampler_ms: 8150,
            vae_decode_ms: 1140,
            prompt: `coloring book illustration, children building a giant sandcastle fortress with turrets and flags, plastic buckets and shovels, ocean beach background, clean black outlines, high contrast`,
          },
          {
            variant: 3,
            title: "Ocean Friends Playtime",
            mode: "txt2img_adventure",
            scene_action: "Underwater fantasy snorkeling adventure with sea turtles, leaping dolphins, tropical fish, and coral reef outlines",
            ksampler_ms: 8020,
            vae_decode_ms: 1130,
            prompt: `coloring book page, kid snorkeling underwater with cheerful sea turtle, jumping dolphin, friendly tropical fish, coral reef, bubbles, crisp coloring book outlines, printable`,
          },
          {
            variant: 4,
            title: "Beach Day Souvenir",
            mode: "txt2img_adventure",
            scene_action: "Sunset campfire celebration with marshmallow roasting, tropical palm trees, and decorative VACATION MEMORIES souvenir banner",
            ksampler_ms: 7920,
            vae_decode_ms: 1110,
            prompt: `coloring book page, cozy beach campfire at sunset with palm trees, kids roasting marshmallows, banner reading VACATION MEMORIES, bold clean outlines, pure white background`,
          },
        ];

        const generatedPages: PageResult[] = [];

        for (const config of pageConfigs) {
          const totalRenderMs = config.ksampler_ms + config.vae_decode_ms;
          const costUsd = Number(((totalRenderMs / 1000) * T4_USD_PER_SEC).toFixed(6));

          // Wait for diffusion render delay
          await sleep(totalRenderMs);

          const svgContent = generateColoringSvg({
            variantIndex: config.variant,
            pageTitle: config.title,
            setting,
            headcount,
          });

          const dataUrl = svgToDataUrl(svgContent);

          const pageResult: PageResult = {
            variant_index: config.variant,
            page_title: config.title,
            mode: config.mode,
            scene_action: config.scene_action,
            image_data_url: dataUrl,
            ksampler_ms: config.ksampler_ms,
            vae_decode_ms: config.vae_decode_ms,
            total_render_ms: totalRenderMs,
            cost_usd: costUsd,
            prompt_used: config.prompt,
          };

          generatedPages.push(pageResult);
          sendEvent("page_ready", pageResult);
        }

        // Step 3: Emit final RunTelemetry
        const totalDurationSec = Number(((Date.now() - startTime) / 1000).toFixed(2));
        const totalPackCostUsd = Number(
          generatedPages.reduce((acc, p) => acc + p.cost_usd, 0).toFixed(5)
        );
        const packsPerDollar = Math.round(1 / totalPackCostUsd);

        const telemetryPayload: RunTelemetry = {
          run_id: runId,
          timestamp: new Date().toISOString(),
          input_preview_url: inputImageUrl,
          active_vlm_model: "gemma-4-26b-a4b-it",
          exact_headcount: headcount,
          character_bible: characterBible,
          vacation_setting: setting,
          vlm_ttft_ms: vlmTtft,
          vlm_total_ms: vlmTotalMs,
          tokens_per_sec: tokensPerSec,
          prompt_tokens: promptTokens,
          output_tokens: outputTokens,
          pages: generatedPages,
          total_e2e_sec: totalDurationSec,
          total_pack_cost_usd: totalPackCostUsd,
          packs_per_dollar: packsPerDollar,
          warmup_overlap_sec: 1.2,
        };

        sendEvent("telemetry_complete", telemetryPayload);
      } catch (err: any) {
        sendEvent("error", { message: err.message || "Unknown streaming error occurred" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
