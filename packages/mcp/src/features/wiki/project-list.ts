import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiProjectListArgs } from '@dooray-sdk/core';
import { runWikiProjectList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  all: z.boolean().optional().describe('Fetch all pages in one call; overrides page/size (default: false).'),
  page: pageSchema,
  size: sizeSchema,
} satisfies Record<keyof WikiProjectListArgs, z.ZodType>;

export function registerWikiProjectList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_project_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: 'List the wikis the caller can access; each is tied to a project.',
      inputSchema,
      title: 'List wikis',
    },
    (args) => runTool(() => runWikiProjectList({ api, args })),
  );
}
