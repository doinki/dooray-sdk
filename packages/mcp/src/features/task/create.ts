import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskCreateArgs } from '@dooray-sdk/core';
import { runTaskCreate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  assignees: z
    .array(z.string())
    .optional()
    .describe(
      'Assignee 19-digit member ids (not names/emails) or `@me`; resolve via member_search (org-wide) or project_member_list (this project). Omit to assign the caller (default: @me).',
    ),
  body: z
    .string()
    .optional()
    .describe('Task body text; rendered as Markdown unless mimeType is text/html (default: empty).'),
  cc: z
    .array(z.string())
    .optional()
    .describe(
      'CC 19-digit member ids (not names/emails) or `@me`; resolve via member_search (org-wide) or project_member_list (this project).',
    ),
  dueDate: z
    .string()
    .optional()
    .describe(
      'Due date with timezone offset (e.g. `2026-06-20+09:00`); set dueDateFlag:true alongside it or the date is ignored.',
    ),
  dueDateFlag: z.boolean().optional().describe('Whether the due date is active; pass true with dueDate to apply it.'),
  milestoneId: z
    .string()
    .optional()
    .describe('19-digit milestone id (not a name); resolve via project_milestone_list first.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown).'),
  parentId: z
    .string()
    .optional()
    .describe(
      '19-digit parent task id (not a name) to create this task under as a subtask; resolve via task_list first.',
    ),
  priority: z
    .enum(TASK_PRIORITIES)
    .optional()
    .describe('Task priority — highest, high, normal, low, lowest, or none; omit for the server default.'),
  ref: projectScopeShape.ref,
  tagIds: z.array(z.string()).optional().describe('19-digit tag ids (not names); resolve via project_tag_list first.'),
  title: z.string().trim().describe('Task title.'),
} satisfies Record<keyof ProjectScopedArgs<TaskCreateArgs>, z.ZodType>;

export function registerTaskCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        'File a new task in a project. Use task_create_draft instead to save an unsent draft. Omitting assignees assigns the caller (@me); at least one assignee is required.',
      inputSchema,
      title: 'Create task',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runTaskCreate({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
