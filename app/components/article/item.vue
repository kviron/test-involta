<script setup lang="ts">
import dayjs from "dayjs";
import type { Article } from "../../../server/utils/rss";

defineProps<{
  article: Article;
}>();
</script>

<template>
  <article
    class="bg-white rounded-md shadow-soft flex flex-col justify-between gap-4 overflow-hidden"
  >
    <div class="pt-7 px-7">
      <header class="text-primary-main text-lg font-bold">
        {{ article.title }}
      </header>
      <div>
        <NuxtLink
          :to="article.link"
          target="_blank"
          class="text-primary-main underline"
          >Подробнее</NuxtLink
        >
      </div>
    </div>
    <footer
      class="flex items-center gap-2 justify-between text-secondary-main py-3 px-7 bg-bg-main"
    >
      <span class="underline">www.{{ article.source.toLowerCase() }}</span>
      <span>{{ dayjs(article.pubDate).format("DD.MM.YYYY") }}</span>
    </footer>
  </article>
</template>
