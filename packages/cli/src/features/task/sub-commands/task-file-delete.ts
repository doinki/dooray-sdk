import { runTaskFileDelete } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireTaskRef, taskRefShape } from '../../../shared/schema/fields';
import { parseArgsOrThrow, scopeRef } from '../../../shared/schema/parse-args';

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
    const { fileId, yes } = parseArgsOrThrow(taskFileDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
      message: `Delete attachment \`${fileId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveTaskId(scopeRef(args));
    const result = await runTaskFileDelete({ api, args: { fileId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted attachment \`${fileId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
