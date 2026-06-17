import { runProjectTemplateDelete } from '@dooray-sdk/core';
import { resolveProjectId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const templateDeleteArgsSchema = z.object({
  id: z.string().min(1).describe('Template id to delete'),
  yes: z.boolean().default(false).describe('Skip the confirmation prompt'),
});

export default defineSubcommand({
  args: {
    id: {
      description: templateDeleteArgsSchema.shape.id.description,
      required: true,
      type: 'positional',
      valueHint: 'templateId',
    },
    yes: {
      description: templateDeleteArgsSchema.shape.yes.description,
      type: 'boolean',
    },
  },
  meta: { description: 'Delete a task template from the project (irreversible)', name: 'template-delete' },
  async run({ api, args, formatter }) {
    const { id, yes } = parseArgsOrThrow(templateDeleteArgsSchema, args);

    await confirmDeletion({ json: args.json, message: `Delete template \`${id}\`?`, skip: yes });

    const projectId = await resolveProjectId({ api, ref: args.ref });
    const result = await runProjectTemplateDelete({
      api,
      args: { id, projectId },
    });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted template \`${id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectTemplateDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
