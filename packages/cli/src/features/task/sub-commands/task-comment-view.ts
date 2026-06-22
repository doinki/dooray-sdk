import { runTaskCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { formatDateTime } from '../../../shared/utils/text';

const schema = z.object({
  commentId: z
    .string()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id to view (from `dooray task comment-list`)'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "View a task comment's full detail", name: 'comment-view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCommentView,
      schema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['type', data.type],
    ['created', formatDateTime(data.createdAt)],
    ['updated', formatDateTime(data.modifiedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
