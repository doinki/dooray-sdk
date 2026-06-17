import { runTaskSetStatus } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskSetStatusArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    statusId: z
      .string()
      .min(1)
      .meta({ hint: 'statusId' })
      .describe('Status id to move the task to (from `dooray project status-list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskSetStatusArgsSchema),
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
