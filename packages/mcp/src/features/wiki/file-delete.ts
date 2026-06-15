import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiFileDeleteArgs } from '@dooray-sdk/core';
import { runWikiFileDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  fileId: z.string().describe('Page file id; from wiki_view.'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiFileDeleteArgs>, z.ZodType>;

export function registerWikiFileDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_file_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Remove an attached file from a wiki page. Irreversible.',
      inputSchema,
      title: 'Delete wiki page file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiFileDelete({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
