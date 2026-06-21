import { runProjectTagList } from '@dooray-sdk/core';
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
    description: 'List tags with their tag-group constraints (required, single-select)',
    name: 'tag-list',
  },
  async run({ api, args, formatter }) {
    const { result } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectTagList,
      schema,
    });

    formatter.printInfo(result.data.length === 0 ? 'No tags.' : renderPagingFooter(result.paging));
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectTagList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (t) => t.id },
    { header: 'name', value: (t) => t.name },
    { header: 'color', value: (t) => t.color },
    { header: 'group_id', value: (t) => t.tagGroup?.id },
    { header: 'group_name', value: (t) => t.tagGroup?.name },
    { header: 'required', value: (t) => t.tagGroup?.mandatory },
    { header: 'single_select', value: (t) => t.tagGroup?.selectOne },
  ]);
}
