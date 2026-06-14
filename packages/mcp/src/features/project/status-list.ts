import type { DoorayApi } from '@dooray-sdk/client';
import type { StatusListArgs } from '@dooray-sdk/core';
import { runProjectStatusList } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<StatusListArgs>, z.ZodType>;

export function registerProjectStatusList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_status_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List a project's task statuses, returning each status's id, name, class — backlog, registered, working, closed — and intra-class order. Use it to resolve a status name to the id that task_set_status, task_close, task_create, and task_update require.",
      inputSchema,
      title: 'List project statuses',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectStatusList({ api, args: { projectId } }).then((r) => r.data);
      }),
  );
}
