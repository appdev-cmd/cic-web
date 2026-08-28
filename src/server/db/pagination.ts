import 'server-only';

export type PaginationInput = { page?: number; pageSize?: number };
export type Pagination = { page: number; pageSize: number; offset: number };

export function parsePagination(input: PaginationInput = {}): Pagination {
  const page = Number.isInteger(input.page) ? Math.max(1, input.page as number) : 1;
  const pageSize = Number.isInteger(input.pageSize)
    ? Math.min(100, Math.max(1, input.pageSize as number))
    : 20;
  return { page, pageSize, offset: (page - 1) * pageSize };
}
