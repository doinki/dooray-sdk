import type { WikiProjectListArgs } from '@dooray-sdk/core';
import { runWikiProjectList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { allSchema } from '../../../shared/schemas/fields';
import { parseArgsOrThrow } from '../../../shared/schemas/parse-args';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema.omit({ ref: true }).extend({
  all: allSchema,
  page: pageSchema,
  size: sizeSchema,
} satisfies CommandSchemaShape<WikiProjectListArgs>);

export default defineSubcommand({
  meta: { description: 'List the wikis you can access (one per project)', name: 'project-list' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    const result = await runWikiProjectList({ api, args: data });

    formatter.printData(result, renderPretty);
    formatter.printInfo(result.data.length === 0 ? 'No wikis.' : renderPagingFooter(result.paging));
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runWikiProjectList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (w) => w.id },
    { header: 'name', value: (w) => w.name },
    { header: 'scope', value: (w) => w.scope },
    { header: 'type', value: (w) => w.type },
    { header: 'projectId', value: (w) => w.project.id },
    { header: 'projectCategoryId', value: (w) => w.project.projectCategoryId },
    { header: 'homePageId', value: (w) => w.home.pageId },
  ]);
}
