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
          red: "#D42B2B",
          "red-hover": "#B82424",
          "red-light": "#FDF2F2",
          black: "#1A1A1A",
          white: "#FFFFFF",
          "gray-light": "#F5F5F3",
          "gray-mid": "#6B6B6B",
          "gray-dark": "#333333",
          border: "#E5E5E5",
          surface: "#FAFAF9",
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
      borderRadius: {
        presisso: "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
