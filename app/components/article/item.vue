<script setup lang="ts">
import type { Article } from "../../../server/utils/rss";

defineProps<{
  article: Article;
}>();
</script>

<template>
  <div>
    <h2>{{ article.title }}</h2>
    <p>{{ article.description }}</p>
    <div class="flex items-center gap-2">
      <span>{{ article.source.toLowerCase() }}</span>
      <span>{{ article.pubDate }}</span>
    </div>
  </div>
</template>
