import { runWikiDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { confirmField, requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

export const wikiDeleteArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a wiki page along with its child pages and attachments (irreversible)', name: 'delete' },
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
      schema: wikiDeleteArgsSchema,
    });

    formatter.printInfo(`Deleted wiki page \`${id}\`.`);
  },
});
