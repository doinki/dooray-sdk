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
    .describe(
      'New assignee list — 19-digit member ids (not names/emails) or `@me`; resolve via member_search (org-wide) or project_member_list (this project). REPLACES the whole list; omit to keep current. Group assignees flatten to individual members.',
    ),
  body: z
    .string()
    .optional()
    .describe('New body text; rendered as Markdown unless mimeType is text/html. Omit to keep current.'),
  cc: z
    .array(z.string())
    .optional()
    .describe(
      'New CC list — 19-digit member ids (not names/emails) or `@me`; resolve via member_search (org-wide) or project_member_list (this project). REPLACES the whole list; omit to keep current.',
    ),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Due date with timezone offset (e.g. `2026-06-20+09:00`), or null to clear. Applies only when paired with dueDateFlag:true. Omit to keep current.',
    ),
  dueDateFlag: z
    .boolean()
    .optional()
    .describe('Set true alongside dueDate to apply it; false leaves the date inactive. Omit to keep current.'),
  milestoneId: z
    .string()
    .optional()
    .describe('19-digit milestone id (not a name); resolve via project_milestone_list first. Omit to keep current.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown). Pass alongside body.'),
  priority: z
    .enum(TASK_PRIORITIES)
    .optional()
    .describe('Task priority — highest, high, normal, low, lowest, or none. Omit to keep current.'),
  ref: taskScopeShape.ref,
  tagIds: z
    .array(z.string())
    .optional()
    .describe(
      '19-digit tag ids (not names); resolve via project_tag_list first. REPLACES the whole list; omit to keep current.',
    ),
  title: z.string().optional().describe('New task title. Omit to keep current.'),
  version: z
    .number()
    .nullable()
    .optional()
    .describe(
      'Optimistic-lock version (default: null — applies to the latest revision, never 409). Pass the known version to fail on a concurrent edit instead.',
    ),
} satisfies Record<keyof TaskScopedArgs<TaskUpdateArgs>, z.ZodType>;

export function registerTaskUpdate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_update',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: false },
      description:
        "Edit a task's fields (title, body, assignees, due date, priority, milestone, tags). Only the fields you pass change; omit a field to keep its current value. assignees, cc, and tagIds REPLACE the whole value — omit to keep, never pass a partial list. To change status use task_set_status / task_close, to relocate use task_move, to re-parent use task_set_parent — none are settable here.",
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
