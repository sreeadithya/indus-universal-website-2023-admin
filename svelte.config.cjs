import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
const netlify = require("@sveltejs/adapter-netlify");

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],
  kit: {
    adapter: netlify(),
  },
};

export default config;
