import type { DoorayApi } from '@dooray-sdk/client';
import type { StatusDeleteArgs } from '@dooray-sdk/core';
import { runProjectStatusDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('Status id to delete; from project_status_list.'),
  moveTo: z.string().describe('Status id that receives the deleted status’s tasks; from project_status_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<StatusDeleteArgs>, z.ZodType>;

export function registerProjectStatusDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_status_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Delete a task status from a project; its tasks move to the status given in moveTo. Irreversible.',
      inputSchema,
      title: 'Delete status',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectStatusDelete({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
