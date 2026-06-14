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
  body: z
    .string()
    .describe(
      'New comment text; replaces the entire body, so include anything you want to keep. Rendered as Markdown unless mimeType is text/html.',
    ),
  commentId: z
    .string()
    .describe('19-digit comment id to update (not the comment body); resolve via task_comment_list first.'),
  fileIds: z
    .array(z.string())
    .optional()
    .describe(
      '19-digit ids of already-uploaded files (not a file path); resolve via task_file_list first. Replaces the whole attachment set; omit to leave attachments unchanged.',
    ),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('How body renders — text/x-markdown or text/html (default: text/x-markdown).'),
  ref: taskScopeShape.ref,
} satisfies Record<keyof TaskScopedArgs<TaskCommentUpdateArgs>, z.ZodType>;

export function registerTaskCommentUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_comment_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        'Update an existing task comment. body replaces the entire comment (no partial edit) and fileIds replaces the whole attachment set — omit fileIds to keep attachments unchanged.',
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
