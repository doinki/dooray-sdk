import type { WikiFileUploadArgs } from '@dooray-sdk/core';
import { runWikiFileUpload } from '@dooray-sdk/core';
import { WIKI_FILE_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { formatDateTime } from '../../../shared/utils/text';

const schema = globalArgsSchema.extend({
  contentType: z
    .string()
    .optional()
    .meta({ hint: 'mime' })
    .describe('MIME type. Omit to infer from the file extension.'),
  filePath: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'path', positional: true })
    .describe('Path of the local file to upload.'),
  type: z.enum(WIKI_FILE_TYPES).optional().describe('File type: `general` or `inline_image` (default: `general`).'),
} satisfies CommandSchemaShape<WikiFileUploadArgs>);

export default defineSubcommand({
  meta: {
    description:
      'Attach a local file to a wiki page (use `dooray wiki project-file-upload` for a wiki-level file not tied to a page)',
    name: 'file-upload',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiFileUpload,
      schema,
    });

    formatter.printInfo(`Uploaded file \`${result.data.id}\`.`);
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiFileUpload>>): string {
  return renderKeyValue([
    ['id', data.id],
    ['name', data.name],
    ['type', data.type],
    ['extension', data.extension],
    ['mimeType', data.mimeType],
    ['size', data.size],
    ['attachFileId', data.attachFileId],
    ['pageFileId', data.pageFileId],
    ['createdAt', formatDateTime(data.createdAt)],
  ]);
}
