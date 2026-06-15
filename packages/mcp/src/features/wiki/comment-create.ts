import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiCommentCreateArgs } from '@dooray-sdk/core';
import { runWikiCommentCreate } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('Comment body (Markdown).'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiCommentCreateArgs>, z.ZodType>;

export function registerWikiCommentCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_comment_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Add a comment to a wiki page.',
      inputSchema,
      title: 'Create wiki comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiCommentCreate({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
