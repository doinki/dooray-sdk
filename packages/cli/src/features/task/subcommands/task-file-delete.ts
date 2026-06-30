import { runTaskFileDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  fileId: z
    .string()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Attachment id (from `dooray task file-list`).'),
  yes: yesSchema,
});

export default defineSubcommand({
  meta: { description: 'Delete a task attachment (irreversible)', name: 'file-delete' },
  async run({ api, args, formatter }) {
    const { data } = await runWithTaskScope({
      api,
      args,
      confirm: ({ args: a }) =>
        confirmDeletion({ json: isJsonOutput(args.json), message: `Delete attachment \`${a.fileId}\`?`, skip: a.yes }),
      formatter,
      render: renderId,
      run: runTaskFileDelete,
      schema,
    });

    formatter.printInfo(`Deleted attachment \`${data.fileId}\`.`);
  },
  schema,
});
