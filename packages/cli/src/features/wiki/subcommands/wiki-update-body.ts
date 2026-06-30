import type { WikiUpdateBodyArgs } from '@dooray-sdk/core';
import { runWikiUpdateBody } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';

const schema = globalArgsSchema.extend({
  body: z.string().trim().min(1).meta({ hint: 'text' }).describe('Page body (Markdown).'),
} satisfies CommandSchemaShape<WikiUpdateBodyArgs>);

export default defineSubcommand({
  meta: { description: "Replace a wiki page's body (leaves title and cc unchanged)", name: 'update-body' },
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
  schema,
});
