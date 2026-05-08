import Parser from "rss-parser";
import type { Article, Source } from "../../types/articles";

export const RSS_STORAGE_KEY = "rss-data";
export const RSS_UPDATED_AT_KEY = "rss-updated-at";

const parser = new Parser();

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export const getDomain = (url: string) =>
  capitalize(new URL(url).hostname.replace("www.", ""));

export const getSources = (rss: Record<string, string>): Source[] =>
  Object.entries(rss).map(([id, url]) => ({
    id,
    url,
    domain: getDomain(url),
  }));

export const parseSourceFilter = (value: unknown): string[] => {
  if (value === undefined || value === null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => String(item)).filter(Boolean);
};

const buildArticleId = (guid: unknown): string => {
  if (typeof guid === "string") {
    const trimmed = guid.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return crypto.randomUUID();
};

export const parseSourceArticles = async (source: Source): Promise<Article[]> => {
  const parsed = await parser.parseURL(source.url);

  return parsed.items.map((item) => ({
    id: buildArticleId(item.guid),
    title: item.title,
    description: item.contentSnippet ?? item.content ?? item.summary ?? "",
    link: item.link,
    pubDate: item.pubDate,
    image: item.enclosure?.url,
    source: source.domain,
    sourceId: source.id,
  }));
};

export const sortByPubDateDesc = <T extends { pubDate?: string }>(items: T[]): T[] =>
  [...items].sort((left, right) => {
    const leftDate = left.pubDate ? Date.parse(left.pubDate) : 0;
    const rightDate = right.pubDate ? Date.parse(right.pubDate) : 0;
    return rightDate - leftDate;
  });
