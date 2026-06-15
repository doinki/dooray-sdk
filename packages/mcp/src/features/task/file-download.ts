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
  fileId: z.string().describe('Attachment id; from task_file_list.'),
  outputPath: z
    .string()
    .describe(
      "Absolute server path including the filename (e.g. /tmp/report.pdf); overwrites any existing file. The attachment's original name is not applied automatically.",
    ),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileDownloadArgs>, z.ZodType>;

export function registerTaskFileDownload(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_download',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: "Download a task attachment's bytes to a local file on the server.",
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
