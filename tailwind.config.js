/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,js,svelte,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        darkgray: "#17191C",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
