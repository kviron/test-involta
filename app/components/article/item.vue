<script setup lang="ts">
import dayjs from "dayjs";
import type { Article } from "../../../types/articles";
import { useSearchHighlight } from "../../composables/useSearchHighlight";

const props = defineProps<{
  article: Article;
  view: "list" | "grid";
}>();

const { titleHtml, contentHtml } = useSearchHighlight(
  computed(() => props.article),
);
</script>

<template>
  <article
    class="bg-white rounded-md shadow-soft flex flex-col justify-between gap-4 overflow-hidden"
    :class="view === 'grid' && 'min-h-[256px]'"
  >
    <div class="flex flex-col p-8 items-start">
      <div v-if="view === 'list'" class="flex md:flex-row flex-col gap-4">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          loading="lazy"
          class="aspect-[2/1] md:w-[200px] object-cover"
        />
        <div>
          <h2 class="text-primary-main text-lg font-bold mb-5">
            <span v-html="titleHtml" />
          </h2>
          <p class="mb-5" v-html="contentHtml" />
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
          <span v-html="titleHtml" />
        </h2>
        <p class="mb-5" v-html="contentHtml" />
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
