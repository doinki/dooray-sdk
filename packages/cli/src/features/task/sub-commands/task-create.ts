import { runTaskCreate } from '@dooray-sdk/core';
import { TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/utils/csv';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { mimeTypeField } from '../utils/fields';

const schema = z.object({
  assignees: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Assignees (comma-separated — `@me` or member ids; default: @me)')
    .meta({ hint: 'user[,user...]' }),
  body: z
    .string()
    .optional()
    .meta({ hint: 'text' })
    .describe('Task body (Markdown unless --mime-type is text/html; default: empty)'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('CC (comma-separated — `@me` or member ids)')
    .meta({ hint: 'user[,user...]' }),
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
  mimeType: mimeTypeField(),
  parentId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'taskId' })
    .describe('Parent task id to create this task under as a subtask'),
  priority: z.enum(TASK_PRIORITIES).optional().describe('Priority — highest, high, normal, low, lowest, or none'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Tag ids (comma-separated; from `dooray project tag-list`)')
    .meta({ hint: 'id[,id...]' }),
  title: z.string().trim().min(1, 'Task title must not be empty.').meta({ hint: 'text' }).describe('Task title'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Create a task in a project (omitting --assignees assigns you)', name: 'create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskCreate,
      schema,
    });

    formatter.printInfo(`Created task \`${result.data.id}\`.`);
  },
});
