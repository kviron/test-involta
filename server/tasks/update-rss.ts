import type { Article } from "../../types/articles";
import {
  getSources,
  parseSourceArticles,
  RSS_STORAGE_KEY,
  RSS_UPDATED_AT_KEY,
  sortByPubDateDesc,
} from "../utils/rss";

export default defineTask({
  meta: {
    name: "update-rss",
    description: "Fetch RSS feeds and store cache",
  },
  async run() {
    const { rss } = useRuntimeConfig();
    const sources = getSources(rss as Record<string, string>);
    const storage = useStorage("cache");

    const results = await Promise.allSettled(
      sources.map((source) => parseSourceArticles(source)),
    );

    const articles: Article[] = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        articles.push(...result.value);
      } else {
        console.warn(
          `[update-rss] Failed to parse "${sources[index]?.id}":`,
          result.reason,
        );
      }
    });

    const sorted = sortByPubDateDesc(articles);
    await storage.setItem(RSS_STORAGE_KEY, sorted);
    await storage.setItem(RSS_UPDATED_AT_KEY, new Date().toISOString());

    return {
      result: "success",
      sourcesCount: sources.length,
      itemsStored: sorted.length,
    };
  },
});
