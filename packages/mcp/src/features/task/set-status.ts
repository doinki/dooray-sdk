import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskSetStatusArgs } from '@dooray-sdk/core';
import { runTaskSetStatus } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: taskScopeShape.ref,
  statusId: z
    .string()
    .describe('19-digit status id to move the task to (not a name); resolve via project_status_list first.'),
} satisfies Record<keyof TaskScopedArgs<TaskSetStatusArgs>, z.ZodType>;

export function registerTaskSetStatus(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_set_status',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        "Set a task's status to any project status, including reopening a closed task. Use this over task_close when moving to a non-closed status — task_close only flips to done/closed.",
      inputSchema,
      title: 'Set task status',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskSetStatus({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
