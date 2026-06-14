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
  id: z.string().describe('19-digit status id to delete (not a name); resolve via project_status_list first'),
  moveTo: z
    .string()
    .describe(
      '19-digit status id that receives the moved tasks (not a name) — every task in the deleted status moves here; resolve via project_status_list first',
    ),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<StatusDeleteArgs>, z.ZodType>;

export function registerProjectStatusDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_status_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Delete one task status from a project; every task in it moves to the replacement status given in moveTo.',
      inputSchema,
      title: 'Delete project status',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectStatusDelete({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
