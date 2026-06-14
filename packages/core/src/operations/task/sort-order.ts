export function toOrder(sort: string | undefined, fields: Readonly<Record<string, string>>): string | undefined {
  if (!sort) return;

  const desc = sort.startsWith('-');
  const base = desc ? sort.substring(1) : sort;
  const field = fields[base] ?? base;

  return desc ? `-${field}` : field;
}
