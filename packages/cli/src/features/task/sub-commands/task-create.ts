import { runTaskCreate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

export const taskCreateArgsSchema = z.object({
  assignees: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Assignees (comma-separated — `@me` or member ids; default: @me)'),
  body: z.string().optional().describe('Task body (Markdown unless --mime-type is text/html; default: empty)'),
  cc: z.string().transform(splitCsv).optional().describe('CC (comma-separated — `@me` or member ids)'),
  dueDate: z
    .string()
    .trim()
    .optional()
    .describe('Due date with timezone offset (e.g. `2026-06-20+09:00`); applied only with --due-date-flag'),
  dueDateFlag: z.boolean().optional().describe('Apply --due-date'),
  milestoneId: z.string().trim().optional().describe('Milestone id (from `dooray project milestone-list`)'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown)'),
  parentId: z.string().trim().optional().describe('Parent task id to create this task under as a subtask'),
  priority: z.enum(TASK_PRIORITIES).optional().describe('Priority — highest, high, normal, low, lowest, or none'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Tag ids (comma-separated; from `dooray project tag-list`)'),
  title: z.string().trim().min(1, 'Task title must not be empty.').describe('Task title'),
});

export default defineSubcommand({
  args: {
    assignees: {
      description: taskCreateArgsSchema.shape.assignees.description,
      type: 'string',
      valueHint: 'user[,user...]',
    },
    body: { description: taskCreateArgsSchema.shape.body.description, type: 'string', valueHint: 'text' },
    cc: { description: taskCreateArgsSchema.shape.cc.description, type: 'string', valueHint: 'user[,user...]' },
    'due-date': {
      description: taskCreateArgsSchema.shape.dueDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
    'due-date-flag': { description: taskCreateArgsSchema.shape.dueDateFlag.description, type: 'boolean' },
    'milestone-id': {
      description: taskCreateArgsSchema.shape.milestoneId.description,
      type: 'string',
      valueHint: 'milestoneId',
    },
    'mime-type': {
      description: taskCreateArgsSchema.shape.mimeType.description,
      options: [...BODY_MIME_TYPES],
      type: 'enum',
    },
    'parent-id': { description: taskCreateArgsSchema.shape.parentId.description, type: 'string', valueHint: 'taskId' },
    priority: {
      description: taskCreateArgsSchema.shape.priority.description,
      options: [...TASK_PRIORITIES],
      type: 'enum',
    },
    'tag-ids': { description: taskCreateArgsSchema.shape.tagIds.description, type: 'string', valueHint: 'id[,id...]' },
    title: {
      description: taskCreateArgsSchema.shape.title.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  meta: { description: 'Create a task in a project (omitting --assignees assigns you)', name: 'create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCreate,
      schema: taskCreateArgsSchema,
    });

    formatter.printInfo(`Created task \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCreate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
