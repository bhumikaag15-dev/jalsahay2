/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#38BDF8",
        accent: "#06B6D4",
        darkbg: "#0F172A",
        darkcard: "rgba(30, 41, 59, 0.7)"
      },
      backdropBlur: {
        glass: "16px"
      }
    }
  },
  plugins: []
};