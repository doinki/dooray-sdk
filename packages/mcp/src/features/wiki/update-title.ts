import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiUpdateTitleArgs } from '@dooray-sdk/core';
import { runWikiUpdateTitle } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: wikiScopeShape.ref,
  title: z.string().describe('Page title.'),
} satisfies Record<keyof WikiScopedArgs<WikiUpdateTitleArgs>, z.ZodType>;

export function registerWikiUpdateTitle(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_update_title',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Replace a wiki page's title, leaving its body and referrers unchanged.",
      inputSchema,
      title: 'Update wiki page title',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiUpdateTitle({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
