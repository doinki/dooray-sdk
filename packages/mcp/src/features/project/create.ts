import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectCreateArgs } from '@dooray-sdk/core';
import { runProjectCreate } from '@dooray-sdk/core';
import { PROJECT_SCOPES } from '@dooray-sdk/core/constants';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  categoryId: z.string().optional().describe('Category id from project_category_list. Omit to leave uncategorized.'),
  description: z.string().optional().describe('Project description.'),
  name: z.string().describe('Display name; must be unique in the org (check with project_check_name).'),
  scope: z.enum(PROJECT_SCOPES).describe('Access scope: private (members only) or public (any non-guest org member).'),
} satisfies Record<keyof ProjectCreateArgs, z.ZodType>;

export function registerProjectCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: "Create a project in the caller's organization.",
      inputSchema,
      title: 'Create project',
    },
    (args) => runTool(() => runProjectCreate({ api, args }).then((r) => r.data)),
  );
}
