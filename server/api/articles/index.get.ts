import Parser from "rss-parser";

const parser = new Parser();
const MAX_LIMIT = 50;
const FEED_TIMEOUT_MS = 8000;
const FETCH_CONCURRENCY = 4;

type Source = {
  id: string;
  domain: string;
  url: string;
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number) => {
  return await Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("RSS feed timeout")), timeoutMs);
    }),
  ]);
};

const mapWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
) => {
  const settled: PromiseSettledResult<R>[] = [];
  for (let index = 0; index < items.length; index += concurrency) {
    const chunk = items.slice(index, index + concurrency);
    const chunkSettled = await Promise.allSettled(chunk.map(mapper));
    settled.push(...chunkSettled);
  }

  return settled;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Math.max(1, Number.parseInt(String(query.page), 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(String(query.limit), 10) || 10),
  );
  const sources = await $fetch<Source[]>("/api/articles/sources", {
    query: { source: query.source },
  });

  const sourcesWithArticles = await mapWithConcurrency(
    sources,
    FETCH_CONCURRENCY,
    async (source) => {
      const parsed = await withTimeout(
        parser.parseURL(String(source.url)),
        FEED_TIMEOUT_MS,
      );
      return parsed.items.map((article) => ({
        title: article?.title,
        description:
          article?.contentSnippet ?? article?.content ?? article?.summary ?? "",
        link: article?.link,
        pubDate: article?.pubDate,
        image: article?.enclosure?.url,
        source: source.domain,
      }));
    },
  );

  const articles = sourcesWithArticles
    .flatMap((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      console.warn("[articles/index.get] Source fetch failed:", result.reason);
      return [];
    })
    .sort((left, right) => {
      const leftDate = left.pubDate ? Date.parse(left.pubDate) : 0;
      const rightDate = right.pubDate ? Date.parse(right.pubDate) : 0;
      return rightDate - leftDate;
    });

  const totalCount = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const start = (page - 1) * limit;
  const paginatedArticles = articles.slice(start, start + limit);

  setResponseHeader(event, "X-Total-Count", String(totalCount));
  setResponseHeader(event, "X-Total-Pages", String(totalPages));
  setResponseHeader(event, "X-Page", String(page));
  setResponseHeader(event, "X-Limit", String(limit));

  return paginatedArticles;
});
