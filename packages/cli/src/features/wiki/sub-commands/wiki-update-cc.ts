import { runWikiUpdateCc } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requiredCsvField, requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';

export const wikiUpdateCcArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    cc: requiredCsvField(
      'Referrers (comma-separated — `@me` or member ids). Replaces the whole list.',
      'user[,user...]',
    ),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiUpdateCcArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's referrers, leaving its title and body unchanged", name: 'update-cc' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateCc,
      schema: wikiUpdateCcArgsSchema,
    });

    formatter.printInfo(`Updated referrers of wiki page \`${id}\`.`);
  },
});
