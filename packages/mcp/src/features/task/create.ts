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
  assignees: z.array(z.string()).optional().describe('Assignee member ids or `@me` (default: @me).'),
  body: z.string().optional().describe('Task body (Markdown unless mimeType is text/html) (default: empty).'),
  cc: z.array(z.string()).optional().describe('CC member ids or `@me`.'),
  dueDate: z
    .string()
    .optional()
    .describe('Due date with timezone offset (e.g. `2026-06-20+09:00`); ignored unless dueDateFlag is true.'),
  dueDateFlag: z.boolean().optional().describe('Set true with dueDate to apply it.'),
  milestoneId: z.string().optional().describe('Milestone id; from project_milestone_list.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown).'),
  parentId: z.string().optional().describe('Parent task id to create this task under as a subtask; from task_list.'),
  priority: z
    .enum(TASK_PRIORITIES)
    .optional()
    .describe('Priority — highest, high, normal, low, lowest, or none (default: server default).'),
  ref: projectScopeShape.ref,
  tagIds: z.array(z.string()).optional().describe('Tag ids; from project_tag_list.'),
  title: z.string().trim().describe('Task title.'),
} satisfies Record<keyof ProjectScopedArgs<TaskCreateArgs>, z.ZodType>;

export function registerTaskCreate(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_create',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description: 'Create a task in a project. Omitting assignees assigns the caller (@me).',
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
