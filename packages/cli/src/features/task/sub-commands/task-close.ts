import { runTaskClose } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: "Close a task (set the project's closed status and complete every assignee)",
    name: 'close',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithTaskScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runTaskClose,
      schema,
    });

    formatter.printInfo(`Closed task \`${result.data.id}\`.`);
  },
});
