import type { DoorayApi } from '@dooray-sdk/client';
import type { TaskListArgs } from '@dooray-sdk/core';
import { runTaskList } from '@dooray-sdk/core';
import { SORT_OPTIONS, STATUS_CLASSES } from '@dooray-sdk/core/constants';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { datePatternSchema, pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { runTool } from '../../shared/result';
import type { ProjectScopedArgs } from '../../shared/scope';
import { projectScopeShape } from '../../shared/scope';

const inputSchema = {
  assignee: z
    .array(z.string())
    .optional()
    .describe(
      'Filter by assignee — `@me`, 19-digit member ids (not names/emails; resolve via member_search (org-wide) or project_member_list (this project)), or `none` for unassigned (overrides any ids passed with it).',
    ),
  author: z
    .array(z.string())
    .optional()
    .describe(
      'Filter by author — `@me` or 19-digit member ids (not names/emails; resolve via member_search (org-wide) or project_member_list (this project)).',
    ),
  authorEmail: z
    .string()
    .optional()
    .describe('Filter by sender email for tasks created via email (the address, not a member id).'),
  cc: z
    .array(z.string())
    .optional()
    .describe(
      'Filter by CC — `@me` or 19-digit member ids (not names/emails; resolve via member_search (org-wide) or project_member_list (this project)).',
    ),
  created: datePatternSchema
    .optional()
    .describe(
      'Filter by creation date — `today`, `thisweek`, `prev-Nd`, `next-Nd`, or an ISO range with timezone offset `<start>~<end>` (e.g. `2026-06-01T00:00:00+09:00~2026-06-14T00:00:00+09:00`).',
    ),
  due: datePatternSchema
    .optional()
    .describe(
      'Filter by due date — `today`, `thisweek`, `prev-Nd`, `next-Nd`, or an ISO range with timezone offset `<start>~<end>` (e.g. `2026-06-01T00:00:00+09:00~2026-06-14T00:00:00+09:00`).',
    ),
  milestone: z
    .array(z.string())
    .optional()
    .describe('Filter by 19-digit milestone id (not a name); resolve via project_milestone_list first.'),
  number: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filter by task number — the numeric part of the task key (e.g. 123 for ABC-123).'),
  page: pageSchema,
  parent: z
    .string()
    .optional()
    .describe("Filter by 19-digit parent task id (not a key); returns that task's subtasks."),
  ref: projectScopeShape.ref,
  search: z
    .array(z.string())
    .optional()
    .describe('Filter by exact task title (subject); does not match partial titles or body text.'),
  size: sizeSchema,
  sort: z
    .enum(SORT_OPTIONS)
    .optional()
    .describe('Sort by date — `due`, `updated`, or `created`; prefix with `-` for descending (e.g. `-updated`).'),
  status: z
    .array(z.string())
    .optional()
    .describe(
      'Filter by 19-digit status id (not a name); resolve via project_status_list first. Use statusClass for coarse states.',
    ),
  statusClass: z
    .array(z.enum(STATUS_CLASSES))
    .optional()
    .describe('Filter by coarse status class — `backlog`, `registered`, `working`, or `closed` (no id lookup needed).'),
  tagIds: z
    .array(z.string())
    .optional()
    .describe('Filter by 19-digit tag id (not a name); resolve via project_tag_list first.'),
  updated: datePatternSchema
    .optional()
    .describe(
      'Filter by last-updated date — `today`, `thisweek`, `prev-Nd`, `next-Nd`, or an ISO range with timezone offset `<start>~<end>` (e.g. `2026-06-01T00:00:00+09:00~2026-06-14T00:00:00+09:00`).',
    ),
} satisfies Record<keyof ProjectScopedArgs<TaskListArgs>, z.ZodType>;

export function registerTaskList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description:
        "List and filter a project's tasks (ref = project). Task bodies are omitted; fetch one via task_view.",
      inputSchema,
      title: 'List tasks',
    },
    (args) =>
      runTool(async () => {
        const projectId = await resolveProjectId({ api, ref: args.ref });

        return runTaskList({ api, args: { ...args, projectId } });
      }),
  );
}
