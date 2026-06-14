import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskFileListArgs } from '@dooray-sdk/core';
import { runTaskFileList } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskFileListArgs>, z.ZodType>;

export function registerTaskFileList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_file_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List a task's attached files. Use task_file_view for one file's full metadata, task_file_download to fetch its bytes.",
      inputSchema,
      title: 'List task files',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskFileList({ api, args: { id, projectId } }).then((r) => r.data);
      }),
  );
}
