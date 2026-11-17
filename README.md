# Refract — Family Vacation Photo to Kids' Coloring Book Studio

> **Phase 1: Next.js Frontend & Interactive Server-Sent Events (SSE) Simulator**  
> Turn cherished family vacation snapshots into crisp, 4-page printable coloring book packs with live VLM character bible streaming and real-time GPU FinOps telemetry.

---

## 🌟 Key Features

1. **Editorial Tactile Landing Page (`src/app/page.tsx`)**
   - Interactive Before/After comparison slider showing a real vacation photo converted to crisp vector coloring lines (`#000000` on `#FFFFFF`).
   - **Intent-Driven Pre-Warm Trigger:** Clicking *"Start Coloring Studio"* immediately triggers a non-blocking `POST /api/warmup` (`keepalive: true`) and routes to `/studio`.
   - Real-time container status pill in top navbar (`Cold` $\rightarrow$ `Warming T4 Container...` $\rightarrow$ `T4 Ready`).

2. **Progressive Coloring Book Studio (`src/app/studio/page.tsx`)**
   - **Photo Upload & 1-Click Sample Presets:** Drag-and-drop custom photos or pick from 3 built-in vacation presets (*"Tropical Beach Family"*, *"Rocky Mountain Alpine Trail"*, *"Lakeside Twilight Campfire"*).
   - **Gemma 4 VLM Character Bible Stream:** Streams left-to-right character styling, headcount, vacation setting, TTFT, and token throughput live into the UI.
   - **Progressive 4-Slot Gallery (`ProgressiveGrid.tsx`):**
     - Slot 1: *Faithful Keepsake Portrait* (`img2img_faithful`)
     - Slot 2: *Sandcastle Architects* (`txt2img_adventure`)
     - Slot 3: *Ocean Friends Playtime* (`txt2img_adventure`)
     - Slot 4: *Beach Day Souvenir* (`txt2img_adventure`)
   - **Fast Demo Mode (4x Speed):** Toggle between 1x realistic NVIDIA T4 timing (~41s) and 4x Fast Demo Mode (~10s) for rapid interview demonstrations.
   - **Print & ZIP Exports:** Zoom modal for high-res inspection, native one-click browser printing (`window.print()`), individual SVG downloads, and complete 4-page `.zip` pack download powered by `jszip`.

3. **Dedicated Telemetry & FinOps Graph Tab (`src/app/telemetry/page.tsx`)**
   - **Persistent Run Store:** Generation runs are saved to React Context and `localStorage`, pre-seeded with 1 realistic benchmark run.
   - **Pipeline Latency Waterfall (Recharts):** Horizontal stacked bar chart visualizing Warmup Overlap, Gemma 4 TTFT, VLM token stream, and per-page KSampler vs. VAE Decode.
   - **Per-Page Time & Modal T4 Cost (Recharts):** Composed Bar + Line chart plotting render seconds against exact Modal compute cost ($0.000164/sec on NVIDIA T4).
   - **Unit-Economics KPI Cards:** Displays Cost per Page (~$0.0015), Cost per 4-Page Pack (~$0.0060), Packs per $1.00 (~167 packs), Active Model (`gemma-4-26b-a4b-it`), and Token Throughput (40.9 tok/s).

---

## 🔌 Plug-and-Play Backend Contract

Refract is designed frontend-first. The API routes (`/api/warmup` and `/api/generate-stream`) function with **zero external GPU or API keys required**, while adhering to an identical contract with Modal's real T4 + Gemma 4 backend.

### Environment Configuration (`.env.local`)

```bash
# Set to 'true' for local zero-dependency SSE simulation; 'false' to proxy Modal
NEXT_PUBLIC_USE_MOCK_BACKEND=true

# When deploying or pointing to real Modal GPU endpoints:
NEXT_PUBLIC_MODAL_WARMUP_URL=https://<your-modal-app>--refract-warmup.modal.run
NEXT_PUBLIC_MODAL_STREAM_URL=https://<your-modal-app>--refract-generate-stream.modal.run
```

Swapping in the real Modal backend requires changing **only these two URLs**.

---

## 📡 Shared SSE Stream Protocol

### Endpoint: `POST /api/generate-stream`

Accepts JSON payload:
```json
{
  "input_image_url": "/samples/beach-family.svg",
  "setting": "Sunny Maui Tropical Beach",
  "headcount": 5,
  "speedMultiplier": 4
}
```

