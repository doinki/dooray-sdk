import type { WikiCommentListArgs } from '@dooray-sdk/core';
import { runWikiCommentList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { allSchema } from '../../../shared/schemas/fields';
import { renderList } from '../../../shared/utils/table';
import { formatDateTime, truncate } from '../../../shared/utils/text';

const schema = globalArgsSchema.extend({
  all: allSchema,
  page: pageSchema,
  size: sizeSchema,
} satisfies CommandSchemaShape<WikiCommentListArgs>);

export default defineSubcommand({
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
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiCommentList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (c) => c.id },
    { header: 'author', value: (c) => `${c.creator.member.name}(${c.creator.member.organizationMemberId})` },
    { header: 'body', value: (c) => truncate(c.body.content.replaceAll(/\s+/g, ' ').trim(), 60) },
    { header: 'createdAt', value: (c) => formatDateTime(c.createdAt) },
    { header: 'updatedAt', value: (c) => formatDateTime(c.modifiedAt) },
  ]);
}
