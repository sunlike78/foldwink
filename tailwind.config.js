/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1115",
        surface: "#181b22",
        surfaceHi: "#22262f",
        text: "#e8eaf0",
        muted: "#8a8f9a",
        accent: "#7cc4ff",
        solved1: "#f5c86b",
        solved2: "#8cd28e",
        solved3: "#ef9e9e",
        solved4: "#b49cf0",
        danger: "#e66565",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
