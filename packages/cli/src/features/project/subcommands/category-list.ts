import { runProjectCategoryList } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema.omit({ ref: true });

export default defineSubcommand({
  meta: {
    description: "List the tenant's project categories (read-only; managed in admin)",
    name: 'category-list',
  },
  async run({ api, formatter }) {
    const result = await runProjectCategoryList({ api });

    formatter.printData(result, renderPretty);
    if (result.data.length === 0) formatter.printInfo('No categories.');
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectCategoryList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: ({ category }) => category.id },
    { header: 'name', value: ({ category, depth }) => `${'-'.repeat(depth)}${category.name}` },
    { header: 'parent_id', value: ({ category }) => category.parentProjectCategoryId },
    { header: 'order', value: ({ category }) => category.order },
  ]);
}
