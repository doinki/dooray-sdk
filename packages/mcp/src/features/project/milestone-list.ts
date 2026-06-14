import type { DoorayApi } from '@dooray-sdk/client';
import type { MilestoneListArgs } from '@dooray-sdk/core';
import { runProjectMilestoneList } from '@dooray-sdk/core';
import { MILESTONE_STATES } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  page: pageSchema,
  ref: projectScopeShape.ref,
  size: sizeSchema,
  state: z
    .enum(MILESTONE_STATES)
    .optional()
    .describe('Filter by state — `open` (active) or `closed` (finished). Omit to include both (default).'),
} satisfies Record<keyof ProjectScopedArgs<MilestoneListArgs>, z.ZodType>;

export function registerProjectMilestoneList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_milestone_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List and page a project's milestones, optionally filtered by state. Use to browse milestones or resolve a milestone name to its id; fetch one milestone's full detail with project_milestone_view.",
      inputSchema,
      title: 'List project milestones',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMilestoneList({ api, args: { ...args, projectId } });
      }),
  );
}
