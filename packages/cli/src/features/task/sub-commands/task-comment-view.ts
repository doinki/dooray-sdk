import { runTaskCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/formatter/text';

export const taskCommentViewArgsSchema = z
  .object({
    commentId: z.string().min(1).describe('Comment id to view (from `dooray task comment-list`)'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
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
    'comment-id': {
      description: taskCommentViewArgsSchema.shape.commentId.description,
      required: true,
      type: 'string',
      valueHint: 'commentId',
    },
    id: {
      description: taskCommentViewArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskCommentViewArgsSchema.shape.ref.description, required: false },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "View a task comment's full detail", name: 'comment-view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCommentView,
      schema: taskCommentViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentView>>): string {
  const content = renderKeyValue([
    ['ID', data.id],
    ['Type', data.type],
    ['Created', formatDateTime(data.createdAt)],
    ['Updated', formatDateTime(data.modifiedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
