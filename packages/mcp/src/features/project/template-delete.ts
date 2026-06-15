import type { DoorayApi } from '@dooray-sdk/client';
import type { TemplateDeleteArgs } from '@dooray-sdk/core';
import { runProjectTemplateDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('Task-template id from project_template_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<TemplateDeleteArgs>, z.ZodType>;

export function registerProjectTemplateDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_template_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Delete a task template from a project. Irreversible.',
      inputSchema,
      title: 'Delete project template',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTemplateDelete({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
