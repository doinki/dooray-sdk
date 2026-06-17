import { runProjectCategoryList } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderList } from '../../../shared/formatter/table';

export default defineSubcommand({
  globalArgs: ['json', 'profile', 'verbose'],
  meta: {
    description: "List the tenant's project categories (read-only; managed in admin)",
    name: 'category-list',
  },
  async run({ api, formatter }) {
    const result = await runProjectCategoryList({ api });

    formatter.printData(result, renderPretty);
    if (result.data.length === 0) formatter.printInfo('No categories.');
  },
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
