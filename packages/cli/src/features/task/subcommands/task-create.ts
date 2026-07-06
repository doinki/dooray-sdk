import type { TaskCreateArgs } from '@dooray-sdk/core';
import { runTaskCreate } from '@dooray-sdk/core';
import { TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
import { mimeTypeField } from '../utils/fields';

const schema = globalArgsSchema.extend({
  assignees: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'user[,user...]' })
    .describe('Assignees (comma-separated `@me` or member ids; default: `@me`).'),
  body: z
    .string()
    .optional()
    .meta({ hint: 'text' })
    .describe('Task body (Markdown unless --mime-type is `text/html`; default: empty).'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'user[,user...]' })
    .describe('cc (comma-separated `@me` or member ids).'),
  dueDate: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'YYYY-MM-DD±HH:MM' })
    .describe('Due date with timezone offset (e.g. `2026-06-20+09:00`). Applies only with --due-date-flag.'),
  dueDateFlag: z.boolean().optional().describe('Apply --due-date.'),
  milestoneId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'milestoneId' })
    .describe('Milestone id (from `dooray project milestone-list`).'),
  mimeType: mimeTypeField(),
  parentId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'taskId' })
    .describe('Parent task id; creates this task as its subtask.'),
  priority: z.enum(TASK_PRIORITIES).optional().describe('Priority: highest, high, normal, low, lowest, or none.'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'id[,id...]' })
    .describe('Tag ids (comma-separated; from `dooray project tag-list`).'),
  title: z.string().min(1).meta({ hint: 'text' }).describe('Task title.'),
} satisfies CommandSchemaShape<TaskCreateArgs>);

export default defineSubcommand({
  meta: { description: 'Create a task in a project (omit --assignees to assign yourself)', name: 'create' },
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
  schema,
});
