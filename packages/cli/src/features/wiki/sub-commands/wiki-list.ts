import { runWikiList } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderList } from '../../../shared/formatter/table';
import { truncate } from '../../../shared/formatter/text';
import { argsFromSchema } from '../../../shared/schema/derive-args';

export const wikiListArgsSchema = z.object({
  parentId: z
    .string()
    .trim()
    .optional()
    .meta({ hint: 'pageId' })
    .describe('Parent page id (from `dooray wiki list`); omit for the top level'),
});

export default defineSubcommand({
  args: argsFromSchema(wikiListArgsSchema),
  meta: {
    description: "List a wiki's pages one level deep (pass --parent-id for a page's children)",
    name: 'list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runWikiList,
      schema: wikiListArgsSchema,
    });

    if (result.data.length === 0) formatter.printInfo('No pages.');
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (p) => p.id },
    { header: 'title', value: (p) => truncate(p.subject, 60) },
    { header: 'parent', value: (p) => p.parentPageId },
    { header: 'root', value: (p) => p.root },
    { header: 'version', value: (p) => p.version },
  ]);
}
