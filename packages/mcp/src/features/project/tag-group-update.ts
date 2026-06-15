import type { DoorayApi } from '@dooray-sdk/client';
import type { TagGroupUpdateArgs } from '@dooray-sdk/core';
import { runProjectTagGroupUpdate } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('Tag group id; the `tagGroup.id` from project_tag_list.'),
  ref: projectScopeShape.ref,
  required: z
    .boolean()
    .optional()
    .describe('true: a task must have at least one tag from this group; false: optional.'),
  singleSelect: z
    .boolean()
    .optional()
    .describe('true: a task may have at most one tag from this group; false: multiple allowed.'),
} satisfies Record<keyof ProjectScopedArgs<TagGroupUpdateArgs>, z.ZodType>;

export function registerProjectTagGroupUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_tag_group_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Update a tag group's required and singleSelect rules; omit a field to leave it unchanged.",
      inputSchema,
      title: 'Update tag group',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTagGroupUpdate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
