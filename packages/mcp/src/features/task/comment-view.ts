import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCommentViewArgs } from '@dooray-sdk/core';
import { runTaskCommentView } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  commentId: z.string().describe('19-digit comment id (not the comment body); resolve via task_comment_list first.'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskCommentViewArgs>, z.ZodType>;

export function registerTaskCommentView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_comment_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "Fetch one task comment's full detail. Use task_comment_list for the whole timeline.",
      inputSchema,
      title: 'View task comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskCommentView({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
