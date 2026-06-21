import { runWikiSharedLinkList } from '@dooray-sdk/core';
import { WIKI_SHARED_LINK_STATES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { allField, requireWikiRef, wikiRefShape } from '../../../shared/utils/fields';
import { renderList } from '../../../shared/utils/table';

const schema = requireWikiRef(
  z.object({
    ...wikiRefShape,
    all: allField,
    page: pageSchema,
    size: sizeSchema,
    state: z.enum(WIKI_SHARED_LINK_STATES).optional().describe('Filter by state: valid or invalid (default: valid)'),
  }),
);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
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
