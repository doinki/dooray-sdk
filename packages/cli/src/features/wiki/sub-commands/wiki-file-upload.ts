import { runWikiFileUpload } from '@dooray-sdk/core';
import { WIKI_FILE_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

export const wikiFileUploadArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    contentType: z
      .string()
      .trim()
      .optional()
      .meta({ hint: 'mime' })
      .describe('MIME type; omit to infer from the file extension'),
    filePath: z.string().min(1).meta({ hint: 'path' }).describe('Path of the local file to upload'),
    type: z.enum(WIKI_FILE_TYPES).optional().describe('File type: general or inline_image (default: general)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiFileUploadArgsSchema),
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
