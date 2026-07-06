import { DoorayError } from '@dooray-sdk/core/errors';
import type { z } from 'zod';

import type { FlagIssue } from '../error/flag-errors';
import { flagValueError, flagValuesError } from '../error/flag-errors';
import { camelCase, kebabCase } from '../utils/case';

export type ArgInput = Record<string, unknown>;

function camelizeKeys(input: ArgInput): ArgInput {
  const out: ArgInput = {};
  for (const key of Object.keys(input)) out[camelCase(key)] = input[key];

  return out;
}

export function parseArgsOrThrow<S extends z.ZodType>(schema: S, rawInput: ArgInput): z.infer<S> {
  const input = camelizeKeys(rawInput);

  const parsed = schema.safeParse(input);
  if (parsed.success) return parsed.data;

  // Cross-field rules (object-level `.refine`) have an empty path — no single flag to blame, so
  // surface the message as-is (gh does the same: flag-group errors are plain sentences, not per-flag).
  const fieldIssues = parsed.error.issues.filter((issue) => issue.path.length > 0);
  if (fieldIssues.length === 0) throw new DoorayError({ code: 'validation', message: parsed.error.issues[0].message });

  // One flag can fail several checks at once (e.g. min + regex) — group issues per flag.
  const byFlag = new Map<string, FlagIssue>();
  for (const issue of fieldIssues) {
    const name = String(issue.path[0]);
    const flag = `--${kebabCase(name)}`;

    const existing = byFlag.get(flag);
    if (existing) {
      existing.message += `; ${issue.message}`;
      continue;
    }

    const raw = input[name];
    // citty only ever yields primitives or string[] — the cast is what satisfies lint's no-base-to-string.
    const value = Array.isArray(raw) ? raw.join(',') : String((raw ?? '') as boolean | number | string);

    byFlag.set(flag, { flag, message: issue.message, value });
  }

  const issues = [...byFlag.values()];

  if (issues.length === 1) {
    const [first] = issues;

    throw flagValueError(first.flag, first.value, first.message);
  }

  throw flagValuesError(issues);
}
