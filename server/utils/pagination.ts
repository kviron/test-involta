import type { H3Event } from "h3";
import type { PaginationMeta } from "../../types/api";

export const calculatePagination = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
  };
};

export const setPaginationHeaders = (
  event: H3Event,
  pagination: PaginationMeta,
): void => {
  setResponseHeaders(event, {
    "X-Total-Count": String(pagination.total),
    "X-Total-Pages": String(pagination.totalPages),
    "X-Page": String(pagination.page),
    "X-Limit": String(pagination.limit),
  });
};
