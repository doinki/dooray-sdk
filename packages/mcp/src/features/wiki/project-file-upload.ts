import type { DoorayApi } from '@dooray-sdk/client';
import type { WikiProjectFileUploadArgs } from '@dooray-sdk/core';
import { runWikiProjectFileUpload } from '@dooray-sdk/core';
import { WIKI_FILE_TYPES } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  contentType: z.string().optional().describe('MIME type; omit to infer from the file extension.'),
  filePath: z.string().describe('Absolute path of the local file to upload.'),
  ref: projectScopeShape.ref,
  type: z.enum(WIKI_FILE_TYPES).optional().describe('File type: general or inline_image (default: general).'),
} satisfies Record<keyof ProjectScopedArgs<WikiProjectFileUploadArgs>, z.ZodType>;

export function registerWikiProjectFileUpload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'wiki_project_file_upload',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        "Upload a local file to a wiki itself, not a specific page; the returned id can be passed in wiki_create's fileIds. Use wiki_file_upload to attach to an existing page.",
      inputSchema,
      title: 'Upload wiki file',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runWikiProjectFileUpload({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
