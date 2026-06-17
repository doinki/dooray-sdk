import { runProjectStatusDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const statusDeleteArgsSchema = z.object({
  id: z.string().min(1).describe('Status id to delete'),
  moveTo: z.string().min(1).describe('Required — id of the status that orphaned tasks are moved to'),
  yes: z.boolean().default(false).describe('Skip the confirmation prompt'),
});

export default defineSubcommand({
  args: {
    id: {
      description: statusDeleteArgsSchema.shape.id.description,
      required: true,
      type: 'positional',
      valueHint: 'statusId',
    },
    'move-to': {
      description: statusDeleteArgsSchema.shape.moveTo.description,
      required: true,
      type: 'string',
      valueHint: 'id',
    },
    yes: {
      description: statusDeleteArgsSchema.shape.yes.description,
      type: 'boolean',
    },
  },
  meta: {
    description: 'Delete a status; its tasks move to `--move-to` (irreversible)',
    name: 'status-delete',
  },
  async run({ api, args, formatter }) {
    const { id, moveTo, yes } = parseArgsOrThrow(statusDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
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
