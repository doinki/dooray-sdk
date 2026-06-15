import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskFileViewArgs } from '@dooray-sdk/core';
import { runTaskFileView } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  fileId: z.string().describe('Attachment file id; from task_file_list.'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileViewArgs>, z.ZodType>;

export function registerTaskFileView(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_view',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "View a task attachment's metadata. Returns metadata only; use task_file_download for the bytes.",
      inputSchema,
      title: 'View task file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskFileView({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
