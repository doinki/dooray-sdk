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
  id: z.string().describe('Milestone id; from project_milestone_list.'),
  name: z.string().optional().describe('New milestone name.'),
  ref: projectScopeShape.ref,
  startDate: z
    .string()
    .optional()
    .describe('New start date with timezone offset (e.g. `2026-07-22+09:00`); pair with endDate.'),
  state: z.enum(MILESTONE_STATES).optional().describe('`open` to reopen or `closed` to close.'),
} satisfies Record<keyof ProjectScopedArgs<MilestoneUpdateArgs>, z.ZodType>;

export function registerProjectMilestoneUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_milestone_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Update a milestone's name, date range, or open/closed state; omit a field to leave it unchanged.",
      inputSchema,
      title: 'Update milestone',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMilestoneUpdate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
