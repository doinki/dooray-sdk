import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskFileDownloadArgs } from '@dooray-sdk/core';
import { runTaskFileDownload } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  fileId: z.string().describe('19-digit attachment id (not a name); resolve via task_file_list first.'),
  outputPath: z
    .string()
    .describe(
      "Absolute local path including the filename, on the machine running the server — e.g. /tmp/report.pdf. Overwrites any existing file there. The attachment's original name is NOT applied automatically; copy it from task_file_list into this path to keep it.",
    ),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileDownloadArgs>, z.ZodType>;

export function registerTaskFileDownload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_download',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        "Write a task attachment's bytes to a local file on the machine running the server — use this over task_file_view, which returns metadata only. outputPath includes the filename and overwrites any existing file there.",
      inputSchema,
      title: 'Download task file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskFileDownload({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
