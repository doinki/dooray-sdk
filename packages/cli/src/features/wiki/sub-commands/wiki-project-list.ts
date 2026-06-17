import { runWikiProjectList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { renderList } from '../../../shared/formatter/table';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const wikiProjectListArgsSchema = z.object({
  all: z.boolean().optional().describe('Fetch every page of wikis (overrides --page/--size)'),
  page: pageSchema,
  size: sizeSchema,
});

export default defineSubcommand({
  args: {
    all: { description: wikiProjectListArgsSchema.shape.all.description, type: 'boolean' },
    page: { description: wikiProjectListArgsSchema.shape.page.description, type: 'string', valueHint: 'n' },
    size: { description: wikiProjectListArgsSchema.shape.size.description, type: 'string', valueHint: 'n' },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'List the wikis you can access (each is tied to a project)', name: 'project-list' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(wikiProjectListArgsSchema, args);

    const result = await runWikiProjectList({ api, args: data });

    formatter.printData(result, renderPretty);
    formatter.printInfo(result.data.length === 0 ? 'No wikis.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiProjectList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (w) => w.id },
    { header: 'name', value: (w) => w.name },
    { header: 'scope', value: (w) => w.scope },
    { header: 'project', value: (w) => w.project.id },
  ]);
}
