import type { z } from 'zod';

import { flagValueError, flagValuesError } from '../error/flag-errors';

const UPPERCASE_CHAR = /[A-Z]/g;
const KEBAB_SEGMENT = /-([a-z0-9])/g;

function toFlag(field: string): string {
  return `--${field.replaceAll(UPPERCASE_CHAR, (char) => `-${char.toLowerCase()}`)}`;
}

function camelize(key: string): string {
  return key.includes('-') ? key.replaceAll(KEBAB_SEGMENT, (_, char: string) => char.toUpperCase()) : key;
}

export type ArgInput = Record<string, boolean | number | string | string[] | undefined>;

/** Extract the `id`/`ref` scope pair from raw args as strings (citty values are loosely typed). */
export function scopeRef(args: ArgInput): { id?: string; ref?: string } {
  return {
    id: typeof args.id === 'string' ? args.id : undefined,
    ref: typeof args.ref === 'string' ? args.ref : undefined,
  };
}

function camelizeKeys(input: ArgInput): ArgInput {
  const out: ArgInput = {};
  for (const key of Object.keys(input)) out[camelize(key)] = input[key];

  return out;
}

export function parseArgsOrThrow<S extends z.ZodType>(schema: S, rawInput: ArgInput): z.infer<S> {
  const input = camelizeKeys(rawInput);
  const parsed = schema.safeParse(input);
  if (parsed.success) return parsed.data;

  const issues = parsed.error.issues.map((issue) => {
    const name = String(issue.path[0]);
    const raw = input[name];
    const value = Array.isArray(raw) ? raw.join(',') : String(raw ?? '');
    return { flag: toFlag(name), message: issue.message, value };
  });

  const [first] = issues;
  if (issues.length === 1) throw flagValueError(first.flag, first.value, first.message);
  throw flagValuesError(issues);
}
