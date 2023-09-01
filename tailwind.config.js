/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,css,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {},
    },
  },
  plugins: [require("flowbite/plugin")],
};
