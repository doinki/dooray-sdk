import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskUpdateArgs } from '@dooray-sdk/core';
import { runTaskUpdate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { TaskScopedArgs } from '../../shared/scope';
import { taskScopeShape } from '../../shared/scope';

const inputSchema = {
  assignees: z
    .array(z.string())
    .optional()
    .describe('Assignee member ids or `@me`. Replaces the whole list; omit to keep current.'),
  body: z.string().optional().describe('New body (Markdown unless mimeType is text/html). Omit to keep current.'),
  cc: z.array(z.string()).optional().describe('CC member ids or `@me`. Replaces the whole list; omit to keep current.'),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Due date with timezone offset (e.g. `2026-06-20+09:00`), or null to clear; applies only with dueDateFlag true. Omit to keep current.',
    ),
  dueDateFlag: z.boolean().optional().describe('Set true with dueDate to apply it. Omit to keep current.'),
  milestoneId: z.string().optional().describe('Milestone id; from project_milestone_list. Omit to keep current.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown). Pass alongside body.'),
  priority: z
    .enum(TASK_PRIORITIES)
    .optional()
    .describe('Priority — highest, high, normal, low, lowest, or none. Omit to keep current.'),
  ref: taskScopeShape.ref,
  tagIds: z
    .array(z.string())
    .optional()
    .describe('Tag ids; from project_tag_list. Replaces the whole list; omit to keep current.'),
  title: z.string().optional().describe('New title. Omit to keep current.'),
  version: z
    .number()
    .optional()
    .describe(
      'Optimistic-lock version. Omit to apply to the latest revision. Pass a known version to fail on a concurrent edit.',
    ),
} satisfies Record<keyof TaskScopedArgs<TaskUpdateArgs>, z.ZodType>;

export function registerTaskUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        "Edit a task's title, body, assignees, due date, priority, milestone, or tags. Omit a field to keep it; assignees, cc, and tagIds replace the whole list. When setting tagIds, keep any required tags (see project_tag_list) or the update fails. Status, project, and parent are not settable here.",
      inputSchema,
      title: 'Update task',
    },
    (args) =>
      runTool(() => {
        const { id, projectId } = resolveTaskId(args);

        return runTaskUpdate({ api, args: { ...args, id, projectId } }).then((r) => r.data);
      }),
  );
}
