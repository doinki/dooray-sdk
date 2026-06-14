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
  id: z.string().describe('19-digit status id to update (not a name); resolve via project_status_list first'),
  localeNames: localeNamesSchema,
  name: z
    .string()
    .optional()
    .describe(
      'Default status name shown when no locale-specific name matches the viewer; omitting it may reset the existing name (PUT semantics)',
    ),
  order: z.number().int().optional().describe('Sort order within the same class (integer; lower values appear first)'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<StatusUpdateArgs>, z.ZodType>;

export function registerProjectStatusUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_status_update',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Update one task status in a project. PUT semantics — send every field you want to keep, since omitted fields may be reset by the server.',
      inputSchema,
      title: 'Update project status',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectStatusUpdate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
