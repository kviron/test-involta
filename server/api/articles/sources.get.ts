const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = await useRuntimeConfig(event);
  const data: Record<string, string> = config.rss;

  const sourcesList = Object.entries(data).map(([key, value]) => {
    const domain = new URL(value).hostname.replace("www.", "");

    return {
      id: key,
      domain: capitalize(domain),
      url: value,
    };
  });

  // Фильтруем полученые ресурсы по id
  const requestedIds =
    query.source === undefined
      ? []
      : Array.isArray(query.source)
        ? query.source
        : [query.source];

  const validSourceIds = new Set(sourcesList.map((source) => source.id));
  const filteredIds = requestedIds.filter((id) => validSourceIds.has(id));

  if (filteredIds.length > 0) {
    return sourcesList.filter((source) => filteredIds.includes(source.id));
  }

  return sourcesList;
});
