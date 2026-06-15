import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberAddArgs } from '@dooray-sdk/core';
import { runProjectMemberAdd } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe("Member id from member_search; must already be in the project's organization."),
  ref: projectScopeShape.ref,
  role: z.enum(ASSIGNABLE_ROLES).describe('Role to grant: admin (manages the project) or member (participates only).'),
} satisfies Record<keyof ProjectScopedArgs<ProjectMemberAddArgs>, z.ZodType>;

export function registerProjectMemberAdd(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_member_add',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Add an organization member to a project with a role. The returned id is null, so confirm with project_member_list.',
      inputSchema,
      title: 'Add project member',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMemberAdd({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
