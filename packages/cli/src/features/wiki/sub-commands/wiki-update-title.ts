import type { WikiUpdateTitleArgs } from '@dooray-sdk/core';
import { runWikiUpdateTitle } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';

const schema = globalArgsSchema.extend({
  title: z.string().trim().min(1).meta({ hint: 'text' }).describe('New page title.'),
} satisfies CommandSchemaShape<WikiUpdateTitleArgs>);

export default defineSubcommand({
  meta: {
    description: "Replace a wiki page's title (leaves body and cc unchanged)",
    name: 'update-title',
  },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiUpdateTitle,
      schema,
    });

    formatter.printInfo(`Updated title of wiki page \`${id}\`.`);
  },
  schema,
});
