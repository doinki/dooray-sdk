import { runTaskView } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatDateTime } from '../../../shared/utils/text';
import { formatUser } from '../../../shared/utils/user';

const schema = globalArgsSchema;

export default defineSubcommand({
  meta: { description: 'View a single task by id or reference (resolved across projects if needed)', name: 'view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskView,
      schema,
    });
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['taskNumber', data.taskNumber],
    ['projectId', data.project.id],
    ['parentId', data.parent?.id],
    ['parent', data.parent?.subject],
    ['title', data.subject],
    ['author', formatUser(data.users.from, { withId: true })],
    ['assignees', data.users.to.map((user) => formatUser(user, { withId: true })).join(', ')],
    ['cc', data.users.cc.map((user) => formatUser(user, { withId: true })).join(', ')],
    ['status', `${data.workflow.name}(${data.workflowClass})`],
    ['closed', data.closed],
    ['priority', data.priority],
    ['milestoneId', data.milestone?.id],
    ['milestone', data.milestone?.name],
    ['tags', data.tags.map((tag) => tag.id).join(', ')],
    ['dueDate', formatDateTime(data.dueDate)],
    ['dueDateFlag', data.dueDateFlag],
    ['attachments', (data.files ?? []).map((file) => `${file.name}(${file.id})`).join(', ')],
    ['mimeType', data.body.mimeType],
    ['createdAt', formatDateTime(data.createdAt)],
    ['endedAt', formatDateTime(data.endedAt)],
    ['updatedAt', formatDateTime(data.updatedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
