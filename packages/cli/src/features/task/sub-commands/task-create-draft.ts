import { runTaskCreateDraft } from '@dooray-sdk/core';
import { TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
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
    .describe('Draft body (Markdown unless --mime-type is text/html; default: empty)'),
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
  priority: z.enum(TASK_PRIORITIES).optional().describe('Priority — highest, high, normal, low, lowest, or none'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Tag ids (comma-separated; from `dooray project tag-list`)')
    .meta({ hint: 'id[,id...]' }),
  title: z.string().trim().min(1, 'Draft title must not be empty.').meta({ hint: 'text' }).describe('Draft title'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: 'Create a draft task (not a real task until submitted in the Dooray UI)',
    name: 'create-draft',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskCreateDraft,
      schema,
    });

    formatter.printInfo(`Created draft \`${result.data.id}\`.`);
  },
});
