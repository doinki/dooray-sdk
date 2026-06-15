import type { DoorayApi } from '@dooray-sdk/client';
import type { StatusUpdateArgs } from '@dooray-sdk/core';
import { runProjectStatusUpdate } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { localeNamesSchema, statusClassSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  class: statusClassSchema.optional(),
  id: z.string().describe('Status id to update; from project_status_list.'),
  localeNames: localeNamesSchema,
  name: z
    .string()
    .optional()
    .describe('Default status name, used when no localeNames entry matches the viewer; omitting may reset it.'),
  order: z.number().int().optional().describe('Sort order within the class; lower appears first.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<StatusUpdateArgs>, z.ZodType>;

export function registerProjectStatusUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_status_update',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Update a task status in a project; omitted fields may be reset, so send every field to keep.',
      inputSchema,
      title: 'Update status',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectStatusUpdate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
