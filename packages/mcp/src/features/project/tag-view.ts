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
  id: z.string().describe('Tag id; from project_tag_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<TagViewArgs>, z.ZodType>;

export function registerProjectTagView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_tag_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a tag's detail, including its color and any group constraints.",
      inputSchema,
      title: 'View tag',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTagView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
