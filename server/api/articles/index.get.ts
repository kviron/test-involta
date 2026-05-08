import type { Article } from "../../../types/articles";
import { parseSourceFilter, RSS_STORAGE_KEY } from "../../utils/rss";
import { toPositiveInt, parseQueryParam } from "../../utils/validation";
import { calculatePagination, setPaginationHeaders } from "../../utils/pagination";
import {
  searchArticles,
  filterArticlesBySource,
  paginateArticles,
} from "../../utils/articles";

const MAX_LIMIT = 99;
const DEFAULT_LIMIT = 4;

const getArticlesFromCache = async (): Promise<Article[]> => {
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

  return cached;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = toPositiveInt(query.page, 1);
  const limit = Math.min(MAX_LIMIT, toPositiveInt(query.limit, DEFAULT_LIMIT));
  const sourceIds = parseSourceFilter(query.source);
  const searchQuery = parseQueryParam(query.q ?? query.search).trim();

  const cached = await getArticlesFromCache();
  const filtered = filterArticlesBySource(cached, sourceIds);
  const searched = searchArticles(filtered, searchQuery);

  const pagination = calculatePagination(searched.length, page, limit);
  setPaginationHeaders(event, pagination);

  return paginateArticles(searched, page, limit);
});
