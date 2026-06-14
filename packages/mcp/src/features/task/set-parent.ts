import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskSetParentArgs } from '@dooray-sdk/core';
import { runTaskSetParent } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  parentId: z
    .string()
    .describe(
      '19-digit id of the parent task (not a name); resolve via task_list first. Must be in the same project as the task.',
    ),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskSetParentArgs>, z.ZodType>;

export function registerTaskSetParent(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_set_parent',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Re-parent a task as a subtask of parentId within the same project. To relocate a task across projects use task_move instead.',
      inputSchema,
      title: 'Set task parent',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskSetParent({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
