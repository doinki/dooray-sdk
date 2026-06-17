import { runTaskCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/formatter/text';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskCommentViewArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    commentId: z
      .string()
      .min(1)
      .meta({ hint: 'commentId' })
      .describe('Comment id to view (from `dooray task comment-list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskCommentViewArgsSchema),
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
