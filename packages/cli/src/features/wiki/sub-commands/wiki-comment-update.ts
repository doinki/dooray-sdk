import { runWikiCommentUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  body: z.string().min(1).meta({ hint: 'text' }).describe('New comment body (Markdown). Replaces the whole body.'),
  commentId: z
    .string()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id to update (from `dooray wiki comment-list`)'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "Replace a wiki comment's body", name: 'comment-update' },
  async run({ api, args, formatter }) {
    const { data } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiCommentUpdate,
      schema,
    });

    formatter.printInfo(`Updated comment \`${data.commentId}\`.`);
  },
});
