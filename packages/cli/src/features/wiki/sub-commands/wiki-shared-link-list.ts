import { runWikiSharedLinkList } from '@dooray-sdk/core';
import { WIKI_SHARED_LINK_STATES } from '@dooray-sdk/core/constants';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgs } from '../../../shared/command/global-args';
import { runWithWikiScope } from '../../../shared/command/run-with-wiki-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';

export const wikiSharedLinkListArgsSchema = z
  .object({
    all: z.boolean().optional().describe('Fetch every page of shared links (overrides --page/--size)'),
    id: z
      .string()
      .optional()
      .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
    page: pageSchema,
    ref: z
      .string()
      .optional()
      .describe(
        'Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.',
      ),
    size: sizeSchema,
    state: z.enum(WIKI_SHARED_LINK_STATES).optional().describe('Filter by state: valid or invalid (default: valid)'),
  })
  .refine((args) => args.id !== undefined || args.ref !== undefined, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  });

export default defineSubcommand({
  args: {
    all: { description: wikiSharedLinkListArgsSchema.shape.all.description, type: 'boolean' },
    id: {
      description: wikiSharedLinkListArgsSchema.shape.id.description,
      required: false,
      type: 'positional',
      valueHint: 'pageId',
    },
    page: { description: wikiSharedLinkListArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    ref: { ...globalArgs.ref, description: wikiSharedLinkListArgsSchema.shape.ref.description, required: false },
    size: { description: wikiSharedLinkListArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
    state: {
      description: wikiSharedLinkListArgsSchema.shape.state.description,
      options: [...WIKI_SHARED_LINK_STATES],
      type: 'enum',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: "List a wiki page's external shared links", name: 'shared-link-list' },
  async run({ api, args, formatter }) {
    const { result } = await runWithWikiScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiSharedLinkList,
      schema: wikiSharedLinkListArgsSchema,
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
