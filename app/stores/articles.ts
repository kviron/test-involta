type ArticlesView = "list" | "grid";

const ARTICLES_VIEW_STORAGE_KEY = "articles:view";
const ARTICLES_VIEW_COOKIE_KEY = "articles:view";

export const useArticlesStore = defineStore("articlesStore", {
  state: () => ({
    q: "",
    page: 1,
    limit: 4,
    source: "",
    isRefreshing: false,
    total: 0,
    totalPages: 0,
    view: useCookie<ArticlesView>(ARTICLES_VIEW_COOKIE_KEY, {
      default: () => "grid",
    }).value as ArticlesView,
  }),
  actions: {
    setPagination(payload: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    }) {
      if (payload.page !== undefined) this.page = payload.page;
      if (payload.limit !== undefined) this.limit = payload.limit;
      if (payload.total !== undefined) this.total = payload.total;
      if (payload.totalPages !== undefined)
        this.totalPages = payload.totalPages;
    },
    setSource(source: string) {
      this.source = source;
    },
    setView(view: ArticlesView) {
      this.view = view;
      useCookie<ArticlesView>(ARTICLES_VIEW_COOKIE_KEY).value = view;
      if (import.meta.client) {
        localStorage.setItem(ARTICLES_VIEW_STORAGE_KEY, view);
      }
    },
    setSearch(q: string) {
      this.q = q;
    },
    async reset() {
      if (this.isRefreshing) return;

      this.isRefreshing = true;
      try {
      this.setSource("");
      this.setSearch("");
      this.setPagination({ page: 1 });

      await $fetch("/api/articles/refresh", { method: "POST" });
      await Promise.all([
        refreshNuxtData("articles"),
        refreshNuxtData("article-sources"),
      ]);
      } finally {
        this.isRefreshing = false;
      }
    },
  },
});
