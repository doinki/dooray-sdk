import { runTaskCommentDelete } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const taskCommentDeleteArgsSchema = z
  .object({
    commentId: z.string().min(1).describe('Comment id to delete (from `dooray task comment-list`)'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    yes: z.boolean().default(false).describe('Skip the confirmation prompt'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    'comment-id': {
      description: taskCommentDeleteArgsSchema.shape.commentId.description,
      required: true,
      type: 'string',
      valueHint: 'commentId',
    },
    id: {
      description: taskCommentDeleteArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskCommentDeleteArgsSchema.shape.ref.description, required: false },
    yes: { description: taskCommentDeleteArgsSchema.shape.yes.description, type: 'boolean' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a comment from a task (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { commentId, yes } = parseArgsOrThrow(taskCommentDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
      message: `Delete comment \`${commentId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveTaskId({ id: args.id, ref: args.ref });
    const result = await runTaskCommentDelete({ api, args: { commentId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted comment \`${commentId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
