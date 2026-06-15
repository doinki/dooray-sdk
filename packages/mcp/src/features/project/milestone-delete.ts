import type { DoorayApi } from '@dooray-sdk/client';
import type { MilestoneDeleteArgs } from '@dooray-sdk/core';
import { runProjectMilestoneDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('Milestone id; from project_milestone_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<MilestoneDeleteArgs>, z.ZodType>;

export function registerProjectMilestoneDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_milestone_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Delete a milestone from a project; its tasks remain but lose the milestone reference. Irreversible.',
      inputSchema,
      title: 'Delete milestone',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMilestoneDelete({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
