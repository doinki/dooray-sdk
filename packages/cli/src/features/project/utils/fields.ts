import { z } from 'zod';

/**
 * An optional date flag carrying a timezone offset (e.g. `2026-06-22+09:00`).
 * Trims input and coerces empty strings to `undefined`. Shared by `milestone-create`/`milestone-update`.
 */
export const optionalDate = (describe: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .meta({ hint: 'YYYY-MM-DD±HH:MM' })
    .describe(describe);
