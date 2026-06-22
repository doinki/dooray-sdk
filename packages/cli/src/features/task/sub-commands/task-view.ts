import { runTaskView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { formatUser } from '../../../shared/utils/user';

const schema = z.object({});

export default defineSubcommand({
  args: argsFromSchema(schema),
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
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['taskNumber', data.taskNumber],
    ['title', data.subject],
    ['milestone', data.milestone?.name],
    ['status', `${data.workflow.name}(${data.workflowClass})`],
    ['priority', data.priority],
    ['author', formatUser(data.users.from)],
    ['assignees', data.users.to.map((user) => formatUser(user)).join(', ')],
    ['cc', data.users.cc.map((user) => formatUser(user)).join(', ')],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
