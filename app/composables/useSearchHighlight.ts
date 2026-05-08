import DOMPurify from "dompurify";
import { computed, type ComputedRef } from "vue";
import type { Article } from "../../types/articles";
import { highlightMatches } from "../utils/search";
import { stripHtml } from "../utils/string";

export const useSearchHighlight = (article: ComputedRef<Article> | Article) => {
  const articleValue = computed(() =>
    "value" in article ? article.value : article,
  );

  const titleText = computed(() => articleValue.value.title ?? "");

  const titleHtml = computed(() =>
    highlightMatches(titleText.value, articleValue.value.searchMatches?.title),
  );

  const contentText = computed(() => {
    if (articleValue.value.descriptionPlain) {
      return articleValue.value.descriptionPlain;
    }

    const description = articleValue.value.description ?? "";
    if (typeof DOMPurify.sanitize === "function") {
      return DOMPurify.sanitize(description, { ALLOWED_TAGS: [] });
    }
    return stripHtml(description);
  });

  const contentHtml = computed(() =>
    highlightMatches(
      contentText.value,
      articleValue.value.searchMatches?.description,
    ),
  );

  return {
    titleText,
    titleHtml,
    contentText,
    contentHtml,
  };
};
