// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/eslint", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/tailwind.css"],
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
});
