import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiCommentViewArgs } from '@dooray-sdk/core';
import { runWikiCommentView } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  commentId: z.string().describe('Comment id; from wiki_comment_list.'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiCommentViewArgs>, z.ZodType>;

export function registerWikiCommentView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_comment_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a wiki comment's full body and metadata.",
      inputSchema,
      title: 'View wiki comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiCommentView({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
