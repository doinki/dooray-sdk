import { runWikiCommentDelete } from '@dooray-sdk/core';
import { resolveWikiId } from '@dooray-sdk/core/resolve';
import { z } from 'zod';

import { confirmDeletion } from '../../../shared/command/confirm-deletion';
import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { confirmField, requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';
import { parseArgsOrThrow, scopeRef } from '../../../shared/schema/parse-args';

export const wikiCommentDeleteArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    commentId: z
      .string()
      .min(1)
      .meta({ hint: 'commentId' })
      .describe('Comment id to delete (from `dooray wiki comment-list`)'),
    yes: confirmField,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiCommentDeleteArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Delete a wiki comment (irreversible)', name: 'comment-delete' },
  async run({ api, args, formatter }) {
    const { commentId, yes } = parseArgsOrThrow(wikiCommentDeleteArgsSchema, args);

    await confirmDeletion({
      json: args.json,
      message: `Delete comment \`${commentId}\`?`,
      skip: yes,
    });

    const { id, projectId } = resolveWikiId(scopeRef(args));
    const result = await runWikiCommentDelete({ api, args: { commentId, id, projectId } });

    formatter.printData(result, renderPretty);
    formatter.printInfo(`Deleted comment \`${commentId}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentDelete>>): string {
  return renderKeyValue([['ID', data.id]]);
}
