import { runWikiFileUpload } from '@dooray-sdk/core';
import { WIKI_FILE_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const wikiFileUploadArgsSchema = z
  .object({
    contentType: z.string().trim().optional().describe('MIME type; omit to infer from the file extension'),
    filePath: z.string().min(1).describe('Path of the local file to upload'),
    id: z
      .string()
      .optional()
      .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
    type: z.enum(WIKI_FILE_TYPES).optional().describe('File type: general or inline_image (default: general)'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    'content-type': {
      description: wikiFileUploadArgsSchema.shape.contentType.description,
      type: 'string',
      valueHint: 'mime',
    },
    'file-path': {
      description: wikiFileUploadArgsSchema.shape.filePath.description,
      required: true,
      type: 'string',
      valueHint: 'path',
    },
    id: {
      description: wikiFileUploadArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    ref: { ...globalArgs.ref, description: wikiFileUploadArgsSchema.shape.ref.description, required: false },
    type: {
      description: wikiFileUploadArgsSchema.shape.type.description,
      options: [...WIKI_FILE_TYPES],
      type: 'enum',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Attach a local file to a wiki page', name: 'file-upload' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiFileUpload,
      schema: wikiFileUploadArgsSchema,
    });

    formatter.printInfo(`Uploaded file \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileUpload>>): string {
  return renderKeyValue([
    ['ID', data.id],
    ['Name', data.name],
  ]);
}
