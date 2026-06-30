import type { z } from 'zod';

import { flagValueError, flagValuesError } from '../error/flag-errors';
import { camelCase, kebabCase } from '../utils/case';

// Raw, pre-zod citty args: values are whatever the schema's `z.input` produces — including
// `unknown` for coerced fields (`z.coerce.number()`) and `string | undefined` for defaulted ones.
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

  const issues = parsed.error.issues.map((issue) => {
    const name = String(issue.path[0]);
    const raw = input[name];
    // citty only ever yields primitives or string[]; the array case is handled above.
    const value = Array.isArray(raw) ? raw.join(',') : String((raw ?? '') as boolean | number | string);
    return { flag: `--${kebabCase(name)}`, message: issue.message, value };
  });

  const [first] = issues;
  if (issues.length === 1) throw flagValueError(first.flag, first.value, first.message);
  throw flagValuesError(issues);
}
