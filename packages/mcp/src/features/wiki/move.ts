import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiMoveArgs } from '@dooray-sdk/core';
import { runWikiMove } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  beforeId: z.string().optional().describe('Sibling page id to order this page after; from wiki_list.'),
  includeSubPages: z.boolean().optional().describe('Move child pages along too (default: true).'),
  parentId: z.string().describe('Destination parent page id; from wiki_list.'),
  ref: wikiScopeShape.ref,
  targetProjectId: z
    .string()
    .optional()
    .describe('Destination project id when moving to another wiki; from wiki_project_list.'),
} satisfies Record<keyof WikiScopedArgs<WikiMoveArgs>, z.ZodType>;

export function registerWikiMove(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_move',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Reparent a wiki page under parentId, optionally ordering it after beforeId or moving it into another wiki via targetProjectId. Irreversible.',
      inputSchema,
      title: 'Move wiki page',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiMove({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
