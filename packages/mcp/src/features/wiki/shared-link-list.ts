import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiSharedLinkListArgs } from '@dooray-sdk/core';
import { runWikiSharedLinkList } from '@dooray-sdk/core';
import { WIKI_SHARED_LINK_STATES } from '@dooray-sdk/core/constants';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  all: z.boolean().optional().describe('Fetch all pages in one call; overrides page/size (default: false).'),
  page: pageSchema,
  ref: wikiScopeShape.ref,
  size: sizeSchema,
  state: z.enum(WIKI_SHARED_LINK_STATES).optional().describe('Filter by state: valid or invalid (default: valid).'),
} satisfies Record<keyof WikiScopedArgs<WikiSharedLinkListArgs>, z.ZodType>;

export function registerWikiSharedLinkList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_shared_link_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "List a wiki page's external shared links.",
      inputSchema,
      title: 'List wiki shared links',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiSharedLinkList({ api, args: { ...args, id, projectId } });
      }),
  );
}
