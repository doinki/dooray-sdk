import { runTaskCommentList } from '@dooray-sdk/core';
import { COMMENT_SORTS } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { allField, requireTaskRef, taskRefShape } from '../../../shared/utils/fields';
import { renderList } from '../../../shared/utils/table';
import { formatDateTime, truncate } from '../../../shared/utils/text';

export type CommentSort = (typeof COMMENT_SORTS)[number];

export const taskCommentListArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    all: allField,
    page: pageSchema,
    size: sizeSchema,
    sort: z
      .enum(COMMENT_SORTS)
      .optional()
      .describe('Sort by created date (prefix with `-` to reverse; default oldest first)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskCommentListArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "List a task's comments and system events (oldest-first; --all fetches every page)",
    name: 'comment-list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCommentList,
      schema: taskCommentListArgsSchema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No comments.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCommentList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (c) => c.id },
    { header: 'type', value: (c) => c.type },
    { header: 'created', value: (c) => formatDateTime(c.createdAt) },
    { header: 'body', value: (c) => truncate(c.body.content.replaceAll(/\s+/g, ' ').trim(), 60) },
  ]);
}
