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
    .describe(
      'MIME type to store for the attachment (e.g. application/json). Omit to infer from the file extension (default: application/octet-stream).',
    ),
  draftId: z.string().describe('19-digit draft id from task_create_draft (not a task id).'),
  filePath: z.string().describe('Absolute local path of the file to upload.'),
} satisfies Record<keyof TaskUploadDraftFileArgs, z.ZodType>;

export function registerTaskUploadDraftFile(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_upload_draft_file',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        'Attach a local file to a draft, uploading it under draftId — the id from task_create_draft, not a task id; task attachments use task_file_upload instead.',
      inputSchema,
      title: 'Upload draft file',
    },
    (args) => runTool(() => runTaskUploadDraftFile({ api, args }).then((r) => r.data)),
  );
}
