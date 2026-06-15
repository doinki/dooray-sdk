import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCommentCreateArgs } from '@dooray-sdk/core';
import { runTaskCommentCreate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('Comment body (Markdown unless mimeType is text/html).'),
  fileIds: z.array(z.string()).optional().describe('Attachment file ids; from task_file_upload or task_file_list.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown).'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskCommentCreateArgs>, z.ZodType>;

export function registerTaskCommentCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_comment_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: "Post a comment to a task's timeline.",
      inputSchema,
      title: 'Create task comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskCommentCreate({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
