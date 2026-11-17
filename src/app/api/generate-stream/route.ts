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

  // --- Production Real Asset & Mock SSE Streamer ---
  const speedMultiplier = Number(body.speedMultiplier) > 0 ? Number(body.speedMultiplier) : 4;
  const inputImageUrl = body.input_image_url || "/samples/pack-family-5/images.jpg";
  const setting = body.setting || "Sunny Tropical Beach";
  const headcount = Number(body.headcount) || 5;

  const isPack5 =
    inputImageUrl.includes("pack-family-5") ||
    inputImageUrl.includes("Refract_Vacation_Coloring_Pack (1)") ||
    inputImageUrl.includes("images.jpg") ||
    inputImageUrl.includes("beach-family");

  const isPack3 =
    inputImageUrl.includes("pack-family-3") ||
    inputImageUrl.includes("Refract_Vacation_Coloring_Pack (2)") ||
    inputImageUrl.includes("istockphoto");

  const runId = "run_" + Math.random().toString(36).substring(2, 9);
  const startTime = Date.now();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(15, ms / speedMultiplier)));

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        let vlmTtft = 2341.6;
        let vlmStreamMs = 17033.8;
        let vlmTokensPerSec = 41.9;
        let promptTokens = 705;
        let outputTokens = 811;
        let characterBible = "";

        if (isPack5) {
          characterBible =
            "1. Father (far left): Bald, trimmed brown beard, white linen button-down shirt, tan cargo shorts, warm relaxed smile.\n2. Mother (center-left): Long wavy dark brunette hair, navy-and-white striped sleeveless midi dress, joyful expression.\n3. Daughter 1 (center): Long dark brown hair, striped matching beach sundress, standing in shallow ocean surf.\n4. Son (center-right): Short light brown hair, checkered short-sleeve collared shirt, tan shorts, laughing.\n5. Daughter 2 (far right): Curly golden-brown hair, pastel floral sun-dress, holding hands with sister in ocean waves.";
        } else if (isPack3) {
          vlmTtft = 1469.1;
          vlmStreamMs = 15650.9;
          vlmTokensPerSec = 43.7;
          promptTokens = 796;
          outputTokens = 749;
          characterBible =
            "1. Mother (left): Natural textured afro hair, yellow sleeveless linen top, denim shorts, radiant beach smile.\n2. Daughter (center): Wavy shoulder-length brown hair, patterned ocean dress, arms raised joyfully in shallow waves.\n3. Father (right): Short athletic hair, lightweight button-up island shirt, relaxed boardshorts, holding daughter's hand.";
        } else {
          vlmTtft = 1240;
          vlmStreamMs = 3880;
          vlmTokensPerSec = 40.9;
          promptTokens = 528;
          outputTokens = 159;
          characterBible =
            `1. Parent 1: Outdoor vacation attire, warm smile, standing left.\n2. Parent 2: Sun hat, summer dress, joyful expression.\n3. Children (center): Colorful shirts, playing enthusiastically in ${setting}.`;
        }

        const vlmTotalMs = vlmTtft + vlmStreamMs;

        // Step 1: Simulate TTFT
        await sleep(vlmTtft);

        const vlmPayload: VlmAnalysis = {
          active_vlm_model: "gemma-4-26b-a4b-it",
          exact_headcount: isPack5 ? 5 : isPack3 ? 3 : headcount,
          vacation_setting: setting,
          character_bible: characterBible,
          vlm_ttft_ms: vlmTtft,
          vlm_total_ms: vlmTotalMs,
          tokens_per_sec: vlmTokensPerSec,
          prompt_tokens: promptTokens,
          output_tokens: outputTokens,
          confidence_score: 0.985,
        };

        sendEvent("vlm_status", vlmPayload);

        // Finish remaining VLM analysis stream delay
        await sleep(vlmStreamMs);

        // Step 2: Stream 4 Progressive Coloring Pages
        let pageConfigs: Array<{
          variant: 1 | 2 | 3 | 4;
          title: string;
          mode: "img2img_faithful" | "txt2img_adventure";
          scene_action: string;
          ksampler_ms: number;
          vae_decode_ms: number;
          cost_usd: number;
          prompt: string;
          imageUrl: string;
          seed: number;
          resolution: string;
        }> = [];

        if (isPack5) {
          pageConfigs = [
            {
              variant: 1,
              title: "Faithful Keepsake Portrait",
              mode: "img2img_faithful",
              scene_action: "The family stands together in the ocean waves, mimicking the original photo's pose with exact character fidelity.",
              ksampler_ms: 36340,
              vae_decode_ms: 920,
              cost_usd: 0.01281,
              prompt: "Coloring book page, bold #000000 black ink outlines on a pure #FFFFFF white background. A family of five standing in shallow ocean waves. Thick lines, large open spaces for coloring, high contrast, simple details.",
              imageUrl: "/samples/pack-family-5/01_faithful_keepsake_portrait.png",
              seed: 180703703849778,
              resolution: "368x544",
            },
            {
              variant: 2,
              title: "Sandcastle Architects",
              mode: "txt2img_adventure",
              scene_action: "The family is actively building a massive, elaborate sandcastle on the beach together with buckets and shovels.",
              ksampler_ms: 35357,
              vae_decode_ms: 960,
              cost_usd: 0.012058,
              prompt: "Coloring book page, crisp #000000 black ink line art on a pure #FFFFFF white background. The family of five are kneeling on the sand, building a giant sandcastle with buckets and shovels. Dynamic angle, storybook style, bold outlines.",
              imageUrl: "/samples/pack-family-5/02_sandcastle_architects.png",
              seed: 85545222457286,
              resolution: "368x544",
            },
            {
              variant: 3,
              title: "Ocean Friends Playtime",
              mode: "txt2img_adventure",
              scene_action: "The family is playfully splashing in the waves with friendly dolphins jumping nearby in ocean surf.",
              ksampler_ms: 34368,
              vae_decode_ms: 966,
              cost_usd: 0.011926,
              prompt: "Coloring book page, bold #000000 ink lines on a flat #FFFFFF white background. The family of five splashing in ocean waves with friendly dolphins jumping in background. Whimsical cartoon style, thick lines, expressive faces.",
              imageUrl: "/samples/pack-family-5/03_ocean_friends_playtime.png",
              seed: 242602428482158,
              resolution: "368x544",
            },
            {
              variant: 4,
              title: "Beach Day Souvenir",
              mode: "txt2img_adventure",
              scene_action: "The family is cheering in a celebratory group pose, framed by a decorative hand-drawn border of seashells and suns.",
              ksampler_ms: 35029,
              vae_decode_ms: 937,
              cost_usd: 0.012028,
              prompt: "Coloring book page, #000000 black ink on #FFFFFF white. The family of five cheering and smiling in celebratory group pose surrounded by decorative hand-drawn border of seashells, starfish, and sun icons. High contrast, clean lines.",
              imageUrl: "/samples/pack-family-5/04_beach_day_souvenir.png",
              seed: 187352021450410,
              resolution: "368x544",
            },
          ];
        } else if (isPack3) {
          pageConfigs = [
            {
              variant: 1,
              title: "Faithful Keepsake Portrait",
              mode: "img2img_faithful",
              scene_action: "The family recreates their original pose on the beach with exact left-to-right character styling.",
              ksampler_ms: 8407,
              vae_decode_ms: 244,
              cost_usd: 0.002194,
              prompt: "Three people together, one adult female with afro hair, one child, and one adult male. Bold #000000 black ink outlines, pure #FFFFFF unshaded white interiors. Posing on beach with ocean waves.",
              imageUrl: "/samples/pack-family-3/01_faithful_keepsake_portrait.png",
              seed: 210011811705191,
              resolution: "608x416",
            },
            {
              variant: 2,
              title: "Action Adventure Scene",
              mode: "txt2img_adventure",
              scene_action: "The family is building a giant sandcastle together with towers and beach flags.",
              ksampler_ms: 32176,
              vae_decode_ms: 261,
              cost_usd: 0.010507,
              prompt: "Three people kneeling around massive detailed sandcastle with buckets and shovels. Bold #000000 black ink outlines, pure #FFFFFF unshaded white interiors. Crisp storybook line art style.",
              imageUrl: "/samples/pack-family-3/02_action_adventure_scene.png",
              seed: 156254422869066,
              resolution: "608x416",
            },
            {
              variant: 3,
              title: "Whimsical Playful Moment",
              mode: "txt2img_adventure",
              scene_action: "The family is splashing joyfully in the waves with playful dolphins leaping.",
              ksampler_ms: 32164,
              vae_decode_ms: 290,
              cost_usd: 0.010615,
              prompt: "Three people splashing joyfully in shallow ocean waves while friendly dolphins leap in background. Bold #000000 black ink outlines, pure #FFFFFF unshaded interiors. Whimsical cartoon style.",
              imageUrl: "/samples/pack-family-3/03_whimsical_playful_moment.png",
              seed: 238080375264315,
              resolution: "608x416",
            },
            {
              variant: 4,
              title: "Framed Souvenir Poster",
              mode: "txt2img_adventure",
              scene_action: "The family is cheering in a celebratory pose within an ornate hand-drawn souvenir coloring frame.",
              ksampler_ms: 32207,
              vae_decode_ms: 333,
              cost_usd: 0.010601,
              prompt: "Three people cheering with arms raised in celebratory group pose surrounded by hand-drawn coloring border of seashells, suns, and travel doodles. Bold #000000 black ink outlines.",
              imageUrl: "/samples/pack-family-3/04_framed_souvenir_poster.png",
              seed: 117965645890203,
              resolution: "608x416",
            },
          ];
        } else {
          // Fallback for arbitrary custom photos
          pageConfigs = [1, 2, 3, 4].map((v) => ({
            variant: v as 1 | 2 | 3 | 4,
            title:
              v === 1
                ? "Faithful Keepsake Portrait"
                : v === 2
                ? "Sandcastle Architects"
                : v === 3
                ? "Ocean Friends Playtime"
                : "Beach Day Souvenir",
            mode: v === 1 ? ("img2img_faithful" as const) : ("txt2img_adventure" as const),
            scene_action: `Custom coloring page variant #${v} in ${setting}`,
            ksampler_ms: 7800 + v * 100,
            vae_decode_ms: 1100,
            cost_usd: 0.00147,
            prompt: `Coloring book page, clean black #000000 outlines on pure #FFFFFF white background. Vacation memory in ${setting}.`,
            imageUrl: svgToDataUrl(
              generateColoringSvg({
                variantIndex: v as 1 | 2 | 3 | 4,
                pageTitle: v === 1 ? "Keepsake Portrait" : `Adventure Scene #${v}`,
                setting,
                headcount,
              })
            ),
            seed: Math.floor(Math.random() * 100000000000000),
            resolution: "800x1050",
          }));
        }

        const generatedPages: PageResult[] = [];

        for (const config of pageConfigs) {
          const totalRenderMs = config.ksampler_ms + config.vae_decode_ms;

          // Sleep diffusion duration
          await sleep(totalRenderMs);

          const pageResult: PageResult = {
            variant_index: config.variant,
            page_title: config.title,
            mode: config.mode,
            scene_action: config.scene_action,
            image_data_url: config.imageUrl,
            ksampler_ms: config.ksampler_ms,
            vae_decode_ms: config.vae_decode_ms,
            total_render_ms: totalRenderMs,
            cost_usd: config.cost_usd,
            prompt_used: config.prompt,
            seed: config.seed,
            resolution: config.resolution,
          };

          generatedPages.push(pageResult);
          sendEvent("page_ready", pageResult);
        }

        // Final Aggregate Telemetry
        const totalDurationSec = Number(((Date.now() - startTime) / 1000).toFixed(2));
        const totalPackCostUsd = Number(
          generatedPages.reduce((acc, p) => acc + p.cost_usd, 0).toFixed(5)
        );
        const packsPerDollar = Math.max(1, Math.round(1 / totalPackCostUsd));

        const telemetryPayload: RunTelemetry = {
          run_id: runId,
          timestamp: new Date().toISOString(),
          input_preview_url: inputImageUrl,
          active_vlm_model: "gemma-4-26b-a4b-it",
          exact_headcount: isPack5 ? 5 : isPack3 ? 3 : headcount,
          character_bible: characterBible,
          vacation_setting: setting,
          vlm_ttft_ms: vlmTtft,
          vlm_total_ms: vlmTotalMs,
          tokens_per_sec: vlmTokensPerSec,
          prompt_tokens: promptTokens,
          output_tokens: outputTokens,
          pages: generatedPages,
          total_e2e_sec: totalDurationSec,
          total_pack_cost_usd: totalPackCostUsd,
          packs_per_dollar: packsPerDollar,
          warmup_overlap_sec: 1.2,
          raw_telemetry_json: {
            gpu_model: "Tesla T4",
            active_vlm_model: "gemma-4-26b-a4b-it",
            timing: {
              vlm_ttft_ms: vlmTtft,
              vlm_total_ms: vlmTotalMs,
              total_e2e_sec: totalDurationSec,
            },
            cost_summary: {
              total_pack_cost_usd: totalPackCostUsd,
              packs_per_dollar: packsPerDollar,
            },
            variants: generatedPages.map((p) => ({
              variant: p.variant_index,
              title: p.page_title,
              seed: p.seed,
              render_sec: Number((p.total_render_ms / 1000).toFixed(2)),
              cost_usd: p.cost_usd,
            })),
          },
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
