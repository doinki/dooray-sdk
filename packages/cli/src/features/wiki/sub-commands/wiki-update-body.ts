import type { WikiUpdateBodyArgs } from '@dooray-sdk/core';
import { runWikiUpdateBody } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  body: z.string().min(1).meta({ hint: 'text' }).describe('Page body (Markdown)'),
} satisfies CommandSchemaShape<WikiUpdateBodyArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "Replace a wiki page's body, leaving its title and referrers unchanged", name: 'update-body' },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateBody,
      schema,
    });

    formatter.printInfo(`Updated body of wiki page \`${id}\`.`);
  },
});
