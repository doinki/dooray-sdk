import type { WikiDeleteArgs } from '@dooray-sdk/core';
import { runWikiDelete } from '@dooray-sdk/core';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = globalArgsSchema.extend({
  yes: yesSchema,
} satisfies CommandSchemaShape<WikiDeleteArgs>);

export default defineSubcommand({
  meta: { description: 'Delete a wiki page with its children and attachments (irreversible)', name: 'delete' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      confirm: ({ args: a, id }) =>
        confirmDeletion({
          json: isJsonOutput(args.json),
          message: `Delete wiki page \`${id}\` and all its children?`,
          skip: a.yes,
        }),
      formatter,
      render: renderId,
      run: runWikiDelete,
      schema,
    });

    formatter.printInfo(`Deleted wiki page \`${id}\`.`);
  },
  schema,
});
