<script setup lang="ts">
import type { Article } from '../../../server/utils/rss';
defineProps<{
  articles: Article[];
}>();
</script>

<template>
  <div>
    <div v-for="article in articles" :key="article.id">
      <ArticleItem :article="article" />
    </div>
  </div>
</template>
