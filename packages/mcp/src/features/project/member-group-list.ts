import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectMemberGroupListArgs } from '@dooray-sdk/core';
import { runProjectMemberGroupList } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  page: pageSchema,
  ref: projectScopeShape.ref,
  size: sizeSchema,
} satisfies Record<keyof ProjectScopedArgs<ProjectMemberGroupListArgs>, z.ZodType>;

export function registerProjectMemberGroupList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_member_group_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List a project's member groups (codes and ids only); use project_member_group_view for a group's members.",
      inputSchema,
      title: 'List project member groups',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectMemberGroupList({ api, args: { ...args, projectId } });
      }),
  );
}
