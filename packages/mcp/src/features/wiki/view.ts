import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiViewArgs } from '@dooray-sdk/core';
import { runWikiView } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiViewArgs>, z.ZodType>;

export function registerWikiView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a wiki page's full detail, including body, referrers, and attached file metadata.",
      inputSchema,
      title: 'View wiki page',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiView({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
