import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiUpdateArgs } from '@dooray-sdk/core';
import { runWikiUpdate } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('Page body (Markdown).'),
  cc: z.array(z.string()).describe('Referrer member ids, or `@me`. Replaces the whole list.'),
  ref: wikiScopeShape.ref,
  title: z.string().describe('Page title.'),
} satisfies Record<keyof WikiScopedArgs<WikiUpdateArgs>, z.ZodType>;

export function registerWikiUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        "Replace a wiki page's title, body, and referrers together; use wiki_update_title, wiki_update_body, or wiki_update_cc to change just one.",
      inputSchema,
      title: 'Update wiki page',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiUpdate({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
