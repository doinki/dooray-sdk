import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCommentUpdateArgs } from '@dooray-sdk/core';
import { runTaskCommentUpdate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  body: z.string().describe('New comment body (Markdown unless mimeType is text/html). Replaces the whole body.'),
  commentId: z.string().describe('Comment id to update; from task_comment_list.'),
  fileIds: z
    .array(z.string())
    .optional()
    .describe('Attachment file ids; from task_file_list. Replaces the whole list; omit to keep current.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown).'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskCommentUpdateArgs>, z.ZodType>;

export function registerTaskCommentUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_comment_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description: 'Edit a task comment; body and fileIds each replace the whole value.',
      inputSchema,
      title: 'Update task comment',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskCommentUpdate({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
