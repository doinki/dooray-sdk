import { runTaskCommentCreate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { csvField, requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskCommentCreateArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('Comment body (Markdown unless --mime-type is text/html)'),
    fileIds: csvField(
      'Attachment file ids (comma-separated; from `dooray task file-upload` or `dooray task file-list`)',
      'id[,id...]',
    ),
    mimeType: z
      .enum(BODY_MIME_TYPES)
      .optional()
      .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskCommentCreateArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Post a comment to a task's timeline", name: 'comment-create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskCommentCreate,
      schema: taskCommentCreateArgsSchema,
    });

    formatter.printInfo(`Created comment \`${result.data.id}\`.`);
  },
});
