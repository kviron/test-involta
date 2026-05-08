<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { useArticlesQuerySync } from "../composables/useArticlesQuerySync";
import { useArticles } from "../composables/useArticles";
import { ARTICLES_CONFIG } from "../../shared/constants/articles";

const articlesStore = useArticlesStore();
const { q, page, source, limit, totalPages, view } =
  storeToRefs(articlesStore);

// Инициализация синхронизации query параметров с store
useArticlesQuerySync();

// Debounced поиск только на клиенте
const searchQuery = computed(() =>
  import.meta.server
    ? q.value
    : refDebounced(q, ARTICLES_CONFIG.SEARCH_DEBOUNCE_MS).value,
);

const { articles, sources } = await useArticles({
  page,
  limit,
  source,
  searchQuery,
  onPaginationUpdate: (pagination) => articlesStore.setPagination(pagination),
});
</script>

<template>
  <Container>
    <div class="flex flex-col gap-5">
      <div class="flex justify-between">
        <ArticleSources
          :sources="sources ?? []"
          :model-value="source"
          @update:model-value="articlesStore.setSource"
        />
        <ArticleView :view="view" @update:view="articlesStore.setView" />
      </div>
      <ArticleEmptyState v-if="articles && articles.length === 0" />
      <ArticleList
        v-else-if="articles"
        :articles="articles"
        :total-pages="totalPages"
        :page="page"
        :view="view"
        @page-change="articlesStore.setPage"
      />
    </div>
  </Container>
</template>
