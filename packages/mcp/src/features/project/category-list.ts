import type { DoorayApi } from '@dooray-sdk/client';
import { runProjectCategoryList } from '@dooray-sdk/core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { runTool } from '../../shared/result';

export function registerProjectCategoryList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'project_category_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "List the tenant's project categories as a flattened tree, each entry carrying its depth.",
      title: 'List project categories',
    },
    () => runTool(() => runProjectCategoryList({ api }).then((r) => r.data)),
  );
}
