import type { DoorayApi } from '@dooray-sdk/client';
import type { MemberViewArgs } from '@dooray-sdk/core';
import { runMemberView } from '@dooray-sdk/core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  id: z
    .string()
    .describe(
      'A 19-digit member id (not a name/email); resolve via member_search (org-wide) or project_member_list (this project).',
    ),
} satisfies Record<keyof MemberViewArgs, z.ZodType>;

export function registerMemberView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'member_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "View one tenant member's full profile by id; resolve via member_search (look up by name) or member_me.",
      inputSchema,
      title: 'View member',
    },
    (args) => runTool(() => runMemberView({ api, args }).then((r) => r.data)),
  );
}
