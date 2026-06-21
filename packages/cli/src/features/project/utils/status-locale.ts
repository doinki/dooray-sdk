import type { StatusLocaleName } from '@dooray-sdk/core/constants';
import { STATUS_LOCALES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { splitCsv } from '../../../shared/utils/csv';

/**
 * Parse a `locale=name,locale=name` CLI value into the SDK's per-locale name list.
 * Shared by `project status-create` and `project status-update`.
 */
export const localeNamesSchema = z
  .string()
  .transform((input, ctx) => {
    const entries = splitCsv(input);
    if (entries.length === 0) return;

    const out: StatusLocaleName[] = [];
    for (const entry of entries) {
      const eqIdx = entry.indexOf('=');
      if (eqIdx === -1) {
        ctx.addIssue({ code: 'custom', message: `Use the \`locale=name\` form: \`${entry}\`.` });
        return z.NEVER;
      }
      const localeToken = entry.slice(0, eqIdx).trim();
      const name = entry.slice(eqIdx + 1).trim();
      if (name === '') {
        ctx.addIssue({ code: 'custom', message: `Locale name cannot be empty: \`${entry}\`.` });
        return z.NEVER;
      }
      const locale = STATUS_LOCALES.find((l) => l === localeToken);
      if (!locale) {
        ctx.addIssue({
          code: 'custom',
          message: `Allowed locales: ${STATUS_LOCALES.join(', ')} (got \`${localeToken}\`).`,
        });
        return z.NEVER;
      }
      out.push({ locale, name });
    }
    return out;
  })
  .optional();
