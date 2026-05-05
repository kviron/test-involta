// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/eslint"],
  css: ["./app/assets/styles/global.css"],
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
    public: {
      rssDefaults: {
        mosUrl: "https://www.mos.ru/rss",
        lentaUrl: "https://lenta.ru/rss",
      },
    },
  },
});
