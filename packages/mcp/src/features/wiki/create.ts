import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiCreateArgs } from '@dooray-sdk/core';
import { runWikiCreate } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('Page body (Markdown).'),
  cc: z.array(z.string()).optional().describe('Referrer member ids, or `@me`.'),
  fileIds: z.array(z.string()).optional().describe('File ids to attach; from wiki_project_file_upload.'),
  parentId: z.string().describe('Parent page id; from wiki_list.'),
  ref: projectScopeShape.ref,
  title: z.string().describe('Page title.'),
} satisfies Record<keyof ProjectScopedArgs<WikiCreateArgs>, z.ZodType>;

export function registerWikiCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Create a wiki page under parentId.',
      inputSchema,
      title: 'Create wiki page',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runWikiCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
