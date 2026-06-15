import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskViewArgs } from '@dooray-sdk/core';
import { runTaskView } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskViewArgs>, z.ZodType>;

export function registerTaskView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a task's full detail, including body, assignees, status, and attached file metadata.",
      inputSchema,
      title: 'View task',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskView({ api, args: { id, projectId } }).then((r) => r.data);
      }),
  );
}
