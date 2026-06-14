import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberGroupViewArgs } from '@dooray-sdk/core';
import { runProjectMemberGroupView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('19-digit member group id (not a name); resolve via project_member_group_list first.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<ProjectMemberGroupViewArgs>, z.ZodType>;

export function registerProjectMemberGroupView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_member_group_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        'View one project member group with its members — project_member_group_list returns codes only, so use this to get the member ids and names in a group.',
      inputSchema,
      title: 'View project member group',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMemberGroupView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
