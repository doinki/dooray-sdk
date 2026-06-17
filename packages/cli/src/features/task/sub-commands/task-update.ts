import { runTaskUpdate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { csvField, requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskUpdateArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    assignees: csvField(
      'Assignees (comma-separated — `@me` or member ids). Replaces the whole list; omit to keep current.',
      'user[,user...]',
    ),
    body: z
      .string()
      .optional()
      .meta({ hint: 'text' })
      .describe('New body (Markdown unless --mime-type is text/html). Omit to keep current.'),
    cc: csvField(
      'CC (comma-separated — `@me` or member ids). Replaces the whole list; omit to keep current.',
      'user[,user...]',
    ),
    dueDate: z
      .string()
      .trim()
      .optional()
      .meta({ hint: 'YYYY-MM-DD±HH:MM' })
      .describe('Due date with timezone offset (e.g. `2026-06-20+09:00`); applied only with --due-date-flag.'),
    dueDateFlag: z.boolean().optional().describe('Apply --due-date. Omit to keep current.'),
    milestoneId: z
      .string()
      .trim()
      .optional()
      .meta({ hint: 'milestoneId' })
      .describe('Milestone id (from `dooray project milestone-list`).'),
    mimeType: z
      .enum(BODY_MIME_TYPES)
      .optional()
      .describe('Body content type — text/x-markdown or text/html. Pass alongside --body.'),
    priority: z
      .enum(TASK_PRIORITIES)
      .optional()
      .describe('Priority — highest, high, normal, low, lowest, or none. Omit to keep current.'),
    tagIds: csvField('Tag ids (comma-separated). Replaces the whole list; omit to keep current.', 'id[,id...]'),
    title: z.string().optional().meta({ hint: 'text' }).describe('New title. Omit to keep current.'),
    version: z.coerce
      .number()
      .int()
      .optional()
      .describe(
        'Optimistic-lock version. Omit to apply to the latest revision; pass a known version to fail on a concurrent edit.',
      ),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskUpdateArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Edit a task's title, body, assignees, due date, priority, milestone, or tags",
    name: 'update',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskUpdate,
      schema: taskUpdateArgsSchema,
    });

    formatter.printInfo(`Updated task \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskUpdate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
