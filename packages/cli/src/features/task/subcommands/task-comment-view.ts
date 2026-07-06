import type { TaskCommentViewArgs } from '@dooray-sdk/core';
import { runTaskCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { formatDateTime } from '../../../shared/utils/text';
import { formatCreator, formatMailUser } from '../../../shared/utils/user';

const schema = globalArgsSchema.extend({
  commentId: z
    .string()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id (from `dooray task comment-list`).'),
} satisfies CommandSchemaShape<TaskCommentViewArgs>);

export default defineSubcommand({
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
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['taskId', data.post.id],
    ['author', formatCreator(data.creator)],
    ['from', data.mailUsers?.from ? formatMailUser(data.mailUsers.from) : undefined],
    ['to', (data.mailUsers?.to ?? []).map(formatMailUser).join(', ')],
    ['cc', (data.mailUsers?.cc ?? []).map(formatMailUser).join(', ')],
    ['attachments', (data.files ?? []).map((file) => `${file.name ?? ''}(${file.id})`).join(', ')],
    ['type', data.type],
    ['subtype', data.subtype],
    ['mimeType', data.body.mimeType],
    ['createdAt', formatDateTime(data.createdAt)],
    ['updatedAt', formatDateTime(data.modifiedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
