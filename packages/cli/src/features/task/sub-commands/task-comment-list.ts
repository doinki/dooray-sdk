import { runTaskCommentList } from '@dooray-sdk/core';
import { COMMENT_SORTS } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { allSchema } from '../../../shared/schemas/fields';
import { renderList } from '../../../shared/utils/table';
import { formatDateTime, truncate } from '../../../shared/utils/text';
import { formatCreator } from '../../../shared/utils/user';

export type CommentSort = (typeof COMMENT_SORTS)[number];

const schema = z.object({
  all: allSchema,
  page: pageSchema,
  size: sizeSchema,
  sort: z
    .enum(COMMENT_SORTS)
    .optional()
    .describe('Sort by created date: `created` (oldest first, default) or `-created` (newest first).'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: "List a task's comments and system events (oldest-first)",
    name: 'comment-list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCommentList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No comments.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (c) => c.id },
    { header: 'author', value: (c) => formatCreator(c.creator) },
    {
      header: 'from',
      value: (c) => (c.mailUsers?.from ? `${c.mailUsers.from.name}(${c.mailUsers.from.emailAddress})` : ''),
    },
    { header: 'to', value: (c) => (c.mailUsers?.to ?? []).map((u) => `${u.name}(${u.emailAddress})`).join(', ') },
    { header: 'cc', value: (c) => (c.mailUsers?.cc ?? []).map((u) => `${u.name}(${u.emailAddress})`).join(', ') },
    { header: 'attachments', value: (c) => (c.files ?? []).map((file) => `${file.name ?? ''}(${file.id})`).join(', ') },
    { header: 'type', value: (c) => c.type },
    { header: 'subtype', value: (c) => c.subtype },
    { header: 'mimeType', value: (c) => c.body.mimeType },
    { header: 'createdAt', value: (c) => formatDateTime(c.createdAt) },
    { header: 'updatedAt', value: (c) => (c.modifiedAt ? formatDateTime(c.modifiedAt) : '') },
    { header: 'body', value: (c) => truncate(c.body.content.replaceAll(/\s+/g, ' ').trim(), 60) },
  ]);
}
