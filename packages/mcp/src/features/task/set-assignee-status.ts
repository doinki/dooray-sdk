import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskSetAssigneeStatusArgs } from '@dooray-sdk/core';
import { runTaskSetAssigneeStatus } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  memberId: z.string().describe('Assignee member id or `@me`; from member_search or project_member_list.'),
  ref: taskScopeShape.ref,
  statusId: z.string().describe('Status id to set for this assignee; from project_status_list.'),
} satisfies Record<keyof TaskScopedArgs<TaskSetAssigneeStatusArgs>, z.ZodType>;

export function registerTaskSetAssigneeStatus(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_set_assignee_status',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Set one assignee's personal status on a task (not the task's overall status).",
      inputSchema,
      title: 'Set assignee status',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskSetAssigneeStatus({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
