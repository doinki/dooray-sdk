import type { DoorayApi } from '@dooray-sdk/client';
import type { TagListArgs } from '@dooray-sdk/core';
import { runProjectTagList } from '@dooray-sdk/core';
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
} satisfies Record<keyof ProjectScopedArgs<TagListArgs>, z.ZodType>;

export function registerProjectTagList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_tag_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "List a project's tags applied to tasks; grouped tags include their group's constraints.",
      inputSchema,
      title: 'List project tags',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTagList({ api, args: { ...args, projectId } });
      }),
  );
}
