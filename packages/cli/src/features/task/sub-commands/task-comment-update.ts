import { runTaskCommentUpdate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

export const taskCommentUpdateArgsSchema = z
  .object({
    body: z
      .string()
      .min(1)
      .describe('New comment body (Markdown unless --mime-type is text/html). Replaces the whole body.'),
    commentId: z.string().min(1).describe('Comment id to update (from `dooray task comment-list`)'),
    fileIds: z
      .string()
      .transform(splitCsv)
      .optional()
      .describe('Attachment file ids (comma-separated). Replaces the whole list; omit to keep current.'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    mimeType: z
      .enum(BODY_MIME_TYPES)
      .optional()
      .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown)'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    body: {
      description: taskCommentUpdateArgsSchema.shape.body.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
    'comment-id': {
      description: taskCommentUpdateArgsSchema.shape.commentId.description,
      required: true,
      type: 'string',
      valueHint: 'commentId',
    },
    'file-ids': {
      description: taskCommentUpdateArgsSchema.shape.fileIds.description,
      type: 'string',
      valueHint: 'id[,id...]',
    },
    id: {
      description: taskCommentUpdateArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'mime-type': {
      description: taskCommentUpdateArgsSchema.shape.mimeType.description,
      options: [...BODY_MIME_TYPES],
      type: 'enum',
    },
    ref: { ...globalArgs.ref, description: taskCommentUpdateArgsSchema.shape.ref.description, required: false },
  },
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
      render: renderPretty,
      run: runTaskCommentUpdate,
      schema: taskCommentUpdateArgsSchema,
    });

    formatter.printInfo(`Updated comment \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentUpdate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
