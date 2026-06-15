import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiListArgs } from '@dooray-sdk/core';
import { runWikiList } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  parentId: z.string().optional().describe('Parent page id; from wiki_list. Omit for the top level.'),
  ref: projectScopeShape.ref,
} satisfies Record<keyof ProjectScopedArgs<WikiListArgs>, z.ZodType>;

export function registerWikiList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List a wiki's pages one level deep; pass parentId for a page's children, or omit it for the top level.",
      inputSchema,
      title: 'List wiki pages',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runWikiList({ api, args: { ...args, projectId } });
      }),
  );
}
