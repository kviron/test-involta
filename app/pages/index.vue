<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Article } from "../../server/utils/rss";

const articlesStore = useArticlesStore();
const { page, limit, totalPages } = storeToRefs(articlesStore);
const route = useRoute();
const router = useRouter();

const toInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePage = (value: string | null) => {
  const parsed = toInt(value, 1);
  return parsed > 0 ? parsed : 1;
};

watch(
  () => route.query.page,
  (routePage) => {
    const nextPage = normalizePage(
      Array.isArray(routePage) ? (routePage[0] ?? null) : (routePage ?? null),
    );
    if (nextPage !== page.value) {
      articlesStore.setPagination({ page: nextPage });
    }
  },
  { immediate: true },
);

watch(page, async (nextPage) => {
  const queryPage = normalizePage(
    Array.isArray(route.query.page)
      ? (route.query.page[0] ?? null)
      : (route.query.page ?? null),
  );

  if (queryPage === nextPage) return;

  await router.replace({
    query: {
      ...route.query,
      page: String(nextPage),
    },
  });
});

const { data: articles, status } = await useAsyncData<Article[]>(
  "articles",
  async (_nuxtApp, { signal }) => {
    const response = await $fetch.raw<Article[]>("/api/articles", {
      signal,
      params: { page: page.value, limit: limit.value },
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
    watch: [page, limit],
  },
);

const handlePageChange = (nextPage: number) => {
  if (nextPage === page.value) return;
  articlesStore.setPagination({ page: nextPage });
};
</script>

<template>
  <Container>
    <div v-if="!articles">Loading...</div>
    <ArticleList
      v-else="articles"
      :articles="articles"
      :totalPages="totalPages"
      :page="page"
      @page-change="handlePageChange"
    />
  </Container>
</template>
