import type { WikiCommentUpdateArgs } from '@dooray-sdk/core';
import { runWikiCommentUpdate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  body: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'text' })
    .describe('New comment body (Markdown). Replaces the whole body.'),
  commentId: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id to update (from `dooray wiki comment-list`)'),
} satisfies CommandSchemaShape<WikiCommentUpdateArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: "Replace a wiki comment's body", name: 'comment-update' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderId,
      run: runWikiCommentUpdate,
      schema,
    });

    formatter.printInfo(`Updated comment \`${result.data.id}\`.`);
  },
});
