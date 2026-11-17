import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: {
          50: "#FAF8F5",
          100: "#F5F2EC",
          200: "#EBE5DB",
          300: "#DDD4C4",
          800: "#2B2825",
          900: "#1A1917",
        },
        studio: {
          accent: "#F97316", // warm vibrant orange/amber for family & creativity
          dark: "#0F172A",
          muted: "#64748B",
          card: "#FFFFFF",
          border: "#E2E8F0",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
