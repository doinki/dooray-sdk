import type { DoorayApi } from '@dooray-sdk/client';
import type { EmailCreateArgs } from '@dooray-sdk/core';
import { runProjectEmailCreate } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  email: z
    .email('Enter a valid email address.')
    .describe(
      'Address to register (e.g. `support@acme.dooray.com`). Domain must be the tenant mail domain; local part must be unused tenant-wide.',
    ),
  name: z.string().describe('Display name shown alongside the address.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<EmailCreateArgs>, z.ZodType>;

export function registerProjectEmailCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_email_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Register an inbound email address for a project so mail sent to it files a new task.',
      inputSchema,
      title: 'Create project inbound email',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runProjectEmailCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
