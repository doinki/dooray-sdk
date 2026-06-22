import { runTaskList } from '@dooray-sdk/core';
import { SORT_OPTIONS, STATUS_CLASSES } from '@dooray-sdk/core/constants';
import { datePatternSchema, pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';
import { renderList } from '../../../shared/utils/table';
import { formatDate, truncate } from '../../../shared/utils/text';
import { formatUser } from '../../../shared/utils/user';

const schema = z.object({
  assignee: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe(
      'Filter by assignee (comma-separated `@me`, member ids, or `none` for unassigned; `none` overrides any ids).',
    )
    .meta({ hint: 'user[,user...]' }),
  author: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by author (comma-separated `@me` or member ids).')
    .meta({ hint: 'user[,user...]' }),
  authorEmail: z
    .string()
    .optional()
    .meta({ hint: 'email' })
    .describe('Filter by sender email, for tasks created via email.'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by cc (comma-separated `@me` or member ids).')
    .meta({ hint: 'user[,user...]' }),
  created: datePatternSchema
    .optional()
    .meta({ hint: 'pattern' })
    .describe('Filter by creation date: `today`, `thisweek`, `prev-Nd`, `next-Nd`, or `<startISO>~<endISO>`.'),
  due: datePatternSchema
    .optional()
    .meta({ hint: 'pattern' })
    .describe('Filter by due date (same grammar as --created).'),
  milestone: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by milestone id (comma-separated).')
    .meta({ hint: 'id[,id...]' }),
  number: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .describe('Filter by task number, the numeric part of the task key (e.g. `123` for `ABC-123`).'),
  page: pageSchema,
  parent: z.string().optional().meta({ hint: 'id' }).describe("Parent task id; returns that task's subtasks."),
  search: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by exact task title (comma-separated); not partial titles or body text.')
    .meta({ hint: 'title[,title...]' }),
  size: sizeSchema,
  sort: z
    .enum(SORT_OPTIONS)
    .optional()
    .describe('Sort by date: `due`, `updated`, or `created`; prefix `-` for descending (e.g. `-updated`).'),
  status: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by status id, not name (comma-separated; from `dooray project status-list`).')
    .meta({ hint: 'id[,id...]' }),
  statusClass: z
    .string()
    .transform(splitCsv)
    .pipe(z.array(z.enum(STATUS_CLASSES)))
    .optional()
    .meta({ hint: 'class[,class...]' })
    .describe('Filter by status class (comma-separated `backlog`, `registered`, `working`, `closed`).'),
  tagIds: z
    .string()
    .transform(splitCsv)
    .optional()
    .describe('Filter by tag id (comma-separated).')
    .meta({ hint: 'id[,id...]' }),
  updated: datePatternSchema
    .optional()
    .meta({ hint: 'pattern' })
    .describe('Filter by last-updated date (same grammar as --created).'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description:
      'List tasks in a project with filters, sorting, and pagination (bodies omitted; fetch one via `dooray task view`)',
    name: 'list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No tasks.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (t) => t.id },
    { header: 'taskNumber', value: (t) => t.taskNumber },
    { header: 'parentId', value: (t) => t.parent?.id },
    { header: 'title', value: (t) => truncate(t.subject, 60) },
    { header: 'parent', value: (t) => t.parent?.subject },
    { header: 'author', value: (t) => formatUser(t.users.from, { withId: true }) },
    { header: 'assignees', value: (t) => t.users.to.map((user) => formatUser(user, { withId: true })).join(', ') },
    { header: 'cc', value: (t) => t.users.cc.map((user) => formatUser(user, { withId: true })).join(', ') },
    { header: 'status', value: (t) => `${t.workflow.name}(${t.workflowClass})` },
    { header: 'priority', value: (t) => t.priority },
    { header: 'milestoneId', value: (t) => t.milestone?.id },
    { header: 'milestone', value: (t) => t.milestone?.name },
    { header: 'tags', value: (t) => t.tags.map((tag) => tag.id).join(', ') },
    { header: 'dueDate', value: (t) => formatDate(t.dueDate) },
    { header: 'dueDateFlag', value: (t) => t.dueDateFlag },
    { header: 'attachmentCount', value: (t) => t.fileIdList.length },
    { header: 'createdAt', value: (t) => formatDate(t.createdAt) },
    { header: 'endedAt', value: (t) => formatDate(t.endedAt) },
    { header: 'updatedAt', value: (t) => formatDate(t.updatedAt) },
  ]);
}
