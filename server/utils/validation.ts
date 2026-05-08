export const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const parseQueryParam = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === "string" ? raw : String(raw ?? "");
};
