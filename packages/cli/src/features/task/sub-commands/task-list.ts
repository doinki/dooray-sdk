import { runTaskList } from '@dooray-sdk/core';
import { SORT_OPTIONS, STATUS_CLASSES } from '@dooray-sdk/core/constants';
import { datePatternSchema, pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';
import { formatDate, truncate } from '../../../shared/formatter/text';
import { formatUser } from '../../../shared/formatter/user';
import { splitCsv } from '../../../shared/schema/csv';

export const taskListArgsSchema = z.object({
  assignee: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe(
      'Filter by assignee (comma-separated — `@me`, member ids, or `none` for unassigned; `none` overrides any ids)',
    ),
  author: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by author (comma-separated — `@me` or a member id)'),
  authorEmail: z
    .string()
    .optional()
    .describe('Filter by the email address that created the task (for tasks created via email)'),
  cc: z.string().transform(splitCsv).optional().describe('Filter by CC (comma-separated — `@me` or a member id)'),
  created: datePatternSchema
    .optional()
    .describe('Filter by creation date — today, thisweek, prev-Nd, next-Nd, or <startISO>~<endISO>'),
  due: datePatternSchema
    .optional()
    .describe('Filter by due date — today, thisweek, prev-Nd, next-Nd, or <startISO>~<endISO>'),
  milestone: z.string().transform(splitCsv).optional().describe('Filter by milestone id (comma-separated)'),
  number: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filter by task number — the numeric part of the task key (e.g. 123 for ABC-123)'),
  page: pageSchema,
  parent: z.string().optional().describe('Filter by parent task id'),
  search: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by exact task title (subject); comma-separated; not body text'),
  size: sizeSchema,
  sort: z.enum(SORT_OPTIONS).optional().describe('Sort by due, updated, or created date (prefix with `-` to reverse)'),
  status: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by status id (not name); comma-separated; ids from project status list'),
  statusClass: z
    .string()
    .transform(splitCsv)
    .pipe(z.array(z.enum(STATUS_CLASSES)))
    .optional()
    .describe('Filter by status class (comma-separated — backlog, registered, working, closed)'),
  tagIds: z.string().transform(splitCsv).optional().describe('Filter by tag id (comma-separated)'),
  updated: datePatternSchema
    .optional()
    .describe('Filter by last-updated date — today, thisweek, prev-Nd, next-Nd, or <startISO>~<endISO>'),
});

export default defineSubcommand({
  args: {
    assignee: {
      description: taskListArgsSchema.shape.assignee.description,
      type: 'string',
      valueHint: 'user[,user...]',
    },
    author: { description: taskListArgsSchema.shape.author.description, type: 'string', valueHint: 'user[,user...]' },
    'author-email': {
      description: taskListArgsSchema.shape.authorEmail.description,
      type: 'string',
      valueHint: 'email',
    },
    cc: { description: taskListArgsSchema.shape.cc.description, type: 'string', valueHint: 'user[,user...]' },
    created: { description: taskListArgsSchema.shape.created.description, type: 'string', valueHint: 'pattern' },
    due: { description: taskListArgsSchema.shape.due.description, type: 'string', valueHint: 'pattern' },
    milestone: {
      description: taskListArgsSchema.shape.milestone.description,
      type: 'string',
      valueHint: 'id[,id...]',
    },
    number: { description: taskListArgsSchema.shape.number.description, type: 'string', valueHint: 'n' },
    page: { description: taskListArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    parent: { description: taskListArgsSchema.shape.parent.description, type: 'string', valueHint: 'id' },
    search: {
      description: taskListArgsSchema.shape.search.description,
      type: 'string',
      valueHint: 'title[,title...]',
    },
    size: { description: taskListArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
    sort: { description: taskListArgsSchema.shape.sort.description, options: [...SORT_OPTIONS], type: 'enum' },
    status: { description: taskListArgsSchema.shape.status.description, type: 'string', valueHint: 'id[,id...]' },
    'status-class': {
      description: taskListArgsSchema.shape.statusClass.description,
      type: 'string',
      valueHint: 'class[,class...]',
    },
    'tag-ids': { description: taskListArgsSchema.shape.tagIds.description, type: 'string', valueHint: 'id[,id...]' },
    updated: { description: taskListArgsSchema.shape.updated.description, type: 'string', valueHint: 'pattern' },
  },
  meta: {
    description: 'List tasks in a project with filters, sorting, and pagination',
    name: 'list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskList,
      schema: taskListArgsSchema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No tasks.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (t) => t.id },
    { header: 'number', value: (t) => t.taskNumber },
    { header: 'title', value: (t) => truncate(t.subject, 60) },
    { header: 'parent', value: (t) => t.parent?.subject },
    { header: 'author', value: (t) => formatUser(t.users.from) },
    { header: 'assignees', value: (t) => t.users.to.map((user) => formatUser(user)).join(', ') },
    { header: 'cc', value: (t) => t.users.cc.map((user) => formatUser(user)).join(', ') },
    { header: 'status', value: (t) => `${t.workflow.name}(${t.workflowClass})` },
    { header: 'priority', value: (t) => t.priority },
    { header: 'milestone', value: (t) => t.milestone?.name },
    { header: 'due', value: (t) => formatDate(t.dueDate) },
    { header: 'created', value: (t) => formatDate(t.createdAt) },
    { header: 'updated', value: (t) => formatDate(t.updatedAt) },
  ]);
}
