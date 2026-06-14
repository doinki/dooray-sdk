import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectCheckNameArgs } from '@dooray-sdk/core';
import { runProjectCheckName } from '@dooray-sdk/core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  name: z.string().describe('Project name to check; must be unique in the tenant.'),
} satisfies Record<keyof ProjectCheckNameArgs, z.ZodType>;

export function registerProjectCheckName(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_check_name',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        'Check a project name before project_create — reports whether it is available, invalid (disallowed characters), or already taken.',
      inputSchema,
      title: 'Check project name',
    },
    (args) => runTool(() => runProjectCheckName({ api, args }).then((r) => r.data)),
  );
}
