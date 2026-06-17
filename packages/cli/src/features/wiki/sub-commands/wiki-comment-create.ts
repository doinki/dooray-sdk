import { runWikiCommentCreate } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/schema/fields';

export const wikiCommentCreateArgsSchema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    body: z.string().min(1).meta({ hint: 'text' }).describe('Comment body (Markdown)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(wikiCommentCreateArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Add a comment to a wiki page', name: 'comment-create' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCommentCreate,
      schema: wikiCommentCreateArgsSchema,
    });

    formatter.printInfo(`Created comment \`${result.data.id}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentCreate>>): string {
  return renderKeyValue([['ID', data.id]]);
}
