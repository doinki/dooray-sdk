import { runTaskUpdate } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

export const taskUpdateArgsSchema = z
  .object({
    assignees: z
      .string()
      .transform(splitCsv)
      .optional()
      .describe('Assignees (comma-separated — `@me` or member ids). Replaces the whole list; omit to keep current.'),
    body: z.string().optional().describe('New body (Markdown unless --mime-type is text/html). Omit to keep current.'),
    cc: z
      .string()
      .transform(splitCsv)
      .optional()
      .describe('CC (comma-separated — `@me` or member ids). Replaces the whole list; omit to keep current.'),
    dueDate: z
      .string()
      .trim()
      .optional()
      .describe('Due date with timezone offset (e.g. `2026-06-20+09:00`); applied only with --due-date-flag.'),
    dueDateFlag: z.boolean().optional().describe('Apply --due-date. Omit to keep current.'),
    id: z
      .string()
      .optional()
      .describe('Task ID to update (19-digit). Looked up across all accessible projects when given alone.'),
    milestoneId: z.string().trim().optional().describe('Milestone id (from `dooray project milestone-list`).'),
    mimeType: z
      .enum(BODY_MIME_TYPES)
      .optional()
      .describe('Body content type — text/x-markdown or text/html. Pass alongside --body.'),
    priority: z
      .enum(TASK_PRIORITIES)
      .optional()
      .describe('Priority — highest, high, normal, low, lowest, or none. Omit to keep current.'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    tagIds: z
      .string()
      .transform(splitCsv)
      .optional()
      .describe('Tag ids (comma-separated). Replaces the whole list; omit to keep current.'),
    title: z.string().optional().describe('New title. Omit to keep current.'),
    version: z.coerce
      .number()
      .int()
      .optional()
      .describe(
        'Optimistic-lock version. Omit to apply to the latest revision; pass a known version to fail on a concurrent edit.',
      ),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task to update: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    assignees: {
      description: taskUpdateArgsSchema.shape.assignees.description,
      type: 'string',
      valueHint: 'user[,user...]',
    },
    body: { description: taskUpdateArgsSchema.shape.body.description, type: 'string', valueHint: 'text' },
    cc: { description: taskUpdateArgsSchema.shape.cc.description, type: 'string', valueHint: 'user[,user...]' },
    'due-date': {
      description: taskUpdateArgsSchema.shape.dueDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
    'due-date-flag': { description: taskUpdateArgsSchema.shape.dueDateFlag.description, type: 'boolean' },
    id: {
      description: taskUpdateArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    'milestone-id': {
      description: taskUpdateArgsSchema.shape.milestoneId.description,
      type: 'string',
      valueHint: 'milestoneId',
    },
    'mime-type': {
      description: taskUpdateArgsSchema.shape.mimeType.description,
      options: [...BODY_MIME_TYPES],
      type: 'enum',
    },
    priority: {
      description: taskUpdateArgsSchema.shape.priority.description,
      options: [...TASK_PRIORITIES],
      type: 'enum',
    },
    ref: { ...globalArgs.ref, description: taskUpdateArgsSchema.shape.ref.description, required: false },
    'tag-ids': { description: taskUpdateArgsSchema.shape.tagIds.description, type: 'string', valueHint: 'id[,id...]' },
    title: { description: taskUpdateArgsSchema.shape.title.description, type: 'string', valueHint: 'text' },
    version: { description: taskUpdateArgsSchema.shape.version.description, type: 'string', valueHint: 'n' },
  },
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
