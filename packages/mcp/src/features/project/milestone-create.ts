import type { DoorayApi } from '@dooray-sdk/client';
import type { MilestoneCreateArgs } from '@dooray-sdk/core';
import { runProjectMilestoneCreate } from '@dooray-sdk/core';
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
    .describe('End date with timezone offset (e.g. `2026-08-22+09:00`); pair with startDate or omit both'),
  name: z.string().trim().describe('Milestone name — e.g. `1단계`'),
  ref: projectScopeShape.ref,
  startDate: z
    .string()
    .optional()
    .describe('Start date with timezone offset (e.g. `2026-06-22+09:00`); pair with endDate or omit both'),
} satisfies Record<keyof ProjectScopedArgs<MilestoneCreateArgs>, z.ZodType>;

export function registerProjectMilestoneCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_milestone_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Create an open milestone in a project. Provide startDate and endDate together or omit both.',
      inputSchema,
      title: 'Create project milestone',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMilestoneCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
