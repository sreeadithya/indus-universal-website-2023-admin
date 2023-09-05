/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        darkgray: "#17191C",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
};
