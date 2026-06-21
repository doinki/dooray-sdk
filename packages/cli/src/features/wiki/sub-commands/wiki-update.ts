import type { WikiUpdateArgs } from '@dooray-sdk/core';
import { runWikiUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';

const schema = z.object({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
  cc: z
    .string()
    .transform(splitCsv)
    .describe('Referrers (comma-separated — `@me` or member ids). Replaces the whole list.')
    .meta({ hint: 'user[,user...]' }),
  title: z.string().trim().min(1, 'Page title must not be empty.').meta({ hint: 'text' }).describe('Page title'),
} satisfies CommandSchemaShape<WikiUpdateArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
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
