import { runWikiUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requiredCsvField, requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

export const wikiUpdateArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
    cc: requiredCsvField(
      'Referrers (comma-separated — `@me` or member ids). Replaces the whole list.',
      'user[,user...]',
    ),
    title: z.string().trim().min(1, 'Page title must not be empty.').meta({ hint: 'text' }).describe('Page title'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiUpdateArgsSchema),
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
      schema: wikiUpdateArgsSchema,
    });

    formatter.printInfo(`Updated wiki page \`${id}\`.`);
  },
});
