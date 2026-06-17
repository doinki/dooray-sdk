import { runTaskCreate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { csvField } from '../../../shared/schema/fields';

export const taskCreateArgsSchema = z.object({
  assignees: csvField('Assignees (comma-separated — `@me` or member ids; default: @me)', 'user[,user...]'),
  body: z
    .string()
    .optional()
    .meta({ hint: 'text' })
    .describe('Task body (Markdown unless --mime-type is text/html; default: empty)'),
  cc: csvField('CC (comma-separated — `@me` or member ids)', 'user[,user...]'),
  dueDate: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'YYYY-MM-DD±HH:MM' })
    .describe('Due date with timezone offset (e.g. `2026-06-20+09:00`); applied only with --due-date-flag'),
  dueDateFlag: z.boolean().optional().describe('Apply --due-date'),
  milestoneId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'milestoneId' })
    .describe('Milestone id (from `dooray project milestone-list`)'),
  mimeType: z
    .enum(BODY_MIME_TYPES)
    .optional()
    .describe('Body content type — text/x-markdown or text/html (default: text/x-markdown)'),
  parentId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'taskId' })
    .describe('Parent task id to create this task under as a subtask'),
  priority: z.enum(TASK_PRIORITIES).optional().describe('Priority — highest, high, normal, low, lowest, or none'),
  tagIds: csvField('Tag ids (comma-separated; from `dooray project tag-list`)', 'id[,id...]'),
  title: z.string().trim().min(1, 'Task title must not be empty.').meta({ hint: 'text' }).describe('Task title'),
});

export default defineSubcommand({
  args: argsFromSchema(taskCreateArgsSchema),
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
