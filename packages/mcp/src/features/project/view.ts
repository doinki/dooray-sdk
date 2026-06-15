import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectViewArgs } from '@dooray-sdk/core';
import { runProjectView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<ProjectViewArgs>, z.ZodType>;

export function registerProjectView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "View a project's config in one call: info, task statuses, milestones, tags, member count, and category path. Use it to resolve statuses, milestones, and tags before filtering task_list or setting task fields. Returns member count only; use project_member_list for the members.",
      inputSchema,
      title: 'View project',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectView({ api, args: { projectId } });
      }),
  );
}
