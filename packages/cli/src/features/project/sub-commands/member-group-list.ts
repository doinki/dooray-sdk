import { runProjectMemberGroupList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderPagingFooter } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';
import { renderList } from '../../../shared/utils/table';

const schema = z.object({
  page: pageSchema,
  size: sizeSchema,
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: {
    description: "List a project's member groups (codes only; no member list)",
    name: 'member-group-list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMemberGroupList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No member groups.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberGroupList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (g) => g.id },
    { header: 'code', value: (g) => g.code },
    { header: 'project_id', value: (g) => g.project.id },
    { header: 'created', value: (g) => g.createdAt },
    { header: 'updated', value: (g) => g.updatedAt },
  ]);
}
