import type { DoorayApi } from '@dooray-sdk/client';
import type { TagCreateArgs } from '@dooray-sdk/core';
import { runProjectTagCreate } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  color: z.string().describe('6-digit hex color without `#` (e.g. `ffffff`).'),
  name: z
    .string()
    .describe(
      'Tag name. Use `<group>:<tag>` (e.g. `Priority:High`) to nest it in a tag group, creating the group if absent.',
    ),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<TagCreateArgs>, z.ZodType>;

export function registerProjectTagCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_tag_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        'Create a tag for labeling tasks in a project. Set name to `<group>:<tag>` to nest the tag in a tag group, creating the group if absent.',
      inputSchema,
      title: 'Create project tag',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTagCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
