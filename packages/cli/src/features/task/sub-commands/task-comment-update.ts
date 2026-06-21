import { runTaskCommentUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { csvField, requireTaskRef, taskRefShape } from '../../../shared/utils/fields';
import { mimeTypeField } from '../utils/fields';

export const taskCommentUpdateArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    body: z
      .string()
      .min(1)
      .meta({ hint: 'text' })
      .describe('New comment body (Markdown unless --mime-type is text/html). Replaces the whole body.'),
    commentId: z
      .string()
      .min(1)
      .meta({ hint: 'commentId' })
      .describe('Comment id to update (from `dooray task comment-list`)'),
    fileIds: csvField(
      'Attachment file ids (comma-separated). Replaces the whole list; omit to keep current.',
      'id[,id...]',
    ),
    mimeType: mimeTypeField(),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskCommentUpdateArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
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
      schema: taskCommentUpdateArgsSchema,
    });

    formatter.printInfo(`Updated comment \`${result.data.id}\`.`);
  },
});
