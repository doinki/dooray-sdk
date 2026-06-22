import type { WikiCommentCreateArgs } from '@dooray-sdk/core';
import { runWikiCommentCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  body: z.string().trim().min(1).meta({ hint: 'text' }).describe('Comment body (Markdown).'),
} satisfies CommandSchemaShape<WikiCommentCreateArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Add a comment to a wiki page', name: 'comment-create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runWikiCommentCreate,
      schema,
    });

    formatter.printInfo(`Created comment \`${result.data.id}\`.`);
  },
});