Streams Server-Sent Events (`text/event-stream`):

#### 1. `event: vlm_status`
Emitted once Gemma 4 completes visual analysis:
```json
{
  "active_vlm_model": "gemma-4-26b-a4b-it",
  "exact_headcount": 5,
  "vacation_setting": "Sunny Maui Tropical Beach",
  "character_bible": "1. Father (left): Teal shirt...\n2. Daughter...",
  "vlm_ttft_ms": 1240,
  "vlm_total_ms": 5120,
  "tokens_per_sec": 40.9,
  "prompt_tokens": 528,
  "output_tokens": 159,
  "confidence_score": 0.985
}
```

#### 2. `event: page_ready` (Emitted 4 times sequentially)
Emitted as each coloring page finishes KSampler + VAE decode:
```json
{
  "variant_index": 1,
  "page_title": "Faithful Keepsake Portrait",
  "mode": "img2img_faithful",
  "scene_action": "High-fidelity family portrait...",
  "image_data_url": "data:image/svg+xml;base64,...",
  "ksampler_ms": 7850,
  "vae_decode_ms": 1120,
  "total_render_ms": 8970,
  "cost_usd": 0.001471,
  "prompt_used": "coloring book line art, faithful family portrait..."
}
```

#### 3. `event: telemetry_complete`
Emitted at the end with aggregate FinOps data:
```json
{
  "run_id": "run_9ab7c1",
  "timestamp": "2026-11-17T06:20:00.000Z",
  "input_preview_url": "/samples/beach-family.svg",
  "active_vlm_model": "gemma-4-26b-a4b-it",
  "exact_headcount": 5,
  "pages": [...],
  "total_e2e_sec": 10.42,
  "total_pack_cost_usd": 0.005977,
  "packs_per_dollar": 167
}
```

---

## 💰 Unit Economics & Modal T4 Pricing Breakdown

| Metric | Measurement / Formula | Value |
|---|---|---|
| **Modal NVIDIA T4 Rate** | Per-second active billing | `$0.000164 / sec` |
| **KSampler (4-Step)** | SDXL Lightning / Turbo | `~7.9s` |
| **VAE Decode** | Full FP16 decode | `~1.1s` |
| **Cost Per Coloring Page** | `(9.0s × $0.000164)` | **`~$0.00147`** |
| **Complete 4-Page Pack Cost** | `(4 × $0.00147) + VLM` | **`~$0.0060`** |
| **Packs Per $1.00 USD** | `1 / $0.0060` | **`~167 Packs`** |

---

## 🛠️ Project Structure

```
refract/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── .env.local
├── public/
│   └── samples/
│       ├── beach-family.svg       # Maui Beach sample preset
│       ├── mountain-hike.svg      # Rocky Mountain trail sample preset
│       └── lake-camping.svg       # Lake Tahoe campfire sample preset
├── src/
│   ├── types/
│   │   └── refract.ts             # Shared SSE, PageResult, and RunTelemetry types
│   ├── context/
│   │   └── RefractContext.tsx     # Global warmup, active SSE stream, & run store
│   ├── lib/
│   │   └── mockColoringSvg.ts     # Crisp #000000/#FFFFFF printable coloring SVGs
│   ├── components/
│   │   ├── Navbar.tsx             # Top nav + live T4 container status pill & modal
│   │   ├── ProgressiveGrid.tsx    # 4-slot progressive gallery, zoom modal, ZIP export
│   │   └── TelemetryCharts.tsx    # Recharts latency waterfall, cost chart, & KPIs
│   └── app/
│       ├── globals.css            # Tactile paper theme & custom scrollbars
│       ├── layout.tsx             # Root layout wrapping RefractProvider & Navbar
│       ├── page.tsx               # Editorial landing page + before/after slider
│       ├── studio/page.tsx        # Photo upload/presets, VLM card, progressive gallery
│       ├── telemetry/page.tsx     # Recharts waterfall & per-page FinOps tab
│       └── api/
│           ├── warmup/route.ts    # Simulates Modal T4 cold-to-warm state transition
│           └── generate-stream/route.ts # SSE route (vlm_status -> 4x page_ready -> telemetry)
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Verification
```bash
npm run build
npm run start
```
