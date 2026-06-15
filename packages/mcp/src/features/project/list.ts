import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectListArgs } from '@dooray-sdk/core';
import { runProjectList } from '@dooray-sdk/core';
import { PROJECT_SCOPES, PROJECT_STATES, PROJECT_TYPES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  member: z
    .string()
    .default('me')
    .describe('Limit to projects this member belongs to — a member id from member_search, or `me` (default: `me`).'),
  page: pageSchema,
  scope: z
    .enum(PROJECT_SCOPES)
    .optional()
    .describe('Filter by scope: private (members only) or public (default: public).'),
  size: sizeSchema,
  state: z.enum(PROJECT_STATES).optional().describe('Filter by state: active, archived, or deleted (default: active).'),
  type: z
    .enum(PROJECT_TYPES)
    .optional()
    .describe('Filter by type: private includes 1-on-1 personal projects, public excludes them (default: public).'),
} satisfies Record<keyof ProjectListArgs, z.ZodType>;

export function registerProjectList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        'List projects the caller can access. Use it to resolve a project name to its id. Filter by member, scope, state, and type.',
      inputSchema,
      title: 'List projects',
    },
    (args) => runTool(() => runProjectList({ api, args })),
  );
}
