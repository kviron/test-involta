import Fuse from "fuse.js";
import type { Article } from "../../types/articles";

const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type SearchableArticle = {
  index: number;
  title: string;
  description: string;
};

export const searchArticles = (
  articles: Article[],
  query: string,
): Article[] => {
  if (!query.length) {
    return articles.map((article) => ({
      ...article,
      descriptionPlain:
        article.descriptionPlain ?? stripHtml(article.description ?? ""),
      searchMatches: undefined,
    }));
  }

  const searchableArticles: SearchableArticle[] = articles.map(
    (article, index) => ({
      index,
      title: article.title ?? "",
      description: stripHtml(article.description ?? ""),
    }),
  );

  return new Fuse(searchableArticles, {
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
    .search(query)
    .map((result) => {
      const sourceArticle = articles[result.item.index]!;
      const titleMatch = result.matches?.find((match) => match.key === "title");
      const descriptionMatch = result.matches?.find(
        (match) => match.key === "description",
      );

      return {
        ...sourceArticle,
        descriptionPlain: result.item.description,
        searchMatches: {
          title: titleMatch?.indices as Array<[number, number]> | undefined,
          description: descriptionMatch?.indices as
            | Array<[number, number]>
            | undefined,
        },
      } satisfies Article;
    });
};

export const filterArticlesBySource = (
  articles: Article[],
  sourceIds: string[],
): Article[] => {
  if (sourceIds.length === 0) return articles;
  return articles.filter((article) => sourceIds.includes(article.sourceId));
};

export const paginateArticles = <T>(
  items: T[],
  page: number,
  limit: number,
): T[] => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};
