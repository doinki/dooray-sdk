import { runWikiCommentView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';
import { formatDateTime } from '../../../shared/utils/text';

const schema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    commentId: z
      .string()
      .min(1)
      .meta({ hint: 'commentId' })
      .describe('Comment id to view (from `dooray wiki comment-list`)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "View a wiki comment's full body and metadata", name: 'comment-view' },
  async run({ api, args, formatter }) {
    await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCommentView,
      schema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentView>>): string {
  const content = renderKeyValue([
    ['ID', data.id],
    ['Created', formatDateTime(data.createdAt)],
    ['Modified', formatDateTime(data.modifiedAt)],
  ]);

  return `${content}\nBody:\n${data.body.content.trim()}`;
}
