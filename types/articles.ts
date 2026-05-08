export type ArticlesView = "list" | "grid";

export type Source = {
  id: string;
  domain: string;
  url: string;
};

export type SearchMatch = {
  title?: Array<[number, number]>;
  description?: Array<[number, number]>;
};

export type Article = {
  id: string;
  title?: string;
  description: string;
  descriptionPlain?: string;
  link?: string;
  pubDate?: string;
  image?: string;
  source: string;
  sourceId: string;
  searchMatches?: SearchMatch;
};
