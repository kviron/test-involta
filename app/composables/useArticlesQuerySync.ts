import type { Ref } from "vue";

type UseArticlesQuerySyncParams = {
  page: Ref<number>;
  source: Ref<string>;
  setPage: (page: number) => void;
  setSource: (source: string) => void;
};

const toInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePage = (value: string | null) => {
  const parsed = toInt(value, 1);
  return parsed > 0 ? parsed : 1;
};

export const useArticlesQuerySync = ({
  page,
  source,
  setPage,
  setSource,
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

  watch(page, async (nextPage) => {
    const queryPage = normalizePage(
      Array.isArray(route.query.page)
        ? (route.query.page[0] ?? null)
        : (route.query.page ?? null),
    );

    if (queryPage === nextPage) return;

    await router.replace({
      query: {
        ...route.query,
        page: String(nextPage),
        ...(source.value ? { source: source.value } : {}),
      },
    });
  });

  watch(source, async (nextSource) => {
    const querySource = Array.isArray(route.query.source)
      ? (route.query.source[0] ?? "")
      : (route.query.source ?? "");

    if (querySource === nextSource) return;

    const nextQuery = {
      ...route.query,
      page: "1",
    };

    if (nextSource) {
      await router.replace({
        query: {
          ...nextQuery,
          source: nextSource,
        },
      });
      return;
    }

    const queryWithoutSource = {
      ...nextQuery,
    } as Record<string, string | string[] | null | undefined>;
    delete queryWithoutSource.source;
    await router.replace({ query: queryWithoutSource });
  });
};
