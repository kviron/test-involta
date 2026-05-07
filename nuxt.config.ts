import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      "*/5 * * * *": ["update-rss"],
    },
  },
  modules: ["@pinia/nuxt", "@nuxt/eslint", "@nuxtjs/tailwindcss", "@nuxt/image"],
  css: ["~/assets/css/main.css"],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  sourcemap: {
    client: true,
    server: true,
  },
  runtimeConfig: {
    rss: {
      mosUrl: "https://www.mos.ru/rss",
      lentaUrl: "https://lenta.ru/rss",
    },
  },
  vite: {
    plugins: [
      svgLoader({
        svgoConfig: {
          plugins: [
            "preset-default",
            {
              name: "removeAttrs",
              params: {
                attrs: "*:fill",
              },
            },
            {
              name: "addAttributesToSVGElement",
              params: {
                attributes: [{ fill: "currentColor" }],
              },
            },
          ],
        },
      }),
    ],
  },
});