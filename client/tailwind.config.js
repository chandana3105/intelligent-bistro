/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gold: "#D4A853",
        "bistro-dark": "#1A1008",
        "bistro-card": "#211508",
      },
    },
  },
  plugins: [],
};
