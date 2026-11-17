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
      <body className="min-h-screen flex flex-col bg-paper-50 text-paper-900 antialiased selection:bg-studio-accent selection:text-white">
        <RefractProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="w-full border-t border-paper-300 bg-paper-100/60 py-6 text-center text-xs text-paper-800/80">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                <strong>Refract</strong> • Built with Next.js 15, Gemma 4 VLM &amp; Modal T4 Serverless Diffusion
              </p>
              <p className="font-mono text-[11px]">
                NVIDIA T4 @ $0.000164/s • Pure #000000 on #FFFFFF Coloring Art
              </p>
            </div>
          </footer>
        </RefractProvider>
      </body>
    </html>
  );
}
