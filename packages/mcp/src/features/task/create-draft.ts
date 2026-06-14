import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskDraftCreateArgs } from '@dooray-sdk/core';
import { runTaskCreateDraft } from '@dooray-sdk/core';
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
      'Assignee 19-digit member ids (not names/emails) or `@me`; resolve via member_search (org-wide) or project_member_list (this project). Omit to assign to the caller (default: @me).',
    ),
  body: z
    .string()
    .optional()
    .describe('Draft body text; rendered as Markdown unless mimeType is text/html (default: empty).'),
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
      'Due date with timezone offset, e.g. `2026-06-20+09:00`; ignored unless dueDateFlag:true is sent with it.',
    ),
  dueDateFlag: z
    .boolean()
    .optional()
    .describe('Set true together with dueDate to apply the due date; otherwise dueDate is ignored.'),
  milestoneId: z
    .string()
    .optional()
    .describe('19-digit milestone id (not a name); resolve via project_milestone_list first.'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown).'),
  priority: z
    .enum(TASK_PRIORITIES)
    .optional()
    .describe('Task priority — highest, high, normal, low, lowest, none (default: server default when omitted).'),
  ref: projectScopeShape.ref,
  tagIds: z.array(z.string()).optional().describe('19-digit tag ids (not names); resolve via project_tag_list first.'),
  title: z.string().trim().describe('Draft task title.'),
} satisfies Record<keyof ProjectScopedArgs<TaskDraftCreateArgs>, z.ZodType>;

export function registerTaskCreateDraft(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_create_draft',
    {
      annotations: { destructiveHint: false, idempotentHint: false, openWorldHint: false, readOnlyHint: false },
      description:
        'Create a draft task (임시 업무) in a project. A draft is not a real task until submitted in the Dooray UI — use task_create for a real task. Omitting assignees assigns the caller (@me); at least one assignee is required.',
      inputSchema,
      title: 'Create draft task',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runTaskCreateDraft({ api, args: { ...args, projectId } }).then((r) => r.data);
      }),
  );
}
