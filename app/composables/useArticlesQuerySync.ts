import type { Ref } from "vue";

export type UseArticlesQuerySyncParams = {
  page: Ref<number>;
  source: Ref<string>;
  /** Строка поиска в сторе (как в поле ввода), синхронизируется с `route.query.q` */
  search: Ref<string>;
  /**
   * Дебаунснутая версия для записи в URL и для запросов к API —
   * передаётся снаружи (`refDebounced(search, ms)`).
   */
  searchQuery: Ref<string>;
  setPage: (page: number) => void;
  setSource: (source: string) => void;
  setSearch: (q: string) => void;
};

const toInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePage = (value: string | null) => {
  const parsed = toInt(value, 1);
  return parsed > 0 ? parsed : 1;
};

export const queryParamString = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : String(raw ?? "");
};

/** Собирает query для списка статей: page, source, q */
const buildArticlesQuery = (
  route: ReturnType<typeof useRoute>,
  patch: {
    page: string;
    source: string;
    q: string;
  },
): Record<string, string | string[]> => {
  const next = { ...route.query } as Record<string, string | string[] | undefined>;
  next.page = patch.page;
  if (patch.source) next.source = patch.source;
  else delete next.source;
  if (patch.q.trim()) next.q = patch.q.trim();
  else delete next.q;
  return next as Record<string, string | string[]>;
};

export const useArticlesQuerySync = ({
  page,
  source,
  search,
  searchQuery,
  setPage,
  setSource,
  setSearch,
}: UseArticlesQuerySyncParams) => {
  const route = useRoute();
  const router = useRouter();

  watch(
    () => route.query.page,
    (routePage) => {
      const nextPage = normalizePage(
        Array.isArray(routePage) ? (routePage[0] ?? null) : (routePage ?? null),
      );
      if (nextPage !== page.value) {
        setPage(nextPage);
      }
    },
    { immediate: true },
  );

  watch(
    () => route.query.source,
    (routeSource) => {
      const nextSource = Array.isArray(routeSource)
        ? (routeSource[0] ?? "")
        : (routeSource ?? "");
      if (nextSource !== source.value) {
        setSource(nextSource);
      }
    },
    { immediate: true },
  );

  watch(
    () => route.query.q,
    (routeQ) => {
      const next = queryParamString(routeQ);
      if (next.trim() !== search.value.trim()) {
        setSearch(next);
      }
    },
    { immediate: true },
  );

  watch(page, async (nextPage) => {
    const queryPage = normalizePage(
      Array.isArray(route.query.page)
        ? (route.query.page[0] ?? null)
        : (route.query.page ?? null),
    );

    if (queryPage === nextPage) return;

    await router.replace({
      query: buildArticlesQuery(route, {
        page: String(nextPage),
        source: source.value,
        q: searchQuery.value,
      }),
    });
  });

  watch(source, async (nextSource) => {
    const querySource = Array.isArray(route.query.source)
      ? (route.query.source[0] ?? "")
      : (route.query.source ?? "");

    if (querySource === nextSource) return;

    await router.replace({
      query: buildArticlesQuery(route, {
        page: "1",
        source: nextSource,
        q: searchQuery.value,
      }),
    });
  });

  watch(searchQuery, async (next) => {
    const routeStr = queryParamString(route.query.q);
    if (next.trim() === routeStr.trim()) return;

    await router.replace({
      query: buildArticlesQuery(route, {
        page: "1",
        source: source.value,
        q: next,
      }),
    });
  });
};
