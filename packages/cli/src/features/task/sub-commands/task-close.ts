import { runTaskClose } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema;

export default defineSubcommand({
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
  schema,
});
