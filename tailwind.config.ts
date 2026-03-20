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
          red: "#DF0A0A",
          "red-hover": "#C50909",
          "red-light": "#FEF0F0",
          black: "#1A1A1A",
          white: "#FFFFFF",
          cream: "#FAF8F6",
          "gray-light": "#F5F5F3",
          "gray-mid": "#6B6B6B",
          "gray-dark": "#333333",
          border: "#E8E8E5",
          surface: "#FAFAF9",
        },
      },
      fontFamily: {
        sans: ["Futura", '"Century Gothic"', "Jost", "sans-serif"],
        heading: ["Futura", '"Century Gothic"', "Jost", "sans-serif"],
        body: ["Futura", '"Century Gothic"', "Jost", "sans-serif"],
      },
      borderRadius: {
        presisso: "12px",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.08)",
        "red-glow": "0 8px 32px rgba(223,10,10,0.22)",
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
