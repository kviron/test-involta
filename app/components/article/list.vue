<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { Article } from "../../../server/utils/rss";

defineProps<{
  articles: Article[];
  totalPages: number;
  page: number;
}>();

const emit = defineEmits<{
  (e: "page-change", page: number): void;
}>();

const articlesStore = useArticlesStore();
const { view } = storeToRefs(articlesStore);
</script>

<template>
  <div class="flex flex-col gap-12">
    <div
      class="grid gap-5"
      :class="view === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'"
    >
      <ArticleItem
        v-for="article in articles"
        :article="article"
        :key="article.id"
      />
    </div>
    <div class="flex justify-center items-center gap-2">
      <UiPagination
        :total-pages="totalPages"
        :current-page="page"
        @change="emit('page-change', $event)"
      />
    </div>
  </div>
</template>
