import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCloseArgs } from '@dooray-sdk/core';
import { runTaskClose } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskCloseArgs>, z.ZodType>;

export function registerTaskClose(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_close',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Mark a task done — sets it to the project's closed status and completes every assignee's status.",
      inputSchema,
      title: 'Close task',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskClose({ api, args: { id, projectId } }).then((r) => r.data);
      }),
  );
}
