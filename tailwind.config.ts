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
        paycash: {
          bg: "#F5F7FA",
          surface: "#FFFFFF",
          navy: "#002991",
          blue: "#0070E0",
          sky: "#60CDFF",
          paleSky: "#B8E9FF",
          text: "#000000",
          muted: "#686A6D",
          border: "#E6E7E8",
          success: "#007A56",
          warning: "#F59E0B",
          error: "#C0212B",
          surfaceGrey: "#EDF0F2",
          surfaceLightBlue: "#F0F2F9",
          warmIvory: "#F1EFEA",
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "rgba(0, 0, 0, 0.08) 0px 24px 48px 0px",
        elevated: "rgba(0, 0, 0, 0.15) 0px 8px 24px",
      },
      borderRadius: {
        pill: "1000px",
      },
    },
  },
  plugins: [],
};

export default config;