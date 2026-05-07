<script setup lang="ts">
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import type { Article } from "../../../server/utils/rss";

const props = defineProps<{
  article: Article;
  view: "list" | "grid";
}>();

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const content = computed(() => {
  const description = props.article.description ?? "";
  if (typeof DOMPurify.sanitize === "function") {
    return DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
  }
  return stripHtml(description);
});
</script>

<template>
  <article
    class="bg-white rounded-md shadow-soft flex flex-col justify-between gap-4 overflow-hidden"
    :class="view === 'grid' && 'min-h-[256px]'"
  >
    <div class="flex flex-col p-8">
      <div v-if="view === 'list'" class="flex md:flex-row flex-col gap-4">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          loading="lazy"
          class="aspect-[2/1] md:w-[200px] object-cover"
        />
        <div>
          <h2 class="text-primary-main text-lg font-bold mb-5">
            {{ article.title }}
          </h2>
          <p class="mb-5" v-html="content" />
          <NuxtLink
            :to="article.link"
            target="_blank"
            class="text-primary-main underline"
            >Подробнее</NuxtLink
          >
        </div>
      </div>
      <div
        v-if="view === 'grid'"
        class="flex-grow flex flex-col justify-between"
      >
        <h2 class="text-primary-main text-lg font-bold mb-7">
          {{ article.title }}
        </h2>
        <p class="mb-5" v-html="content" />
        <NuxtLink
          :to="article.link"
          target="_blank"
          class="text-primary-main underline"
          >Подробнее</NuxtLink
        >
      </div>
    </div>
    <footer
      class="flex items-center gap-2 justify-between text-secondary-main px-7 py-3"
      :class="view === 'list' && 'bg-bg-main'"
    >
      <span class="underline">www.{{ article.source.toLowerCase() }}</span>
      <span>{{ dayjs(article.pubDate).format("DD.MM.YYYY") }}</span>
    </footer>
  </article>
</template>
