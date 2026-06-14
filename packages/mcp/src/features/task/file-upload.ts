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
    .describe(
      'MIME type stored for the attachment — e.g. application/json. Omit to infer from the file extension (default: application/octet-stream when unknown).',
    ),
  filePath: z
    .string()
    .describe("Absolute path of the file to read and attach. The attachment keeps this file's base name."),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileUploadArgs>, z.ZodType>;

export function registerTaskFileUpload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_upload',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        'Attach a local file to a task — reads filePath from disk, infers its MIME type, and uploads it. The new file id can be passed as a fileIds value in task_comment_create.',
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
