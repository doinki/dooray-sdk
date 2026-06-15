import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCommentDeleteArgs } from '@dooray-sdk/core';
import { runTaskCommentDelete } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  commentId: z.string().describe('Comment id to delete; from task_comment_list.'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskCommentDeleteArgs>, z.ZodType>;

export function registerTaskCommentDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_comment_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Delete a comment from a task. Irreversible.',
      inputSchema,
      title: 'Delete task comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskCommentDelete({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
