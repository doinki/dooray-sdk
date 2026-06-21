import type { WikiProjectListArgs } from '@dooray-sdk/core';
import { runWikiProjectList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { allField } from '../../../shared/utils/fields';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';
import { renderList } from '../../../shared/utils/table';

const schema = z.object({
  all: allField,
  page: pageSchema,
  size: sizeSchema,
} satisfies Record<keyof WikiProjectListArgs, any>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'List the wikis you can access (each is tied to a project)', name: 'project-list' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

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
