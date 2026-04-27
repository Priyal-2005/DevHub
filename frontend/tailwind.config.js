/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        panel: "#0f172a",
        line: "#1e293b",
        brand: "#22c55e",
        accent: "#38bdf8",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(34, 197, 94, 0.18)",
      },
    },
  },
  plugins: [],
};
