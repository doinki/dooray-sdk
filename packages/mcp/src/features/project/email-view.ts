import type { DoorayApi } from '@dooray-sdk/client';
import type { EmailViewArgs } from '@dooray-sdk/core';
import { runProjectEmailView } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  id: z.string().describe('19-digit inbound email-address id (not a name); resolve via `project_email_create` first.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<EmailViewArgs>, z.ZodType>;

export function registerProjectEmailView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_email_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: 'View one inbound email address of a project.',
      inputSchema,
      title: 'View project inbound email',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectEmailView({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
