import type { Metadata } from "next";
import "./globals.css";
import { RefractProvider } from "@/context/RefractContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Refract — Family Vacation Photo to Kids' Coloring Book Studio",
  description:
    "Transform cherished family vacation photos into crisp, 4-page printable coloring books with progressive SSE streaming and FinOps telemetry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 antialiased selection:bg-studio-accent selection:text-white">
        <RefractProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="w-full border-t border-white/10 glass-panel py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>
                <strong className="text-white font-bold">Refract</strong> • Built with Next.js 15, Gemma 4 VLM &amp; Modal T4 Serverless Diffusion
              </p>
              <p className="font-mono text-[11px] text-slate-400">
                NVIDIA T4 @ $0.000164/s • Pure #000000 on #FFFFFF Vector Art
              </p>
            </div>
          </footer>
        </RefractProvider>
      </body>
    </html>
  );
}
