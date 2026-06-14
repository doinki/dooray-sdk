import type { RestResponse } from './rest-response';

export const DEFAULT_PAGE = 0;

export const DEFAULT_SIZE = 20;

export interface PageParams {
  page?: number;
  size?: number;
}

export interface Paging {
  hasNext: boolean;
  page: number;
  size: number;
  totalElements: number;
}

export type PaginatedResponse<T> = { paging: Paging } & T;

export interface CountedRestResponse extends RestResponse {
  totalCount: number | string;
}

export function computeHasNext({
  page,
  size,
  totalElements,
}: {
  page: number;
  size: number;
  totalElements: number;
}): boolean {
  if (size <= 0) return false;

  return (page + 1) * size < totalElements;
}
