import { runWikiFileDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';

export const wikiFileDeleteArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    fileId: z.string().min(1).meta({ hint: 'fileId' }).describe('Page file id to delete (from `dooray wiki view`)'),
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiFileDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
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
      schema: wikiFileDeleteArgsSchema,
    });

    formatter.printInfo(`Deleted attachment \`${data.fileId}\`.`);
  },
});
