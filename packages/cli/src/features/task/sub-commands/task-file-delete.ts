import { runTaskFileDelete } from '@dooray-sdk/core';
import { resolveTaskId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const taskFileDeleteArgsSchema = z
  .object({
    fileId: z.string().min(1).describe('Attachment id to delete (from `dooray task file-list`)'),
    id: z
      .string()
      .optional()
      .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
    ref: z
      .string()
      .optional()
      .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
    yes: z.boolean().default(false).describe('Skip the confirmation prompt'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    'file-id': {
      description: taskFileDeleteArgsSchema.shape.fileId.description,
      required: true,
      type: 'string',
      valueHint: 'fileId',
    },
    id: {
      description: taskFileDeleteArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'taskId',
    },
    ref: { ...globalArgs.ref, description: taskFileDeleteArgsSchema.shape.ref.description, required: false },
    yes: { description: taskFileDeleteArgsSchema.shape.yes.description, type: 'boolean' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete an attachment from a task (irreversible)', name: 'file-delete' },
  async run({ api, args, formatter }) {
    const { fileId, yes } = parseArgsOrThrow(taskFileDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
      message: `Delete attachment \`${fileId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveTaskId({ id: args.id, ref: args.ref });
    const result = await runTaskFileDelete({ api, args: { fileId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted attachment \`${fileId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runTaskFileDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
