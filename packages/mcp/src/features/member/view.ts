import type { DoorayApi } from '@dooray-sdk/client';
import type { MemberViewArgs } from '@dooray-sdk/core';
import { runMemberView } from '@dooray-sdk/core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  id: z.string().describe('Member id; from member_search or project_member_list.'),
} satisfies Record<keyof MemberViewArgs, z.ZodType>;

export function registerMemberView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'member_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a tenant member's full profile by id.",
      inputSchema,
      title: 'View member',
    },
    (args) => runTool(() => runMemberView({ api, args }).then((r) => r.data)),
  );
}
