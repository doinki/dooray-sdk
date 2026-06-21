import { runTaskCommentUpdate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { csvField, requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

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
    mimeType: z
      .enum(BODY_MIME_TYPES)
      .optional()
      .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown)'),
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
