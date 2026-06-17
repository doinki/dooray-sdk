import { runProjectStatusDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField } from '../../../shared/schema/fields';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const statusDeleteArgsSchema = z.object({
  id: z.string().min(1).meta({ hint: 'statusId', positional: true }).describe('Status id to delete'),
  moveTo: z
    .string()
    .min(1)
    .meta({ hint: 'id' })
    .describe('Required — id of the status that orphaned tasks are moved to'),
  yes: confirmField,
});

export default defineSubcommand({
  args: argsFromSchema(statusDeleteArgsSchema),
  meta: {
    description: 'Delete a status; its tasks move to `--move-to` (irreversible)',
    name: 'status-delete',
  },
  async run({ api, args, formatter }) {
    const { id, moveTo, yes } = parseArgsOrThrow(statusDeleteArgsSchema, args);

    await confirmDeletion({
      json: isJsonOutput(args.json),
      message: `Delete status \`${id}\`? Tasks in it move to \`${moveTo}\`.`,
      skip: yes,
    });

    const projectId = await resolveProjectId({ api, ref: args.ref });
    const result = await runProjectStatusDelete({
      api,
      args: { id, moveTo, projectId },
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted status \`${id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectStatusDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
