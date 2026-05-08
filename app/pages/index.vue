<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useArticlesQuerySync } from "../composables/useArticlesQuerySync";
import { useArticles } from "../composables/useArticles";

const articlesStore = useArticlesStore();
const { q, page, source, limit, totalPages, view } =
  storeToRefs(articlesStore);

// Инициализация синхронизации query параметров с store
useArticlesQuerySync();

// Debounced поиск для API запросов
const searchQuery = refDebounced(q, 350);
const requestSearchQuery = computed(() =>
  import.meta.server ? q.value : searchQuery.value,
);

const { articles, sources } = await useArticles({
  page,
  limit,
  source,
  searchQuery: requestSearchQuery,
  onPaginationUpdate: (pagination) => articlesStore.setPagination(pagination),
});

const handlePageChange = (nextPage: number) => {
  articlesStore.setPage(nextPage);
};

const handleSourceChange = (nextSource: string) => {
  articlesStore.setSource(nextSource);
};

const handleViewChange = (nextView: "list" | "grid") => {
  articlesStore.setView(nextView);
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
        <ArticleView :view="view" @update:view="handleViewChange" />
      </div>
      <ArticleEmptyState v-if="articles && articles.length === 0" />
      <ArticleList
        v-else-if="articles"
        :articles="articles"
        :total-pages="totalPages"
        :page="page"
        :view="view"
        @page-change="handlePageChange"
      />
    </div>
  </Container>
</template>
