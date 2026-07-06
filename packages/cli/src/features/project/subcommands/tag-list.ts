import type { TagListArgs } from '@dooray-sdk/core';
import { runProjectTagList } from '@dooray-sdk/core';
import { pageSchema, sizeSchema } from '@dooray-sdk/core/schemas';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import type { CommandSchemaShape } from '../../../shared/schemas/derive-args';
import { renderList } from '../../../shared/utils/table';

const schema = globalArgsSchema.extend({
  page: pageSchema,
  size: sizeSchema,
} satisfies CommandSchemaShape<TagListArgs>);

export default defineSubcommand({
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

    formatter.printListFooter(result, 'tags');
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectTagList>>): null | string {
  if (data.length === 0) return null;

  return renderList(data, [
    { header: 'id', value: (t) => t.id },
    { header: 'name', value: (t) => t.name },
    { header: 'color', value: (t) => t.color },
    { header: 'groupId', value: (t) => t.tagGroup?.id },
    { header: 'groupName', value: (t) => t.tagGroup?.name },
    { header: 'required', value: (t) => t.tagGroup?.mandatory },
    { header: 'singleSelect', value: (t) => t.tagGroup?.selectOne },
  ]);
}
