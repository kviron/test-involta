import { escapeHtml } from "./string";

/**
 * Функция для подсветки текста поиска
 * @param text Текст для подсветки
 * @param regions Массив с областями для подсветки
 * @returns
 */
export const highlightMatches = (
  text: string,
  regions: Array<[number, number]> = [],
): string => {
  if (!regions.length) return escapeHtml(text);

  const chunks: string[] = [];
  let lastIndex = 0;

  for (const [start, end] of regions) {
    if (start > lastIndex) {
      chunks.push(escapeHtml(text.slice(lastIndex, start)));
    }

    chunks.push(
      `<span class="mark-search">${escapeHtml(text.slice(start, end + 1))}</span>`,
    );
    lastIndex = end + 1;
  }

  if (lastIndex < text.length) {
    chunks.push(escapeHtml(text.slice(lastIndex)));
  }

  return chunks.join("");
};
