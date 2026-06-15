import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiCommentDeleteArgs } from '@dooray-sdk/core';
import { runWikiCommentDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  commentId: z.string().describe('Comment id; from wiki_comment_list.'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiCommentDeleteArgs>, z.ZodType>;

export function registerWikiCommentDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_comment_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Delete a wiki comment. Irreversible.',
      inputSchema,
      title: 'Delete wiki comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiCommentDelete({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
