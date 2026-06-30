import type { WikiUpdateArgs } from '@dooray-sdk/core';
import { runWikiUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';

const schema = globalArgsSchema.extend({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown).'),
  cc: z
    .string()
    .transform(splitCsv)
    .describe('cc as `@me` or member ids (comma-separated). Replaces the whole list.')
    .meta({ hint: 'user[,user...]' }),
  title: z.string().trim().min(1).meta({ hint: 'text' }).describe('Page title.'),
} satisfies CommandSchemaShape<WikiUpdateArgs>);

export default defineSubcommand({
  meta: {
    description:
      "Replace a wiki page's title, body, and cc together (use `dooray wiki update-title`, `dooray wiki update-body`, or `dooray wiki update-cc` to change just one)",
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
  schema,
});
