import { spawnSync } from 'node:child_process';

import type { Paging } from '@dooray-sdk/client/lib';
import type { SurfaceError } from '@dooray-sdk/core/errors';
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
  /** Project the JSON payload down to these fields (implies JSON). */
  fields?: string[];
  /** jq expression to filter the JSON output through (implies JSON). */
  jq?: string;
  json?: boolean;
  stderr?: NodeJS.WritableStream;
  stdout?: { isTTY?: boolean } & NodeJS.WritableStream;
}

export function createOutputFormatter(options: OutputFormatterOptions = {}): OutputFormatter {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const { fields, jq } = options;
  // Rendered text is the default; JSON is opt-in via `--json` (and implied by `--jq`/`--fields`).
  // Piping (non-TTY) keeps the table so `dooray ... | grep` stays composable, like gh.
  const json = (options.json ?? false) || jq !== undefined || fields !== undefined;
  const colors = createColorScheme(Boolean(stdout.isTTY) && !json);

  const writeLine = (stream: NodeJS.WritableStream, line: string): void => {
    stream.write(`${line}\n`);
  };

  return {
    printData(data, render) {
      if (jq !== undefined) {
        writeLine(stdout, applyJq(jq, JSON.stringify(data)));
        return;
      }
      if (fields !== undefined) {
        writeLine(stdout, JSON.stringify(projectFields(data, fields), null, 2));
        return;
      }
      if (json) {
        writeLine(stdout, JSON.stringify(data, null, 2));
        return;
      }
      const rendered = render(data);
      if (rendered !== null) writeLine(stdout, rendered);
    },
    printError(error) {
      if (json) {
        writeLine(stdout, JSON.stringify({ error: error.message, hint: error.hint }));
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

/** Pick fields from the result's primary payload (`result.data`), mapping over arrays. */
function projectFields(data: unknown, fields: readonly string[]): unknown {
  const payload = isEnvelope(data) ? data.data : data;
  const pick = (item: unknown): Record<string, unknown> => {
    if (item === null || typeof item !== 'object') return {};
    const source = item as Record<string, unknown>;
    return Object.fromEntries(fields.filter((field) => field in source).map((field) => [field, source[field]]));
  };

  return Array.isArray(payload) ? payload.map((item) => pick(item)) : pick(payload);
}

function isEnvelope(data: unknown): data is { data: unknown } {
  return data !== null && typeof data === 'object' && !Array.isArray(data) && 'data' in data;
}

/** Run `json` through the system `jq` binary and return its output. */
function applyJq(expression: string, json: string): string {
  const result = spawnSync('jq', [expression], { encoding: 'utf8', input: json });
  if (result.error) {
    const code = (result.error as NodeJS.ErrnoException).code;
    throw new Error(code === 'ENOENT' ? '--jq requires the `jq` binary on your PATH.' : result.error.message);
  }
  if (result.status !== 0) throw new Error(result.stderr.trim() || 'jq exited with an error.');

  return result.stdout.replace(/\n$/, '');
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
