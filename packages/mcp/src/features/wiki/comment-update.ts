import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiCommentUpdateArgs } from '@dooray-sdk/core';
import { runWikiCommentUpdate } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('Comment body (Markdown).'),
  commentId: z.string().describe('Comment id; from wiki_comment_list.'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiCommentUpdateArgs>, z.ZodType>;

export function registerWikiCommentUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_comment_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Replace a wiki comment's body.",
      inputSchema,
      title: 'Update wiki comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiCommentUpdate({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
