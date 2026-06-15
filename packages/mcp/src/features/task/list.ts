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
    .describe('Filter by assignee — member ids, `@me`, or `none` for unassigned (overrides any ids passed with it).'),
  author: z.array(z.string()).optional().describe('Filter by author — member ids or `@me`.'),
  authorEmail: z.string().optional().describe('Filter by sender email for tasks created via email.'),
  cc: z.array(z.string()).optional().describe('Filter by CC — member ids or `@me`.'),
  created: datePatternSchema
    .optional()
    .describe(
      'Filter by creation date — `today`, `thisweek`, `prev-Nd`, `next-Nd`, or an ISO range `<start>~<end>` (e.g. `2026-06-01T00:00:00+09:00~2026-06-14T00:00:00+09:00`).',
    ),
  due: datePatternSchema
    .optional()
    .describe(
      'Filter by due date — `today`, `thisweek`, `prev-Nd`, `next-Nd`, or an ISO range `<start>~<end>` (e.g. `2026-06-01T00:00:00+09:00~2026-06-14T00:00:00+09:00`).',
    ),
  milestone: z.array(z.string()).optional().describe('Filter by milestone id; from project_milestone_list.'),
  number: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filter by task number — the numeric part of the task key (e.g. 123 for ABC-123).'),
  page: pageSchema,
  parent: z.string().optional().describe("Parent task id; returns that task's subtasks."),
  ref: projectScopeShape.ref,
  search: z
    .array(z.string())
    .optional()
    .describe('Filter by exact task title; does not match partial titles or body text.'),
  size: sizeSchema,
  sort: z
    .enum(SORT_OPTIONS)
    .optional()
    .describe('Sort by date — `due`, `updated`, or `created`; prefix with `-` for descending (e.g. `-updated`).'),
  status: z.array(z.string()).optional().describe('Filter by status id; from project_status_list.'),
  statusClass: z
    .array(z.enum(STATUS_CLASSES))
    .optional()
    .describe('Filter by status class — `backlog`, `registered`, `working`, or `closed`.'),
  tagIds: z.array(z.string()).optional().describe('Filter by tag id; from project_tag_list.'),
  updated: datePatternSchema
    .optional()
    .describe(
      'Filter by last-updated date — `today`, `thisweek`, `prev-Nd`, `next-Nd`, or an ISO range `<start>~<end>` (e.g. `2026-06-01T00:00:00+09:00~2026-06-14T00:00:00+09:00`).',
    ),
} satisfies Record<keyof ProjectScopedArgs<TaskListArgs>, z.ZodType>;

export function registerTaskList(server: McpServer, api: DoorayApi): void {
  server.registerTool(
    'task_list',
    {
      annotations: { destructiveHint: false, idempotentHint: true, openWorldHint: false, readOnlyHint: true },
      description: "List a project's tasks. Bodies are omitted; fetch one via task_view.",
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
