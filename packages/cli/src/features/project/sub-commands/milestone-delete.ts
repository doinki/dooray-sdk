import { runProjectMilestoneDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { confirmField } from '../../../shared/utils/fields';

export const milestoneDeleteArgsSchema = z.object({
  id: z.string().min(1).meta({ hint: 'milestoneId', positional: true }).describe('Milestone id to delete'),
  yes: confirmField,
});

export default defineSubcommand({
  args: argsFromSchema(milestoneDeleteArgsSchema),
  meta: {
    description: 'Delete a milestone (its tasks lose the milestone reference; irreversible)',
    name: 'milestone-delete',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      confirm: ({ args: a }) =>
        confirmDeletion({ json: isJsonOutput(args.json), message: `Delete milestone \`${a.id}\`?`, skip: a.yes }),
      formatter,
      render: renderId,
      run: runProjectMilestoneDelete,
      schema: milestoneDeleteArgsSchema,
    });

    formatter.printInfo(`Deleted milestone \`${data.id}\`.`);
  },
});
