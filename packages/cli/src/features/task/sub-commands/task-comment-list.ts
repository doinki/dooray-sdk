import { runTaskCommentList } from '@dooray-sdk/core';
import { COMMENT_SORTS } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';
import { formatDateTime, truncate } from '../../../shared/formatter/text';

export type CommentSort = (typeof COMMENT_SORTS)[number];

export const taskCommentListArgsSchema = z
  .object({
    all: z.boolean().optional().describe('Fetch every page of comments (overrides --page/--size)'),
    id: z
      .string()
      .optional()
      .describe(
        'Task ID whose comments to list (19-digit). Looked up across all accessible projects when given alone.',
      ),
    page: pageSchema,
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    size: sizeSchema,
    sort: z
      .enum(COMMENT_SORTS)
      .optional()
      .describe('Sort by created date (prefix with `-` to reverse; default oldest first)'),
  })
  .refine((args) => args.ref !== undefined || args.id !== undefined, {
    message: 'Provide the task to view: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    all: {
      description: taskCommentListArgsSchema.shape.all.description,
      type: 'boolean',
    },
    id: {
      description: taskCommentListArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    page: {
      description: taskCommentListArgsSchema.shape.page.description,
      type: 'string',
      valueHint: 'n',
    },
    ref: { ...globalArgs.ref, required: false },
    size: {
      description: taskCommentListArgsSchema.shape.size.description,
      type: 'string',
      valueHint: 'n',
    },
    sort: {
      description: taskCommentListArgsSchema.shape.sort.description,
      options: [...COMMENT_SORTS],
      required: false,
      type: 'enum',
      valueHint: 'sort',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "List a task's comments and system events (oldest-first; --all fetches every page)" },
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
