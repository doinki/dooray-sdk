import type { DoorayClientOptions } from '@dooray-sdk/client/lib';
import { isError } from '@dooray-sdk/core/utils';
import chalk from 'chalk';

export type VerboseClientOptions = Pick<DoorayClientOptions, 'onRequest' | 'onResponse'>;

interface VerboseTheme {
  body: (value: string) => string;
  headerName: (value: string) => string;
  muted: (value: string) => string;
  redacted: (value: string) => string;
  request: (value: string) => string;
  response: (value: string) => string;
  section: (value: string) => string;
  status: (value: string) => string;
  truncated: (value: string) => string;
  url: (value: string) => string;
}

const BODY_PREVIEW_LIMIT = 16_384;
const REDACTED_HEADERS = new Set(['authorization', 'cookie', 'proxy-authorization', 'set-cookie', 'x-api-key']);
const DEFAULT_THEME: VerboseTheme = {
  body: chalk.white,
  headerName: chalk.cyan,
  muted: chalk.dim,
  redacted: chalk.red,
  request: chalk.blueBright,
  response: chalk.greenBright,
  section: chalk.bold,
  status: chalk.yellow,
  truncated: chalk.yellow,
  url: chalk.underline,
};

export function createVerboseClientOptions(
  verbose?: boolean,
  stderr: NodeJS.WritableStream = process.stderr,
): VerboseClientOptions {
  if (!verbose) return {};

  return {
    async onRequest(request) {
      stderr.write(
        `${DEFAULT_THEME.request('>')} ${DEFAULT_THEME.request(request.method)} ${DEFAULT_THEME.url(request.url)}\n`,
      );
      writeHeaders(stderr, '>', request.headers, DEFAULT_THEME);
      await writeBodyPreview(stderr, '>', request.clone(), DEFAULT_THEME);
    },
    async onResponse(request, response) {
      stderr.write(
        `${DEFAULT_THEME.response('<')} ${DEFAULT_THEME.status(String(response.status))} ${DEFAULT_THEME.response(request.method)} ${DEFAULT_THEME.url(request.url)}\n`,
      );
      writeHeaders(stderr, '<', response.headers, DEFAULT_THEME);
      await writeBodyPreview(stderr, '<', response.clone(), DEFAULT_THEME);
    },
  };
}

function writeHeaders(stderr: NodeJS.WritableStream, marker: '<' | '>', headers: Headers, theme: VerboseTheme): void {
  const entries = Array.from(headers);
  if (entries.length === 0) return;

  stderr.write(`${formatMarker(marker, theme)} ${theme.section('headers')}:\n`);
  for (const [name, value] of entries) {
    const key = name.toLowerCase();
    const outputValue = REDACTED_HEADERS.has(key) ? theme.redacted('<redacted>') : theme.muted(value);
    stderr.write(`${formatMarker(marker, theme)}   ${theme.headerName(key)}: ${outputValue}\n`);
  }
}

async function writeBodyPreview(
  stderr: NodeJS.WritableStream,
  marker: '<' | '>',
  message: Request | Response,
  theme: VerboseTheme,
): Promise<void> {
  if (!message.body) return;

  try {
    const body = await message.text();
    if (body === '') return;

    const preview = body.length > BODY_PREVIEW_LIMIT ? `${body.slice(0, BODY_PREVIEW_LIMIT)}\n<truncated>` : body;

    stderr.write(`${formatMarker(marker, theme)} ${theme.section('body')}:\n`);
    for (const line of preview.split('\n')) {
      const formattedLine = line === '<truncated>' ? theme.truncated(line) : theme.body(line);
      stderr.write(`${formatMarker(marker, theme)}   ${formattedLine}\n`);
    }
  } catch (error: unknown) {
    const message = isError(error) ? error.message : 'unknown error';
    stderr.write(
      `${formatMarker(marker, theme)} ${theme.section('body')}: ${theme.redacted(`<unavailable: ${message}>`)}\n`,
    );
  }
}

function formatMarker(marker: '<' | '>', theme: VerboseTheme): string {
  return marker === '>' ? theme.request(marker) : theme.response(marker);
}
