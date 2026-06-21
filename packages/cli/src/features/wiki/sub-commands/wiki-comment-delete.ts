import type { WikiCommentDeleteArgs } from '@dooray-sdk/core';
import { runWikiCommentDelete } from '@dooray-sdk/core';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderId } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { yesSchema } from '../../../shared/schemas/fields';

const schema = z.object({
  commentId: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'commentId', positional: true })
    .describe('Comment id to delete (from `dooray wiki comment-list`)'),
  yes: yesSchema,
} satisfies CommandSchemaShape<WikiCommentDeleteArgs>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Delete a wiki comment (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      confirm: ({ args: a }) =>
        confirmDeletion({ json: isJsonOutput(args.json), message: `Delete comment \`${a.commentId}\`?`, skip: a.yes }),
      formatter,
      render: renderId,
      run: runWikiCommentDelete,
      schema,
    });

    formatter.printInfo(`Deleted comment \`${result.data.id}\`.`);
  },
});
