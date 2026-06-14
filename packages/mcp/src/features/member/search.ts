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
    .describe('Filter by external email address, exact match — array, any one matches (e.g. `["a@ex.com"]`).'),
  exactUserCode: z.string().optional().describe('Filter by user code, exact match. Use userCode for substring match.'),
  name: z.string().optional().describe('Filter by display name (not a 19-digit id).'),
  page: pageSchema,
  size: sizeSchema,
  ssoId: z.string().optional().describe('Filter by SSO/IdP user id, e.g. employee number (not a 19-digit id).'),
  userCode: z.string().optional().describe('Filter by user code, substring match. Use exactUserCode for exact match.'),
} satisfies Record<keyof MemberSearchArgs, z.ZodType>;

export function registerMemberSearch(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'member_search',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "Search tenant members by name, email, user code, or SSO id to resolve a name to its member id. Provide at least one filter; multiple filters combine with AND. Use member_view to fetch one member's full detail by id, or member_me for the caller.",
      inputSchema,
      title: 'Search members',
    },
    (args) => runTool(() => runMemberSearch({ api, args })),
  );
}
