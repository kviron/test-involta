import { computed } from "vue";
import { storeToRefs } from "pinia";
import { normalizePage } from "../utils/validation";
import { queryParamString } from "../utils/string";

/**
 * Composable для двусторонней синхронизации query параметров с Pinia store
 * Использует computed с get/set для элегантной синхронизации
 */
export const useArticlesQuerySync = () => {
  const route = useRoute();
  const router = useRouter();
  const articlesStore = useArticlesStore();
  const { page: storePage, source: storeSource, q: storeSearch } = storeToRefs(articlesStore);

  // Computed для page с двусторонней синхронизацией
  const page = computed({
    get() {
      const routePage = route.query.page;
      return normalizePage(
        Array.isArray(routePage) ? (routePage[0] ?? null) : (routePage ?? null),
      );
    },
    set(value: number) {
      if (value === storePage.value) return;
      articlesStore.setPagination({ page: value });

      router.replace({
        query: {
          ...route.query,
          page: String(value),
        },
      });
    },
  });

  // Computed для source с двусторонней синхронизацией
  const source = computed({
    get() {
      const routeSource = route.query.source;
      return Array.isArray(routeSource)
        ? (routeSource[0] ?? "")
        : (routeSource ?? "");
    },
    set(value: string) {
      if (value === storeSource.value) return;
      articlesStore.setSource(value);
      articlesStore.setPagination({ page: 1 }); // Сброс на первую страницу при смене источника

      const query = { ...route.query, page: "1" };
      if (value) {
        query.source = value;
      } else {
        delete query.source;
      }

      router.replace({ query });
    },
  });

  // Computed для search с двусторонней синхронизацией
  const search = computed({
    get() {
      return queryParamString(route.query.q);
    },
    set(value: string) {
      const trimmed = value.trim();
      if (trimmed === storeSearch.value.trim()) return;
      articlesStore.setSearch(value);
      articlesStore.setPagination({ page: 1 }); // Сброс на первую страницу при поиске

      const query = { ...route.query, page: "1" };
      if (trimmed) {
        query.q = trimmed;
      } else {
        delete query.q;
      }

      router.replace({ query });
    },
  });

  // Синхронизация из URL в store при монтировании
  onMounted(() => {
    const urlPage = page.value;
    const urlSource = source.value;
    const urlSearch = search.value;

    if (urlPage !== storePage.value) {
      articlesStore.setPagination({ page: urlPage });
    }
    if (urlSource !== storeSource.value) {
      articlesStore.setSource(urlSource);
    }
    if (urlSearch !== storeSearch.value) {
      articlesStore.setSearch(urlSearch);
    }
  });

  return {
    page,
    source,
    search,
  };
};
