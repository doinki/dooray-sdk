import type { DoorayApi } from '@dooray-sdk/client';
import type { StatusCreateArgs } from '@dooray-sdk/core';
import { runProjectStatusCreate } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { localeNamesSchema, statusClassSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  class: statusClassSchema,
  localeNames: localeNamesSchema,
  name: z.string().describe("Default status name, used when no localeNames entry matches the viewer's locale."),
  order: z
    .number()
    .int()
    .optional()
    .describe('Sort order within the class; lower appears first (default: appended last).'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<StatusCreateArgs>, z.ZodType>;

export function registerProjectStatusCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_status_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Create a task status in a project.',
      inputSchema,
      title: 'Create status',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectStatusCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
