import type { DoorayApi } from '@dooray-sdk/client';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerMemberMe } from './me';
import { registerMemberSearch } from './search';
import { registerMemberView } from './view';

export function registerMemberTools(server: McpServer, api: DoorayApi): void {
  registerMemberMe(server, api);
  registerMemberSearch(server, api);
  registerMemberView(server, api);
}
