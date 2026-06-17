import { runWikiProjectFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const wikiProjectFileDownloadArgsSchema = z.object({
  attachFileId: z.string().min(1).describe('Attach file id (from `dooray wiki view`)'),
  outputPath: z
    .string()
    .min(1)
    .describe('Path including the filename to write (e.g. ./diagram.png); overwrites any existing file'),
});

export default defineSubcommand({
  args: {
    'attach-file-id': {
      description: wikiProjectFileDownloadArgsSchema.shape.attachFileId.description,
      required: true,
      type: 'string',
      valueHint: 'attachFileId',
    },
    'output-path': {
      description: wikiProjectFileDownloadArgsSchema.shape.outputPath.description,
      required: true,
      type: 'string',
      valueHint: 'path',
    },
  },
  meta: { description: 'Download a wiki-level attach file to a local file', name: 'project-file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiProjectFileDownload,
      schema: wikiProjectFileDownloadArgsSchema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiProjectFileDownload>>): string {
  return renderKeyValue([
    ['Path', data.path],
    ['Size', data.size],
  ]);
}
