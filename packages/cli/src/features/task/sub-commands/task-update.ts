import { runTaskUpdate } from '@dooray-sdk/core';
import { TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
import { mimeTypeField } from '../utils/fields';

const schema = z.object({
  assignees: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Assignees (comma-separated `@me` or member ids). Replaces the whole list; omit to keep current.')
    .meta({ hint: 'user[,user...]' }),
  body: z
    .string()
    .optional()
    .meta({ hint: 'text' })
    .describe('New body (Markdown unless --mime-type is `text/html`). Omit to keep current.'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('cc (comma-separated `@me` or member ids). Replaces the whole list; omit to keep current.')
    .meta({ hint: 'user[,user...]' }),
  dueDate: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'YYYY-MM-DD±HH:MM' })
    .describe(
      'Due date with timezone offset (e.g. `2026-06-20+09:00`); applies only with --due-date-flag. Omit to keep current.',
    ),
  dueDateFlag: z.boolean().optional().describe('Set with --due-date to apply it. Omit to keep current.'),
  milestoneId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'milestoneId' })
    .describe('Milestone id (from `dooray project milestone-list`). Omit to keep current.'),
  mimeType: mimeTypeField(
    'Body content type: `text/x-markdown` or `text/html` (default: `text/x-markdown`). Pass alongside --body.',
  ),
  priority: z
    .enum(TASK_PRIORITIES)
    .optional()
    .describe('Priority: highest, high, normal, low, lowest, or none. Omit to keep current.'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Tag ids (comma-separated). Replaces the whole list; omit to keep current.')
    .meta({ hint: 'id[,id...]' }),
  title: z.string().optional().meta({ hint: 'text' }).describe('New title. Omit to keep current.'),
  version: z.coerce
    .number()
    .int()
    .optional()
    .describe(
      'Optimistic-lock version. Omit to apply to the latest revision; pass a known version to fail on a concurrent edit.',
    ),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: "Edit a task's title, body, assignees, due date, priority, milestone, or tags",
    name: 'update',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskUpdate,
      schema,
    });

    formatter.printInfo(`Updated task \`${result.data.id}\`.`);
  },
});
