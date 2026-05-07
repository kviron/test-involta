import Fuse from "fuse.js";
import {
  parseSourceFilter,
  RSS_STORAGE_KEY,
  type Article,
} from "../../utils/rss";

const MAX_LIMIT = 99;
const DEFAULT_LIMIT = 4;

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type SearchableArticle = {
  index: number;
  title: string;
  description: string;
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

  const rawQ = query.q ?? query.search;
  const searchQuery =
    typeof rawQ === "string"
      ? rawQ.trim()
      : Array.isArray(rawQ)
        ? String(rawQ[0] ?? "").trim()
        : "";

  const searchableArticles: SearchableArticle[] = articles.map(
    (article, index) => ({
      index,
      title: article.title ?? "",
      description: stripHtml(article.description ?? ""),
    }),
  );

  const filtered: Article[] =
    searchQuery.length === 0
      ? articles.map((article, index) => ({
          ...article,
          descriptionPlain: searchableArticles[index]?.description ?? "",
          searchMatches: undefined,
        }))
      : new Fuse(searchableArticles, {
          keys: [
            { name: "title", weight: 0.7 },
            { name: "description", weight: 0.3 },
          ],
          threshold: 0.3,
          includeMatches: true,
          isCaseSensitive: false,
          ignoreLocation: true,
          includeScore: true,
          shouldSort: true,
          minMatchCharLength: 3,
          findAllMatches: false,
        })
          .search(searchQuery)
          .map((result) => {
            const sourceArticle = articles[result.item.index]!;
            const titleMatch = result.matches?.find(
              (match) => match.key === "title",
            );
            const descriptionMatch = result.matches?.find(
              (match) => match.key === "description",
            );

            return {
              ...sourceArticle,
              descriptionPlain: result.item.description,
              searchMatches: {
                title: titleMatch?.indices as
                  | Array<[number, number]>
                  | undefined,
                description: descriptionMatch?.indices as
                  | Array<[number, number]>
                  | undefined,
              },
            } satisfies Article;
          });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const start = (page - 1) * limit;

  setResponseHeaders(event, {
    "X-Total-Count": String(totalCount),
    "X-Total-Pages": String(totalPages),
    "X-Page": String(page),
    "X-Limit": String(limit),
  });

  return filtered.slice(start, start + limit);
});
