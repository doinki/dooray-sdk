import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiCommentListArgs } from '@dooray-sdk/core';
import { runWikiCommentList } from '@dooray-sdk/core';
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
} satisfies Record<keyof WikiScopedArgs<WikiCommentListArgs>, z.ZodType>;

export function registerWikiCommentList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_comment_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "List a wiki page's comments.",
      inputSchema,
      title: 'List wiki comments',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiCommentList({ api, args: { ...args, id, projectId } });
      }),
  );
}
