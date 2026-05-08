import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{tsx,ts}", "./components/**/*.{tsx,ts}"],
  theme: {
    extend: {
      colors: {
        "deep-sea": "#1B3A4B",
        lagoon: "#2D6A7F",
        moss: "#4A5C3F",
        canopy: "#7B9E6B",
        sand: "#D4C5A9",
        shell: "#F2EDE4",
        tide: "#E8DFD0",
        ink: "#1A1F1C",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        heading: ["Cormorant Garamond", "serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "wave-slow": "wave 8s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(-2%) translateY(-1%)" },
        },
      },
    },
  },
} satisfies Config;
