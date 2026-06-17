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
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { csvField } from '../../../shared/schema/fields';

export const taskListArgsSchema = z.object({
  assignee: csvField(
    'Filter by assignee (comma-separated — `@me`, member ids, or `none` for unassigned; `none` overrides any ids)',
    'user[,user...]',
  ),
  author: csvField('Filter by author (comma-separated — `@me` or a member id)', 'user[,user...]'),
  authorEmail: z
    .string()
    .optional()
    .meta({ hint: 'email' })
    .describe('Filter by the email address that created the task (for tasks created via email)'),
  cc: csvField('Filter by CC (comma-separated — `@me` or a member id)', 'user[,user...]'),
  created: datePatternSchema
    .optional()
    .meta({ hint: 'pattern' })
    .describe('Filter by creation date — today, thisweek, prev-Nd, next-Nd, or <startISO>~<endISO>'),
  due: datePatternSchema
    .optional()
    .meta({ hint: 'pattern' })
    .describe('Filter by due date — today, thisweek, prev-Nd, next-Nd, or <startISO>~<endISO>'),
  milestone: csvField('Filter by milestone id (comma-separated)', 'id[,id...]'),
  number: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filter by task number — the numeric part of the task key (e.g. 123 for ABC-123)'),
  page: pageSchema,
  parent: z.string().optional().meta({ hint: 'id' }).describe('Filter by parent task id'),
  search: csvField('Filter by exact task title (subject); comma-separated; not body text', 'title[,title...]'),
  size: sizeSchema,
  sort: z.enum(SORT_OPTIONS).optional().describe('Sort by due, updated, or created date (prefix with `-` to reverse)'),
  status: csvField('Filter by status id (not name); comma-separated; ids from project status list', 'id[,id...]'),
  statusClass: z
    .string()
    .transform(splitCsv)
    .pipe(z.array(z.enum(STATUS_CLASSES)))
    .optional()
    .meta({ hint: 'class[,class...]' })
    .describe('Filter by status class (comma-separated — backlog, registered, working, closed)'),
  tagIds: csvField('Filter by tag id (comma-separated)', 'id[,id...]'),
  updated: datePatternSchema
    .optional()
    .meta({ hint: 'pattern' })
    .describe('Filter by last-updated date — today, thisweek, prev-Nd, next-Nd, or <startISO>~<endISO>'),
});

export default defineSubcommand({
  args: argsFromSchema(taskListArgsSchema),
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
