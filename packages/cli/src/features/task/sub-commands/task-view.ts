import { runTaskView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { formatUser } from '../../../shared/formatter/user';

export const taskViewArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Task ID to view (19-digit). Looked up across all accessible projects when given alone.'),
    ref: z
      .string()
      .optional()
      .describe('Task to view instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task to view: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: taskViewArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: {
      ...globalArgs.ref,
      description: taskViewArgsSchema.shape.ref.description,
      required: false,
    },
  },
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
