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
        "Aggregate one project's configuration: project info, task statuses (ordered, with class — backlog, registered, working, closed), open and closed milestones, tags (with group), total member count, and category path. Read a project's statuses, milestones, and tags here before filtering task_list or setting task fields, instead of calling project_status_list, project_milestone_list, and project_tag_list separately. Returns the member count only — use project_member_list for the members themselves.",
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
