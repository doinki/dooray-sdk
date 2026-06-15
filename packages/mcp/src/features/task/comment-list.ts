import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCommentListArgs } from '@dooray-sdk/core';
import { runTaskCommentList } from '@dooray-sdk/core';
import { COMMENT_SORTS } from '@dooray-sdk/core/constants';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  all: z.boolean().optional().describe('Fetch all pages in one call; overrides page/size (default: false).'),
  page: pageSchema,
  ref: taskScopeShape.ref,
  size: sizeSchema,
  sort: z
    .enum(COMMENT_SORTS)
    .optional()
    .describe('Order by created date — `created` (oldest first, default) or `-created` (newest first).'),
} satisfies Record<keyof TaskScopedArgs<TaskCommentListArgs>, z.ZodType>;

export function registerTaskCommentList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_comment_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "List a task's comment timeline. Includes system events.",
      inputSchema,
      title: 'List task comments',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskCommentList({ api, args: { ...args, id, projectId } });
      }),
  );
}
