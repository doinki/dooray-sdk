import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskMoveArgs } from '@dooray-sdk/core';
import { runTaskMove } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  includeSubTasks: z.boolean().optional().describe("Move the task's subtasks along with it (default: true)."),
  ref: taskScopeShape.ref,
  targetProjectId: z.string().describe('Destination project id; from project_list.'),
} satisfies Record<keyof TaskScopedArgs<TaskMoveArgs>, z.ZodType>;

export function registerTaskMove(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_move',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Move a task to another project; clears the task's status and tags. Irreversible.",
      inputSchema,
      title: 'Move task',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskMove({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
