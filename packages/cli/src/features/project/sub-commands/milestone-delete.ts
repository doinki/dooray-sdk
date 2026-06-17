import { runProjectMilestoneDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField } from '../../../shared/schema/fields';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

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
    const { id, yes } = parseArgsOrThrow(milestoneDeleteArgsSchema, args);

    await confirmDeletion({ json: isJsonOutput(args.json), message: `Delete milestone \`${id}\`?`, skip: yes });

    const projectId = await resolveProjectId({ api, ref: args.ref });
    const result = await runProjectMilestoneDelete({
      api,
      args: { id, projectId },
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted milestone \`${id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMilestoneDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
