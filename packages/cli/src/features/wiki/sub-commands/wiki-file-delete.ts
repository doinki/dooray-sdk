import type { WikiFileDeleteArgs } from '@dooray-sdk/core';
import { runWikiFileDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = z.object({
  fileId: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'fileId', positional: true })
    .describe('Page file id to delete (from `dooray wiki view`).'),
  yes: yesSchema,
} satisfies CommandSchemaShape<WikiFileDeleteArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Remove an attached file from a wiki page (irreversible)', name: 'file-delete' },
  async run({ api, args, formatter }) {
    const { data } = await runWithWikiScope({
      api,
      args,
      confirm: ({ args: a }) =>
        confirmDeletion({ json: isJsonOutput(args.json), message: `Delete attachment \`${a.fileId}\`?`, skip: a.yes }),
      formatter,
      render: renderId,
      run: runWikiFileDelete,
      schema,
    });

    formatter.printInfo(`Deleted attachment \`${data.fileId}\`.`);
  },
});
