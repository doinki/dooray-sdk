import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberViewArgs } from '@dooray-sdk/core';
import { runProjectMemberView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('Member id — the organizationMemberId from project_member_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<ProjectMemberViewArgs>, z.ZodType>;

export function registerProjectMemberView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_member_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "View one member's role and detail in a project. Role is admin, member, postuser (CC-only), or leaver (removed).",
      inputSchema,
      title: 'View project member',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMemberView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
