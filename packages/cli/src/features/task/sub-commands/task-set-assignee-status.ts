import { runTaskSetAssigneeStatus } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskSetAssigneeStatusArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    memberId: z
      .string()
      .min(1)
      .meta({ hint: 'memberId' })
      .describe('Assignee member id or `@me` (from `dooray member search`)'),
    statusId: z
      .string()
      .min(1)
      .meta({ hint: 'statusId' })
      .describe('Status id to set for this assignee (from `dooray project status-list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskSetAssigneeStatusArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Set one assignee's personal status on a task (not the task's overall status)",
    name: 'set-assignee-status',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runTaskSetAssigneeStatus,
      schema: taskSetAssigneeStatusArgsSchema,
    });

    formatter.printInfo(`Updated assignee status on task \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskSetAssigneeStatus>>): string {
  return renderKeyValue([['ID', data.id]]);
}
