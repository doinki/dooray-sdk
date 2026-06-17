import { runWikiFileDownload } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const wikiFileDownloadArgsSchema = z
  .object({
    fileId: z.string().min(1).describe('Page file id (from `dooray wiki view`)'),
    id: z
      .string()
      .optional()
      .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
    outputPath: z
      .string()
      .min(1)
      .describe('Path including the filename to write (e.g. ./diagram.png); overwrites any existing file'),
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    'file-id': {
      description: wikiFileDownloadArgsSchema.shape.fileId.description,
      required: true,
      type: 'string',
      valueHint: 'fileId',
    },
    id: {
      description: wikiFileDownloadArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    'output-path': {
      description: wikiFileDownloadArgsSchema.shape.outputPath.description,
      required: true,
      type: 'string',
      valueHint: 'path',
    },
    ref: { ...globalArgs.ref, description: wikiFileDownloadArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Download a wiki page attachment to a local file', name: 'file-download' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiFileDownload,
      schema: wikiFileDownloadArgsSchema,
    });

    formatter.printInfo(`Downloaded to \`${result.data.path}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileDownload>>): string {
  return renderKeyValue([
    ['Path', data.path],
    ['Size', data.size],
  ]);
}
