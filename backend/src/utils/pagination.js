const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;

export const clampLimit = (limit) => Math.min(
  Math.max(parseInt(limit) || DEFAULT_LIMIT, MIN_LIMIT),
  MAX_LIMIT
);

export const clampPage = (page) => Math.max(parseInt(page) || DEFAULT_PAGE, DEFAULT_PAGE);

export const buildPagination = (page, limit) => ({
  skip: (clampPage(page) - 1) * clampLimit(limit),
  limit: clampLimit(limit),
});

export const buildPaginationMeta = (page, limit, total) => ({
  currentPage: clampPage(page),
  limit: clampLimit(limit),
  total,
  totalPages: Math.ceil(total / clampLimit(limit)),
});
