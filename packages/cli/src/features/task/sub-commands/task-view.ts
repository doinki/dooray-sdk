import { runTaskView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/utils/fields';
import { formatUser } from '../../../shared/utils/user';

export const taskViewArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskViewArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'View a single task by id or reference (resolved across projects if needed)', name: 'view' },
  async run({ api, args, formatter }) {
    await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskView,
      schema: taskViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskView>>): string {
  const content = renderKeyValue([
    ['ID', data.id],
    ['Task Number', data.taskNumber],
    ['Title', data.subject],
    ['Milestone', data.milestone?.name],
    ['Status', `${data.workflow.name}(${data.workflowClass})`],
    ['Priority', data.priority],
    ['Author', formatUser(data.users.from)],
    ['Assignees', data.users.to.map((user) => formatUser(user)).join(', ')],
    ['CC', data.users.cc.map((user) => formatUser(user)).join(', ')],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
