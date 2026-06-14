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
    .describe(
      'Limit to projects this member belongs to — a 19-digit member id (not a name/email); resolve via member_search. Use `me` for the caller (default: `me`).',
    ),
  page: pageSchema,
  scope: z
    .enum(PROJECT_SCOPES)
    .optional()
    .describe(
      'Visibility scope filter — private: members-only; public: open to non-guest org members (default: public).',
    ),
  size: sizeSchema,
  state: z
    .enum(PROJECT_STATES)
    .optional()
    .describe('Project state filter — active, archived, or deleted (default: active).'),
  type: z
    .enum(PROJECT_TYPES)
    .optional()
    .describe(
      'Project type filter — private includes 1-on-1 personal projects (sorted first); public excludes them (default: public).',
    ),
} satisfies Record<keyof ProjectListArgs, z.ZodType>;

export function registerProjectList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        'List projects the caller can access, paged. Use it to resolve a project name to its id before calling project-scoped tools, or to browse projects. Filter by member, scope, state, and type.',
      inputSchema,
      title: 'List projects',
    },
    (args) => runTool(() => runProjectList({ api, args })),
  );
}
