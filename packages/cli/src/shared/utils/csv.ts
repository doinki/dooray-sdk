/**
 * Split a comma-separated CLI value into trimmed, non-empty tokens.
 * Used by schemas that accept `a,b,c`-style flags (e.g. ids, emails, events).
 */
export function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token.length > 0);
}
