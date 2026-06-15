import type { DoorayApi } from '@dooray-sdk/client';
import type { TemplateListArgs } from '@dooray-sdk/core';
import { runProjectTemplateList } from '@dooray-sdk/core';
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
} satisfies Record<keyof ProjectScopedArgs<TemplateListArgs>, z.ZodType>;

export function registerProjectTemplateList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_template_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List a project's task templates (metadata only); use project_template_view for a template's body and guide.",
      inputSchema,
      title: 'List project templates',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectTemplateList({ api, args: { ...args, projectId } });
      }),
  );
}
