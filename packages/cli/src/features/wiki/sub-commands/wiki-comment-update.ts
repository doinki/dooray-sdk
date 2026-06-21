import { runWikiCommentUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';

export const wikiCommentUpdateArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('New comment body (Markdown). Replaces the whole body.'),
    commentId: z
      .string()
      .min(1)
      .meta({ hint: 'commentId' })
      .describe('Comment id to update (from `dooray wiki comment-list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiCommentUpdateArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "Replace a wiki comment's body", name: 'comment-update' },
  async run({ api, args, formatter }) {
    const { data } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: () => null,
      run: runWikiCommentUpdate,
      schema: wikiCommentUpdateArgsSchema,
    });

    formatter.printInfo(`Updated comment \`${data.commentId}\`.`);
  },
});
