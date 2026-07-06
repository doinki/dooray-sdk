import type { WikiUpdateArgs } from '@dooray-sdk/core';
import { runWikiUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { splitCsv } from '../../../shared/utils/csv';

const schema = globalArgsSchema.extend({
  body: z.string().min(1).optional().meta({ hint: 'text' }).describe('New page body (Markdown). Omit to keep current.'),
  cc: z
    .string()
    .transform(splitCsv)
    .optional()
    .meta({ hint: 'user[,user...]' })
    .describe('cc as `@me` or member ids (comma-separated). Replaces the whole list; omit to keep current.'),
  title: z.string().min(1).optional().meta({ hint: 'text' }).describe('New page title. Omit to keep current.'),
} satisfies CommandSchemaShape<WikiUpdateArgs>);

export default defineSubcommand({
  meta: {
    description: "Edit a wiki page's title, body, or cc",
    name: 'update',
  },
  async run({ api, args, formatter }) {
    const { id } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runWikiUpdate,
      schema,
    });

    formatter.printInfo(`Updated wiki page \`${id}\`.`);
  },
  schema,
});
