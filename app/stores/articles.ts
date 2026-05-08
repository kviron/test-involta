import { API_ENDPOINTS } from "../../shared/constants/api";
import {
  ARTICLES_CONFIG,
  ARTICLES_DATA_KEYS,
  ARTICLES_VIEW,
  type ArticlesView,
} from "../../shared/constants/articles";
import { COOKIE_KEYS, STORAGE_KEYS } from "../../shared/constants/storage";

export type ArticlesStore = {
  q: string;
  page: number;
  limit: number;
  source: string;
  isRefreshing: boolean;
  total: number;
  totalPages: number;
  view: ArticlesView;
};

export const useArticlesStore = defineStore<"articlesStore", ArticlesStore>(
  "articlesStore",
  {
    state: () => ({
      q: "",
      page: 1,
      limit: ARTICLES_CONFIG.DEFAULT_LIMIT,
      source: "",
      isRefreshing: false,
      total: 0,
      totalPages: 0,
      view: useCookie<ArticlesView>(COOKIE_KEYS.ARTICLES_VIEW, {
        default: () => ARTICLES_VIEW.GRID,
      }).value,
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
      setPage(page: number) {
        this.page = page;
      },
      setSource(source: string) {
        this.source = source;
        this.page = 1; // Сброс страницы при смене источника
      },
      setQ(q: string) {
        this.q = q;
        this.page = 1; // Сброс страницы при поиске
      },
      setView(view: ArticlesView) {
        this.view = view;
        useCookie<ArticlesView>(COOKIE_KEYS.ARTICLES_VIEW).value = view;
        if (import.meta.client) {
          localStorage.setItem(STORAGE_KEYS.ARTICLES_VIEW, view);
        }
      },
      setSearch(q: string) {
        this.q = q;
      },
      async reset() {
        if (this.isRefreshing) return;

        this.isRefreshing = true;
        try {
          this.source = "";
          this.q = "";

          // Обновляем принудительно кэш новостей что бы получить новые записи
          await $fetch(API_ENDPOINTS.ARTICLES_REFRESH, { method: "POST" });
          await Promise.allSettled([
            refreshNuxtData(ARTICLES_DATA_KEYS.ARTICLES),
            refreshNuxtData(ARTICLES_DATA_KEYS.SOURCES),
          ]);
        } finally {
          this.isRefreshing = false;
        }
      },
    },
  },
);
