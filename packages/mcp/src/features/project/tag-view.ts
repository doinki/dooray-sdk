import type { DoorayApi } from '@dooray-sdk/client';
import type { TagViewArgs } from '@dooray-sdk/core';
import { runProjectTagView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z
    .string()
    .describe(
      '19-digit tag id (not a name); resolve via project_tag_list, or use the id returned by project_tag_create',
    ),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<TagViewArgs>, z.ZodType>;

export function registerProjectTagView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_tag_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View one tag's full detail by id — its color and, if grouped, its tag-group constraints.",
      inputSchema,
      title: 'View project tag',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTagView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
