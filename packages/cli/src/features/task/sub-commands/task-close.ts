import { runTaskClose } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireTaskRef, taskRefShape } from '../../../shared/utils/fields';

export const taskCloseArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskCloseArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Mark a task done (resolves the project automatically)', name: 'close' },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskClose,
      schema: taskCloseArgsSchema,
    });

    formatter.printInfo(`Closed task \`${result.data.id}\`.`);
  },
});
