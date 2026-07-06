import type { TemplateDeleteArgs } from '@dooray-sdk/core';
import { runProjectTemplateDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmField } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  id: z.string().min(1).meta({ hint: 'templateId', positional: true }).describe('Template id to delete'),
  yes: yesSchema,
} satisfies CommandSchemaShape<TemplateDeleteArgs>);

export default defineSubcommand({
  meta: { description: 'Delete a task template from the project (irreversible)', name: 'template-delete' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      confirm: confirmField(({ args }) => `Delete template \`${args.id}\`?`),
      formatter,
      render: renderId,
      run: runProjectTemplateDelete,
      schema,
    });

    formatter.printInfo(`Deleted template \`${data.id}\`.`);
  },
  schema,
});
