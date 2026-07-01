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
  body: z.string().optional().describe('New page body (Markdown). Omit to keep current.'),
  cc: z
    .array(z.string())
    .optional()
    .describe('Referrer member ids, or `@me`. Replaces the whole list; omit to keep current.'),
  ref: wikiScopeShape.ref,
  title: z.string().optional().describe('New page title. Omit to keep current.'),
} satisfies Record<keyof WikiScopedArgs<WikiUpdateArgs>, z.ZodType>;

export function registerWikiUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Edit a wiki page's title, body, or referrers; omitted fields keep their current values.",
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
