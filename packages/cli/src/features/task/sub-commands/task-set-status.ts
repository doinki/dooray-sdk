import { runTaskSetStatus } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskSetStatusArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    statusId: z.string().min(1).describe('Status id to move the task to (from `dooray project status-list`)'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: taskSetStatusArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskSetStatusArgsSchema.shape.ref.description, required: false },
    'status-id': {
      description: taskSetStatusArgsSchema.shape.statusId.description,
      required: true,
      type: 'string',
      valueHint: 'statusId',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Set a task to any project status, including reopening a closed task', name: 'set-status' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskSetStatus,
      schema: taskSetStatusArgsSchema,
    });

    formatter.printInfo(`Updated status of task \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskSetStatus>>): string {
  return renderKeyValue([['ID', data.id]]);
}
