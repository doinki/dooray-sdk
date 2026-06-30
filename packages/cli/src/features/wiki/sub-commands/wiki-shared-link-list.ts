import type { WikiSharedLinkListArgs } from '@dooray-sdk/core';
import { runWikiSharedLinkList } from '@dooray-sdk/core';
import { WIKI_SHARED_LINK_STATES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { allSchema } from '../../../shared/schemas/fields';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema.extend({
  all: allSchema,
  page: pageSchema,
  size: sizeSchema,
  state: z
    .enum(WIKI_SHARED_LINK_STATES)
    .optional()
    .describe('Filter by state: `valid` or `invalid` (default: `valid`).'),
} satisfies CommandSchemaShape<WikiSharedLinkListArgs>);

export default defineSubcommand({
  meta: { description: "List a wiki page's external shared links", name: 'shared-link-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiSharedLinkList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No shared links.' : renderPagingFooter(result.paging));
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiSharedLinkList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (l) => l.id },
    { header: 'scope', value: (l) => l.scope },
    { header: 'descendants', value: (l) => l.includeDescendants },
    { header: 'link', value: (l) => l.sharedLink },
  ]);
}
