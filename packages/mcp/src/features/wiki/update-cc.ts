import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiUpdateCcArgs } from '@dooray-sdk/core';
import { runWikiUpdateCc } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  cc: z.array(z.string()).describe('Referrer member ids, or `@me`. Replaces the whole list.'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiUpdateCcArgs>, z.ZodType>;

export function registerWikiUpdateCc(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_update_cc',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Replace a wiki page's referrers, leaving its title and body unchanged.",
      inputSchema,
      title: 'Update wiki page referrers',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiUpdateCc({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
