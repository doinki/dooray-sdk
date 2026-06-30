import { runTaskSetStatus } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  statusId: z
    .string()
    .min(1)
    .meta({ hint: 'statusId' })
    .describe('Status id to move the task to (from `dooray project status-list`).'),
});

export default defineSubcommand({
  meta: { description: "Set a task's status to any project status (also reopens a closed task)", name: 'set-status' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskSetStatus,
      schema,
    });

    formatter.printInfo(`Updated status of task \`${result.data.id}\`.`);
  },
  schema,
});
