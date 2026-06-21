import { runTaskCommentUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
import { mimeTypeField } from '../utils/fields';

const schema = z.object({
  body: z
    .string()
    .min(1)
    .meta({ hint: 'text' })
    .describe('New comment body (Markdown unless --mime-type is text/html). Replaces the whole body.'),
  commentId: z
    .string()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id to update (from `dooray task comment-list`)'),
  fileIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Attachment file ids (comma-separated). Replaces the whole list; omit to keep current.')
    .meta({ hint: 'id[,id...]' }),
  mimeType: mimeTypeField(),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: 'Edit a task comment (body and --file-ids each replace the whole value)',
    name: 'comment-update',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskCommentUpdate,
      schema,
    });

    formatter.printInfo(`Updated comment \`${result.data.id}\`.`);
  },
});
