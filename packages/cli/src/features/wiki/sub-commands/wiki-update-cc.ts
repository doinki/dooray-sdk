import { runWikiUpdateCc } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { splitCsv } from '../../../shared/utils/csv';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

const schema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    cc: z
      .string()
      .transform(splitCsv)
      .describe('Referrers (comma-separated — `@me` or member ids). Replaces the whole list.')
      .meta({ hint: 'user[,user...]' }),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's referrers, leaving its title and body unchanged", name: 'update-cc' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateCc,
      schema,
    });

    formatter.printInfo(`Updated referrers of wiki page \`${id}\`.`);
  },
});
