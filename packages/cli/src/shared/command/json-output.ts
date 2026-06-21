import { splitCsv } from '../utils/csv';

/**
 * `--json` is a string selector, not a boolean (citty coerces a value-less string flag to `''`):
 * - absent / `--no-json` → `undefined`/`false` → human-rendered output
 * - bare `--json` → `''` → the full JSON object
 * - `--json id,name` → project each item down to those fields
 */

/** Is JSON output requested? Bare `--json` and a field list both count; absent / `--no-json` don't. */
export function isJsonOutput(value: unknown): boolean {
  return typeof value === 'string';
}

/** The fields to project the JSON payload down to, or `undefined` for the full object. */
export function jsonFields(value: unknown): string[] | undefined {
  return typeof value === 'string' && value.length > 0 ? splitCsv(value) : undefined;
}

/** Resolve the `--json` default from $DOORAY_JSON: unset/`false` → off; `true` → full object; otherwise a field list. */
export function jsonEnvDefault(env = process.env.DOORAY_JSON): string | undefined {
  if (env === undefined || env === 'false') return undefined;
  return env === 'true' ? '' : env;
}
