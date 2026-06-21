import { runWikiUpdateBody } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

export const wikiUpdateBodyArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiUpdateBodyArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's body, leaving its title and referrers unchanged", name: 'update-body' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateBody,
      schema: wikiUpdateBodyArgsSchema,
    });

    formatter.printInfo(`Updated body of wiki page \`${id}\`.`);
  },
});
