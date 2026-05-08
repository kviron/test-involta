import type { Ref } from "vue";
import type { Article, Source } from "../../types/articles";
import { toPositiveInt } from "../utils/validation";

export type UseArticlesOptions = {
  page: Ref<number>;
  limit: Ref<number>;
  source: Ref<string>;
  searchQuery: Ref<string>;
  onPaginationUpdate: (pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }) => void;
};

export const useArticles = (options: UseArticlesOptions) => {
  const { page, limit, source, searchQuery, onPaginationUpdate } = options;

  const { data: sources } = useAsyncData<Source[]>("article-sources", () =>
    $fetch<Source[]>("/api/articles/sources"),
  );

  const { data: articles, refresh } = useAsyncData<Article[]>(
    "articles",
    async (_nuxtApp, { signal }) => {
      const response = await $fetch.raw<Article[]>("/api/articles", {
        signal,
        params: {
          page: page.value,
          limit: limit.value,
          ...(source.value ? { source: source.value } : {}),
          ...(searchQuery.value.trim()
            ? { q: searchQuery.value.trim() }
            : {}),
        },
      });

      onPaginationUpdate({
        total: toPositiveInt(response.headers.get("x-total-count"), 0),
        totalPages: toPositiveInt(response.headers.get("x-total-pages"), 0),
        page: toPositiveInt(response.headers.get("x-page"), 1),
        limit: toPositiveInt(response.headers.get("x-limit"), 4),
      });

      return response._data ?? [];
    },
    {
      watch: [page, limit, source, searchQuery],
    },
  );

  return {
    articles,
    sources,
    refresh,
  };
};
