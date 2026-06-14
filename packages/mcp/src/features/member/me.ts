import type { DoorayApi } from '@dooray-sdk/client';
import { runMemberMe } from '@dooray-sdk/core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { runTool } from '../../shared/result';

export function registerMemberMe(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'member_me',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "View the authenticated caller's profile — the member `@me` resolves to in other tools; takes no arguments. To look up any other member, use member_search or member_view.",
      title: 'View current member',
    },
    () => runTool(() => runMemberMe({ api }).then((r) => r.data)),
  );
}
