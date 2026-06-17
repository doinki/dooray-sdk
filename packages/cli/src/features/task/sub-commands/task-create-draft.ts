import { runTaskCreateDraft } from '@dooray-sdk/core';
import { BODY_MIME_TYPES, TASK_PRIORITIES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { splitCsv } from '../../../shared/schema/csv';

export const taskCreateDraftArgsSchema = z.object({
  assignees: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Assignees (comma-separated — `@me` or member ids; default: @me)'),
  body: z.string().optional().describe('Draft body (Markdown unless --mime-type is text/html; default: empty)'),
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
  priority: z.enum(TASK_PRIORITIES).optional().describe('Priority — highest, high, normal, low, lowest, or none'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Tag ids (comma-separated; from `dooray project tag-list`)'),
  title: z.string().trim().min(1, 'Draft title must not be empty.').describe('Draft title'),
});

export default defineSubcommand({
  args: {
    assignees: {
      description: taskCreateDraftArgsSchema.shape.assignees.description,
      type: 'string',
      valueHint: 'user[,user...]',
    },
    body: { description: taskCreateDraftArgsSchema.shape.body.description, type: 'string', valueHint: 'text' },
    cc: { description: taskCreateDraftArgsSchema.shape.cc.description, type: 'string', valueHint: 'user[,user...]' },
    'due-date': {
      description: taskCreateDraftArgsSchema.shape.dueDate.description,
      type: 'string',
      valueHint: 'YYYY-MM-DD±HH:MM',
    },
    'due-date-flag': { description: taskCreateDraftArgsSchema.shape.dueDateFlag.description, type: 'boolean' },
    'milestone-id': {
      description: taskCreateDraftArgsSchema.shape.milestoneId.description,
      type: 'string',
      valueHint: 'milestoneId',
    },
    'mime-type': {
      description: taskCreateDraftArgsSchema.shape.mimeType.description,
      options: [...BODY_MIME_TYPES],
      type: 'enum',
    },
    priority: {
      description: taskCreateDraftArgsSchema.shape.priority.description,
      options: [...TASK_PRIORITIES],
      type: 'enum',
    },
    'tag-ids': {
      description: taskCreateDraftArgsSchema.shape.tagIds.description,
      type: 'string',
      valueHint: 'id[,id...]',
    },
    title: {
      description: taskCreateDraftArgsSchema.shape.title.description,
      required: true,
      type: 'string',
      valueHint: 'text',
    },
  },
  meta: {
    description: 'Create a draft task (not a real task until submitted in the Dooray UI)',
    name: 'create-draft',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskCreateDraft,
      schema: taskCreateDraftArgsSchema,
    });

    formatter.printInfo(`Created draft \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskCreateDraft>>): string {
  return renderKeyValue([['ID', data.id]]);
}
