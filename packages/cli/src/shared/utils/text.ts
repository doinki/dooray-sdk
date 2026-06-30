import { format } from 'date-fns';

/** Parse to a Date, returning undefined for nullish or unparseable input (so formatting never throws). */
function toDate(value: null | string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Render an ISO timestamp as a local `yyyy-MM-dd` date. Nullish/invalid input stays empty (`-` in tables). */
export function formatDate(value: null | string | undefined): string | undefined {
  const date = toDate(value);
  return date && format(date, 'yyyy-MM-dd');
}

/** Render an ISO timestamp as a local `yyyy-MM-dd HH:mm` datetime. Nullish/invalid input stays empty (`-` in tables). */
export function formatDateTime(value: null | string | undefined): string | undefined {
  const date = toDate(value);
  return date && format(date, 'yyyy-MM-dd HH:mm');
}

export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, Math.max(0, max - 3))}...` : value;
}

/** True for the "empty" values that render as `-`: undefined, null, or the empty string. */
export function isBlank(value: unknown): boolean {
  return value === undefined || value === null || value === '';
}
