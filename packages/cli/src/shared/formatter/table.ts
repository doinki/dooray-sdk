import columnify from 'columnify';

interface Column<T> {
  align?: 'left' | 'right';
  header: string;
  value: (row: T) => unknown;
}

export function renderList<T>(
  rows: readonly T[],
  columns: ReadonlyArray<Column<T>>,
  options: {
    columnSplitter?: string;
  } = {},
): string {
  const keyed = columns.map((column) => ({ column, key: toSnakeCase(column.header) }));

  const config: Record<string, { align: 'left' | 'right' }> = {};
  for (const { column, key } of keyed) if (column.align) config[key] = { align: column.align };

  const data = rows.map((row) => {
    const cells: Record<string, unknown> = {};
    for (const { column, key } of keyed) cells[key] = formatCell(column.value(row));
    return cells;
  });

  return columnify(data, {
    columns: keyed.map(({ key }) => key),
    config,
    ...(options.columnSplitter ? { columnSplitter: options.columnSplitter } : {}),
  });
}

function formatCell(value: unknown): unknown {
  if (value === undefined || value === null || value === '') return '-';
  return value;
}

function toSnakeCase(value: string): string {
  return value
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replaceAll('-', '_')
    .toLowerCase();
}
