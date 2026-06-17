import type { Paging } from '@dooray-sdk/client/lib';
import type { SurfaceError } from '@dooray-sdk/core/errors';
import { extractMessage } from '@dooray-sdk/core/utils';
import chalk from 'chalk';
import columnify from 'columnify';

/** Render the data for human consumption, or return `null` to print nothing (empty result). */
export type Render<T> = (data: T) => null | string;

export type KeyValueRows = Array<readonly [key: string, value: unknown]>;

export interface OutputFormatter {
  printData<T>(data: T, render: Render<T>): void;
  printError(error: SurfaceError): void;
  printInfo(line: string): void;
}

export interface OutputFormatterOptions {
  json?: boolean;
  stderr?: NodeJS.WritableStream;
  stdout?: { isTTY?: boolean } & NodeJS.WritableStream;
}

export function createOutputFormatter(options: OutputFormatterOptions = {}): OutputFormatter {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  // Rendered text is the default; JSON is opt-in via `--json`. Piping (non-TTY)
  // keeps the table so `dooray ... | grep` stays composable, like gh.
  const json = options.json ?? false;
  const colors = createColorScheme(Boolean(stdout.isTTY) && !json);

  const writeLine = (stream: NodeJS.WritableStream, line: string): void => {
    stream.write(`${line}\n`);
  };

  return {
    printData(data, render) {
      if (json) {
        writeLine(stdout, JSON.stringify(data, null, 2));
        return;
      }
      const rendered = render(data);
      if (rendered !== null) writeLine(stdout, rendered);
    },
    printError(error) {
      if (json) {
        writeLine(stdout, JSON.stringify({ error: extractMessage(error) }));
        return;
      }
      writeLine(stderr, `${colors.error('error:')} ${error.message}`);
      if (error.hint) writeLine(stderr, `${colors.muted('hint:')} ${error.hint}`);
    },
    printInfo(line) {
      if (!json) writeLine(stderr, line);
    },
  };
}

interface ColorScheme {
  error: (text: string) => string;
  muted: (text: string) => string;
}

function createColorScheme(enabled: boolean): ColorScheme {
  if (!enabled) return { error: (text) => text, muted: (text) => text };
  return { error: chalk.red, muted: chalk.grey };
}

/** One-line paging summary. Goes to stderr via `printInfo` — never mixed into stdout data. */
export function renderPagingFooter(paging: Paging): string {
  const currentPage = paging.page + 1;
  const totalPages = Math.max(1, Math.ceil(paging.totalElements / paging.size));
  // `page X/Y` is 1-based for humans; the --page flag itself is 0-based, so say so inline.
  const nextHint = paging.hasNext ? ` — next: --page=${String(paging.page + 1)} (0-based)` : '';
  return `page ${currentPage}/${totalPages}, size: ${paging.size}${nextHint}`;
}

export function renderKeyValue(rows: KeyValueRows): string {
  return columnify(
    rows.map(([key, value]) => ({
      key: `${key}:`,
      value: formatKeyValue(value),
    })),
    {
      columns: ['key', 'value'],
      columnSplitter: '   ',
      showHeaders: false,
    },
  );
}

function formatKeyValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '-';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);

  // oxlint-disable-next-line typescript/no-base-to-string
  return String(value);
}
