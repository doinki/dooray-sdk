import { runWikiCommentList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { allField, requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';
import { renderList } from '../../../shared/utils/table';
import { formatDateTime, truncate } from '../../../shared/utils/text';

const schema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    all: allField,
    page: pageSchema,
    size: sizeSchema,
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "List a wiki page's comments", name: 'comment-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiCommentList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No comments.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (c) => c.id },
    { header: 'created', value: (c) => formatDateTime(c.createdAt) },
    { header: 'body', value: (c) => truncate(c.body.content.replaceAll(/\s+/g, ' ').trim(), 60) },
  ]);
}
