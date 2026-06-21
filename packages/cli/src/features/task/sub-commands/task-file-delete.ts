import { runTaskFileDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithTaskScope } from '../../../shared/command/run-with-task-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireTaskRef, taskRefShape } from '../../../shared/schema/fields';

export const taskFileDeleteArgsSchema = requireTaskRef(
  z.object({
    ...taskRefShape,
    fileId: z
      .string()
      .min(1)
      .meta({ hint: 'fileId' })
      .describe('Attachment id to delete (from `dooray task file-list`)'),
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(taskFileDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
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
      schema: taskFileDeleteArgsSchema,
    });

    formatter.printInfo(`Deleted attachment \`${data.fileId}\`.`);
  },
});
