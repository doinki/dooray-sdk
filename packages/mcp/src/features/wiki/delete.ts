import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiDeleteArgs } from '@dooray-sdk/core';
import { runWikiDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiDeleteArgs>, z.ZodType>;

export function registerWikiDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Delete a wiki page along with its child pages and attachments. Irreversible.',
      inputSchema,
      title: 'Delete wiki page',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiDelete({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
