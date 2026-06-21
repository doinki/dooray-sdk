import { runWikiUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { splitCsv } from '../../../shared/utils/csv';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

const schema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
    cc: z
      .string()
      .transform(splitCsv)
      .describe('Referrers (comma-separated — `@me` or member ids). Replaces the whole list.')
      .meta({ hint: 'user[,user...]' }),
    title: z.string().trim().min(1, 'Page title must not be empty.').meta({ hint: 'text' }).describe('Page title'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "Replace a wiki page's title, body, and referrers together",
    name: 'update',
  },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdate,
      schema,
    });

    formatter.printInfo(`Updated wiki page \`${id}\`.`);
  },
});
