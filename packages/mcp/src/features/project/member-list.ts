import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberListArgs } from '@dooray-sdk/core';
import { runProjectMemberList } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
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
  roles: z
    .array(z.enum(ASSIGNABLE_ROLES))
    .optional()
    .describe(
      `Filter by role — ${ASSIGNABLE_ROLES.join(' or ')}; pass an array for multiple. Omit to include all roles (default).`,
    ),
  size: sizeSchema,
} satisfies Record<keyof ProjectScopedArgs<ProjectMemberListArgs>, z.ZodType>;

export function registerProjectMemberList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_member_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List a project's members, each with organizationMemberId and role. Use to resolve a member id for project-scoped filters or to check who can be assigned. For group memberships use project_member_group_list.",
      inputSchema,
      title: 'List project members',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMemberList({ api, args: { ...args, projectId } });
      }),
  );
}
