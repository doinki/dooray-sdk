import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiUpdateBodyArgs } from '@dooray-sdk/core';
import { runWikiUpdateBody } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('Page body (Markdown).'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiUpdateBodyArgs>, z.ZodType>;

export function registerWikiUpdateBody(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_update_body',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Replace a wiki page's body, leaving its title and referrers unchanged.",
      inputSchema,
      title: 'Update wiki page body',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiUpdateBody({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
