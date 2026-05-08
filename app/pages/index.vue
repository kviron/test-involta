<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useArticlesQuerySync } from "../composables/useArticlesQuerySync";
import { useArticles } from "../composables/useArticles";

const articlesStore = useArticlesStore();
const { limit, totalPages, view } = storeToRefs(articlesStore);

// Синхронизация query параметров с store
const { page, source } = useArticlesQuerySync();

// Используем q из store для поиска (связан с input через v-model в header)
const { q } = storeToRefs(articlesStore);
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
  page.value = nextPage;
};

const handleSourceChange = (nextSource: string) => {
  source.value = nextSource;
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
