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

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const highlightMatches = (
  text: string,
  regions: Array<[number, number]> = [],
) => {
  if (!regions.length) return escapeHtml(text);

  const chunks: string[] = [];
  let lastIndex = 0;

  for (const [start, end] of regions) {
    if (start > lastIndex) {
      chunks.push(escapeHtml(text.slice(lastIndex, start)));
    }

    chunks.push(
      `<span class="mark-search">${escapeHtml(text.slice(start, end + 1))}</span>`,
    );
    lastIndex = end + 1;
  }

  if (lastIndex < text.length) {
    chunks.push(escapeHtml(text.slice(lastIndex)));
  }

  return chunks.join("");
};

const titleText = computed(() => props.article.title ?? "");

const titleHtml = computed(() =>
  highlightMatches(titleText.value, props.article.searchMatches?.title),
);

const contentText = computed(() => {
  if (props.article.descriptionPlain) {
    return props.article.descriptionPlain;
  }

  const description = props.article.description ?? "";
  if (typeof DOMPurify.sanitize === "function") {
    return DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
  }
  return stripHtml(description);
});

const contentHtml = computed(() =>
  highlightMatches(contentText.value, props.article.searchMatches?.description),
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
