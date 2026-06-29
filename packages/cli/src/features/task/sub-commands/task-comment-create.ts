import { runTaskCommentCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/utils/csv';
import { mimeTypeField } from '../utils/fields';

const schema = globalArgsSchema.extend({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Comment body (Markdown unless --mime-type is `text/html`).'),
  fileIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'id[,id...]' })
    .describe('Attachment ids (comma-separated; from `dooray task file-upload` or `dooray task file-list`).'),
  mimeType: mimeTypeField(),
});

export default defineSubcommand({
  meta: { description: 'Post a comment to a task', name: 'comment-create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskCommentCreate,
      schema,
    });

    formatter.printInfo(`Created comment \`${result.data.id}\`.`);
  },
  schema,
});
