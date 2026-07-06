import type { MilestoneDeleteArgs } from '@dooray-sdk/core';
import { runProjectMilestoneDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmField } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  id: z.string().min(1).meta({ hint: 'milestoneId', positional: true }).describe('Milestone id to delete'),
  yes: yesSchema,
} satisfies CommandSchemaShape<MilestoneDeleteArgs>);

export default defineSubcommand({
  meta: {
    description: 'Delete a milestone (its tasks lose the milestone reference; irreversible)',
    name: 'milestone-delete',
  },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      confirm: confirmField(({ args }) => `Delete milestone \`${args.id}\`?`),
      formatter,
      render: renderId,
      run: runProjectMilestoneDelete,
      schema,
    });

    formatter.printInfo(`Deleted milestone \`${data.id}\`.`);
  },
  schema,
});
