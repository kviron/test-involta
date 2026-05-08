import { useRoute, useRouter } from "vue-router";
import { useArticlesStore } from "../stores/articles";
import { queryParamString } from "../utils/string";
import { normalizePage } from "../utils/validation";

export const useArticlesQuerySync = () => {
  const route = useRoute();
  const router = useRouter();
  const store = useArticlesStore();

  const initFromUrl = () => {
    const urlQ = queryParamString(route.query.q);
    const urlPage = normalizePage(
      Array.isArray(route.query.page)
        ? (route.query.page[0] ?? null)
        : (route.query.page ?? null),
    );
    const urlSource = queryParamString(route.query.source);

    if (urlQ !== store.q) store.setQ(urlQ);
    if (urlPage !== store.page) store.setPage(urlPage);
    if (urlSource !== store.source) store.setSource(urlSource);
  };

  const syncToUrl = () => {
    watch(
      () => ({ q: store.q, page: store.page, source: store.source }),
      async (newValues) => {
        const query: Record<string, string> = {};

        if (newValues.q) query.q = newValues.q;
        if (newValues.page > 1) query.page = String(newValues.page);
        if (newValues.source) query.source = newValues.source;

        const currentQ = queryParamString(route.query.q);
        const currentPage = normalizePage(
          Array.isArray(route.query.page)
            ? (route.query.page[0] ?? null)
            : (route.query.page ?? null),
        );
        const currentSource = queryParamString(route.query.source);

        const hasChanges =
          currentQ !== newValues.q ||
          currentPage !== newValues.page ||
          currentSource !== newValues.source;

        if (hasChanges) {
          await router.replace({ query });
        }
      },
      { deep: true },
    );
  };

  // Инициализация при монтировании (только на клиенте)
  if (import.meta.client) {
    onMounted(() => {
      initFromUrl();
      syncToUrl();
    });
  } else {
    // На сервере инициализируем сразу
    initFromUrl();
  }
};
