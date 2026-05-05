import {
  parseSourceFilter,
  RSS_STORAGE_KEY,
  type Article,
} from "../../utils/rss";

const MAX_LIMIT = 99;
const DEFAULT_LIMIT = 10;

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = toPositiveInt(query.page, 1);
  const limit = Math.min(MAX_LIMIT, toPositiveInt(query.limit, DEFAULT_LIMIT));
  const sourceIds = parseSourceFilter(query.source);

  const storage = useStorage("cache");
  let cached = (await storage.getItem<Article[]>(RSS_STORAGE_KEY)) ?? [];

  if (cached.length === 0) {
    try {
      await runTask("update-rss");
      cached = (await storage.getItem<Article[]>(RSS_STORAGE_KEY)) ?? [];
    } catch (error) {
      console.warn("[articles/index.get] Empty cache: refresh failed:", error);
    }
  }

  const articles =
    sourceIds.length === 0
      ? cached
      : cached.filter((article) => sourceIds.includes(article.sourceId));

  const totalCount = articles.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const start = (page - 1) * limit;

  setResponseHeaders(event, {
    "X-Total-Count": String(totalCount),
    "X-Total-Pages": String(totalPages),
    "X-Page": String(page),
    "X-Limit": String(limit),
  });

  return articles.slice(start, start + limit);
});
