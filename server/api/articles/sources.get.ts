import { getSources, parseSourceFilter } from "../../utils/rss";

export default defineEventHandler((event) => {
  const { rss } = useRuntimeConfig(event);
  const sources = getSources(rss as Record<string, string>);
  const requestedIds = parseSourceFilter(getQuery(event).source);

  if (requestedIds.length === 0) {
    return sources;
  }

  const filtered = sources.filter((source) => requestedIds.includes(source.id));
  return filtered.length > 0 ? filtered : sources;
});
