import type { DoorayApi } from '@dooray-sdk/client';
import type { TemplateViewArgs } from '@dooray-sdk/core';
import { runProjectTemplateView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  expand: z
    .boolean()
    .optional()
    .describe(
      'Interpolate macro placeholders (e.g. `$' +
        '{year}`) in the returned body when true; return them literally otherwise (default: false).',
    ),
  id: z.string().describe('Template id from project_template_list.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<TemplateViewArgs>, z.ZodType>;

export function registerProjectTemplateView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_template_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "View one task template's full detail, including the body and guide that project_template_list omits.",
      inputSchema,
      title: 'View project template',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTemplateView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
