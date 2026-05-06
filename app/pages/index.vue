<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Article, Source } from "../../server/utils/rss";
import { useArticlesQuerySync } from "../composables/useArticlesQuerySync";

const articlesStore = useArticlesStore();
const { page, limit, source, totalPages } = storeToRefs(articlesStore);

const toInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

useArticlesQuerySync({
  page,
  source,
  setPage: (nextPage: number) =>
    articlesStore.setPagination({ page: nextPage }),
  setSource: (nextSource: string) => articlesStore.setSource(nextSource),
});

const { data: sources } = await useAsyncData<Source[]>("article-sources", () =>
  $fetch<Source[]>("/api/articles/sources" as string),
);

const { data: articles, status } = await useAsyncData<Article[]>(
  "articles",
  async (_nuxtApp, { signal }) => {
    const response = await $fetch.raw<Article[]>("/api/articles", {
      signal,
      params: {
        page: page.value,
        limit: limit.value,
        ...(source.value ? { source: source.value } : {}),
      },
    });

    articlesStore.setPagination({
      total: toInt(response.headers.get("x-total-count"), 0),
      totalPages: toInt(response.headers.get("x-total-pages"), 0),
      page: toInt(response.headers.get("x-page"), 1),
      limit: toInt(response.headers.get("x-limit"), 4),
    });

    return response._data ?? [];
  },
  {
    watch: [page, limit, source],
  },
);

const handlePageChange = (nextPage: number) => {
  if (nextPage === page.value) return;
  articlesStore.setPagination({ page: nextPage });
};

const handleSourceChange = (nextSource: string) => {
  if (nextSource === source.value) return;
  articlesStore.setSource(nextSource);
  articlesStore.setPagination({ page: 1 });
};
</script>

<template>
  <Container>
    <div class="flex flex-col gap-5">
      <div class="flex justify-between">
        <ArticleSources
          :sources="sources ?? []"
          :model-value="source"
          @update:model-value="handleSourceChange"
        />
      </div>
      <div v-if="articles && articles.length === 0">No articles found</div>
      <ArticleList
        v-else-if="articles"
        :articles="articles"
        :totalPages="totalPages"
        :page="page"
        @page-change="handlePageChange"
      />
    </div>
  </Container>
</template>
