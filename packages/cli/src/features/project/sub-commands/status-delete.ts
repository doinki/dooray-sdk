import { runProjectStatusDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = z.object({
  id: z.string().min(1).meta({ hint: 'statusId', positional: true }).describe('Status id to delete'),
  moveTo: z
    .string()
    .min(1)
    .meta({ hint: 'id' })
    .describe('Required — id of the status that orphaned tasks are moved to'),
  yes: yesSchema,
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: 'Delete a status; its tasks move to `--move-to` (irreversible)',
    name: 'status-delete',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      confirm: ({ args: a }) =>
        confirmDeletion({
          json: isJsonOutput(args.json),
          message: `Delete status \`${a.id}\`? Tasks in it move to \`${a.moveTo}\`.`,
          skip: a.yes,
        }),
      formatter,
      render: renderId,
      run: runProjectStatusDelete,
      schema,
    });

    formatter.printInfo(`Deleted status \`${data.id}\`.`);
  },
});
