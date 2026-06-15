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
  parentId: z.string().describe('Parent task id, in the same project; from task_list.'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskSetParentArgs>, z.ZodType>;

export function registerTaskSetParent(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_set_parent',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Re-parent a task as a subtask of parentId within the same project.',
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
