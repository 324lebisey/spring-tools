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
        spring: {
          green: {
            50: "#e8f5e9",
            100: "#c8e6c9",
            200: "#a5d6a7",
            300: "#81c784",
            400: "#66bb6a",
            500: "#43a047",
            600: "#2e7d32",
            700: "#1b5e20",
          },
          orange: {
            400: "#ff8a65",
            500: "#e65100",
          },
          pink: {
            50: "#fce4ec",
            100: "#f8bbd0",
            400: "#ec407a",
            500: "#ad1457",
          },
          yellow: {
            50: "#fff9c4",
            100: "#fff59d",
          },
          cyan: {
            50: "#e0f7fa",
            100: "#b2ebf2",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
