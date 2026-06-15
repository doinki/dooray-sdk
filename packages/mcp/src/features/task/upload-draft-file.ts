import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskUploadDraftFileArgs } from '@dooray-sdk/core';
import { runTaskUploadDraftFile } from '@dooray-sdk/core';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';

const inputSchema = {
  contentType: z
    .string()
    .optional()
    .describe('MIME type for the attachment (default: inferred from the extension, else application/octet-stream).'),
  draftId: z.string().describe('Draft id; from task_create_draft (not a task id).'),
  filePath: z.string().describe('Absolute server path of the file to upload.'),
} satisfies Record<keyof TaskUploadDraftFileArgs, z.ZodType>;

export function registerTaskUploadDraftFile(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_upload_draft_file',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Attach a local file to a draft task; use task_file_upload for a real task.',
      inputSchema,
      title: 'Upload draft file',
    },
    (args) => runTool(() => runTaskUploadDraftFile({ api, args }).then((r) => r.data)),
  );
}
