export const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export const queryParamString = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : String(raw ?? "");
};
