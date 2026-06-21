import { runTaskCommentCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
import { mimeTypeField } from '../utils/fields';

const schema = z.object({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Comment body (Markdown unless --mime-type is text/html)'),
  fileIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Attachment file ids (comma-separated; from `dooray task file-upload` or `dooray task file-list`)')
    .meta({ hint: 'id[,id...]' }),
  mimeType: mimeTypeField(),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "Post a comment to a task's timeline", name: 'comment-create' },
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
});
