import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiFileUploadArgs } from '@dooray-sdk/core';
import { runWikiFileUpload } from '@dooray-sdk/core';
import { WIKI_FILE_TYPES } from '@dooray-sdk/core/constants';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { WikiScopedArgs } from '../../shared/scope';
import { wikiScopeShape } from '../../shared/scope';

const inputSchema = {
  contentType: z.string().optional().describe('MIME type; omit to infer from the file extension.'),
  filePath: z.string().describe('Absolute path of the local file to upload.'),
  ref: wikiScopeShape.ref,
  type: z.enum(WIKI_FILE_TYPES).optional().describe('File type: general or inline_image (default: general).'),
} satisfies Record<keyof WikiScopedArgs<WikiFileUploadArgs>, z.ZodType>;

export function registerWikiFileUpload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_file_upload',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        'Attach a local file to a wiki page; use wiki_project_file_upload for a wiki-level file not tied to a page.',
      inputSchema,
      title: 'Upload wiki page file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveWikiId(args);

        return runWikiFileUpload({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
