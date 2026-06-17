import { format } from 'date-fns';

/** Render an ISO timestamp as a local `yyyy-MM-dd` date. Nullish input stays empty (`-` in tables). */
export function formatDate(value: null | string | undefined): string | undefined {
  return value ? format(new Date(value), 'yyyy-MM-dd') : undefined;
}

/** Render an ISO timestamp as a local `yyyy-MM-dd HH:mm` datetime. Nullish input stays empty (`-` in tables). */
export function formatDateTime(value: null | string | undefined): string | undefined {
  return value ? format(new Date(value), 'yyyy-MM-dd HH:mm') : undefined;
}

export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}
