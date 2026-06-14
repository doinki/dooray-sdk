import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskFileDeleteArgs } from '@dooray-sdk/core';
import { runTaskFileDelete } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  fileId: z.string().describe('19-digit attachment id to delete (not a file path); resolve via task_file_list first.'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileDeleteArgs>, z.ZodType>;

export function registerTaskFileDelete(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_delete',
    {
      annotations: { destructiveHint: true, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Permanently remove one attachment from a task.',
      inputSchema,
      title: 'Delete task file',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskFileDelete({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
