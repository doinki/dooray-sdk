import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskFileUploadArgs } from '@dooray-sdk/core';
import { runTaskFileUpload } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  contentType: z
    .string()
    .optional()
    .describe('MIME type for the attachment (default: inferred from the extension, else application/octet-stream).'),
  filePath: z
    .string()
    .describe("Absolute server path of the file to attach; the attachment keeps this file's base name."),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileUploadArgs>, z.ZodType>;

export function registerTaskFileUpload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_upload',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Attach a local file to a task; the returned file id can be passed as a fileIds value.',
      inputSchema,
      title: 'Upload task file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskFileUpload({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
