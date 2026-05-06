import { useLocalStorage } from "@vueuse/core";

type ArticlesView = "list" | "grid";

const ARTICLES_VIEW_STORAGE_KEY = "articles:view";

export const useArticlesStore = defineStore("articlesStore", {
  state: () => ({
    search: "",
    page: 1,
    limit: 4,
    source: "",
    total: 0,
    totalPages: 0,
    view: useLocalStorage<ArticlesView>(ARTICLES_VIEW_STORAGE_KEY, "grid"),
  }),
  hydrate(state) {
    state.view = useLocalStorage<ArticlesView>(
      ARTICLES_VIEW_STORAGE_KEY,
      "grid",
    ).value;
  },
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
    },
    setSearch(search: string) {
      this.search = search;
    },
  },
});
