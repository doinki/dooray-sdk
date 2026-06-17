import { runWikiUpdateTitle } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';

export const wikiUpdateTitleArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    title: z.string().trim().min(1, 'Page title must not be empty.').meta({ hint: 'text' }).describe('Page title'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiUpdateTitleArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki page's title, leaving its body and referrers unchanged", name: 'update-title' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateTitle,
      schema: wikiUpdateTitleArgsSchema,
    });

    formatter.printInfo(`Updated title of wiki page \`${id}\`.`);
  },
});
