import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiFileDownloadArgs } from '@dooray-sdk/core';
import { runWikiFileDownload } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  fileId: z.string().describe('Page file id; from wiki_view.'),
  outputPath: z.string().describe('Absolute local path (including filename) to write; overwrites any existing file.'),
  ref: wikiScopeShape.ref,
} satisfies Record<keyof WikiScopedArgs<WikiFileDownloadArgs>, z.ZodType>;

export function registerWikiFileDownload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_file_download',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Download a wiki page attachment to a local file at outputPath.',
      inputSchema,
      title: 'Download wiki page file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiFileDownload({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
