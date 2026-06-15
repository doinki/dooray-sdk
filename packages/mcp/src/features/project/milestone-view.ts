import type { DoorayApi } from '@dooray-sdk/client';
import type { MilestoneViewArgs } from '@dooray-sdk/core';
import { runProjectMilestoneView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('Milestone id; from project_milestone_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<MilestoneViewArgs>, z.ZodType>;

export function registerProjectMilestoneView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_milestone_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a milestone's detail.",
      inputSchema,
      title: 'View milestone',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMilestoneView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
