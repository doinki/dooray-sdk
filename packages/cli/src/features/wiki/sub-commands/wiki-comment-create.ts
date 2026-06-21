import { runWikiCommentCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

const schema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('Comment body (Markdown)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
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
