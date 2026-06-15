import type { DoorayApi } from '@dooray-sdk/client';
import type { MemberSearchArgs } from '@dooray-sdk/core';
import { runMemberSearch } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  email: z
    .array(z.email())
    .optional()
    .describe('Filter by email, exact match; any one in the array matches (e.g. `["a@ex.com"]`).'),
  exactUserCode: z.string().optional().describe('Filter by user code, exact match.'),
  name: z.string().optional().describe('Filter by display name.'),
  page: pageSchema,
  size: sizeSchema,
  ssoId: z.string().optional().describe('Filter by SSO/IdP user id (e.g. employee number).'),
  userCode: z.string().optional().describe('Filter by user code, substring match.'),
} satisfies Record<keyof MemberSearchArgs, z.ZodType>;

export function registerMemberSearch(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'member_search',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        'Search tenant members by name, email, user code, or SSO id. Requires at least one filter; multiple filters combine with AND.',
      inputSchema,
      title: 'Search members',
    },
    (args) => runTool(() => runMemberSearch({ api, args })),
  );
}
