import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectCreateArgs } from '@dooray-sdk/core';
import { runProjectCreate } from '@dooray-sdk/core';
import { PROJECT_SCOPES } from '@dooray-sdk/core/constants';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  categoryId: z
    .string()
    .optional()
    .describe(
      '19-digit project category id (not a name); resolve via project_category_list first. Omit to leave uncategorized.',
    ),
  description: z.string().optional().describe('Project description.'),
  name: z
    .string()
    .describe(
      'Display name shown in the UI; must be unique in the org — verify via project_check_name first. (The API field name is `code`.)',
    ),
  scope: z
    .enum(PROJECT_SCOPES)
    .describe('Who can access — private: project members only; public: any non-guest org member.'),
} satisfies Record<keyof ProjectCreateArgs, z.ZodType>;

export function registerProjectCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        "Create a project in the caller's organization. A taken name fails the call — verify via project_check_name first.",
      inputSchema,
      title: 'Create project',
    },
    (args) => runTool(() => runProjectCreate({ api, args }).then((r) => r.data)),
  );
}
