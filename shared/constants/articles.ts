export const ARTICLES_CONFIG = {
  DEFAULT_LIMIT: 4,
  SEARCH_DEBOUNCE_MS: 350,
} as const;

export const ARTICLES_DATA_KEYS = {
  ARTICLES: "articles",
  SOURCES: "article-sources",
} as const;

export const ARTICLES_VIEW = {
  LIST: "list",
  GRID: "grid",
} as const;

export type ArticlesView = (typeof ARTICLES_VIEW)[keyof typeof ARTICLES_VIEW];
