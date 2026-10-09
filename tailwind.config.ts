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
        presisso: {
          // Manual de marca 2026: blanco, crema, dorado, rojo, negro
          red: "#8B0001",
          "red-hover": "#6E0001",
          "red-light": "#F4E4E2",
          black: "#161616",
          white: "#FFFFFF",
          cream: "#EDE7E0",
          gold: "#CB9F71",
          "gray-light": "#EDE7E0",
          "gray-mid": "#6E6862",
          "gray-dark": "#2E2B29",
          border: "#E2DAD1",
          surface: "#F7F3EF",
        },
      },
      fontFamily: {
        sans: ["Jost", "Futura", '"Century Gothic"', "sans-serif"],
        heading: ["Jost", "Futura", '"Century Gothic"', "sans-serif"],
        body: ["Jost", "Futura", '"Century Gothic"', "sans-serif"],
      },
      // Manual 2026: una sola familia en Medium (títulos) y Light (textos)
      fontWeight: {
        semibold: "500",
        bold: "500",
        extrabold: "500",
        black: "500",
      },
      borderRadius: {
        presisso: "12px",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.08)",
        "red-glow": "0 8px 32px rgba(139,0,1,0.22)",
        "warm-lg": "0 20px 60px -10px rgba(0,0,0,0.14)",
        float: "0 12px 40px rgba(0,0,0,0.10)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.55s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
