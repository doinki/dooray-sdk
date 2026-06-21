import { runTaskFileDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { confirmField } from '../../../shared/schemas/fields';

const schema = z.object({
  fileId: z
    .string()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Attachment id to delete (from `dooray task file-list`)'),
  yes: confirmField,
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Delete an attachment from a task (irreversible)', name: 'file-delete' },
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
});
