export const toPositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const normalizePage = (value: string | null): number => {
  const parsed = toPositiveInt(value, 1);
  return parsed > 0 ? parsed : 1;
};
