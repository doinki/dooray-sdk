import { runTaskClose } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const taskCloseArgsSchema = z
  .object({
    id: z
      .string()
      .optional()
      .describe('Task ID to close (19-digit). Looked up across all accessible projects when given alone.'),
    ref: z
      .string()
      .optional()
      .describe('Task to close instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task to close: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['taskId'],
  });

export default defineSubcommand({
  args: {
    id: {
      description: taskCloseArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: {
      ...globalArgs.ref,
      description: taskCloseArgsSchema.shape.ref.description,
      required: false,
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Mark a task done (resolves the project automatically)', name: 'close' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskClose,
      schema: taskCloseArgsSchema,
    });

    formatter.printInfo(`Closed task \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskClose>>) {
  return renderKeyValue([['ID', data.id]]);
}
