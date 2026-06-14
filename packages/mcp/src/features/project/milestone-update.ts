import type { DoorayApi } from '@dooray-sdk/client';
import type { MilestoneUpdateArgs } from '@dooray-sdk/core';
import { runProjectMilestoneUpdate } from '@dooray-sdk/core';
import { MILESTONE_STATES } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  endDate: z
    .string()
    .optional()
    .describe('New end date with timezone offset (e.g. `2026-08-22+09:00`); pair with startDate.'),
  id: z.string().describe('19-digit milestone id (not a name); resolve via project_milestone_list first.'),
  name: z.string().optional().describe('New milestone name.'),
  ref: projectScopeShape.ref,
  startDate: z
    .string()
    .optional()
    .describe('New start date with timezone offset (e.g. `2026-07-22+09:00`); pair with endDate.'),
  state: z
    .enum(MILESTONE_STATES)
    .optional()
    .describe('`open` to reopen — `closed` to close (closed milestones still appear in project_milestone_list).'),
} satisfies Record<keyof ProjectScopedArgs<MilestoneUpdateArgs>, z.ZodType>;

export function registerProjectMilestoneUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_milestone_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        "Update a milestone's name, date range, or open/closed state — only the fields you pass change. Set `state` to reopen or close it. Provide `startDate` and `endDate` together or neither.",
      inputSchema,
      title: 'Update project milestone',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMilestoneUpdate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
