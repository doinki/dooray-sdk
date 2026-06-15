import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiProjectFileDownloadArgs } from '@dooray-sdk/core';
import { runWikiProjectFileDownload } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  attachFileId: z.string().describe('Attach file id; from wiki_view.'),
  outputPath: z.string().describe('Absolute local path (including filename) to write; overwrites any existing file.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<WikiProjectFileDownloadArgs>, z.ZodType>;

export function registerWikiProjectFileDownload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_project_file_download',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Download a wiki-level attach file to a local file at outputPath.',
      inputSchema,
      title: 'Download wiki file',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runWikiProjectFileDownload({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
