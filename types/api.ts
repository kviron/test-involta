export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginationHeaders = {
  "X-Total-Count": string;
  "X-Total-Pages": string;
  "X-Page": string;
  "X-Limit": string;
};
