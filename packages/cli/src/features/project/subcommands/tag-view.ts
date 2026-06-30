import { runProjectTagView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  id: z.string().min(1).meta({ hint: 'tagId', positional: true }).describe('Tag id (from `tag-list`)'),
});

export default defineSubcommand({
  meta: { description: 'Show a tag with its color and parent tag-group constraints', name: 'tag-view' },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectTagView,
      schema,
    });
  },
  schema,
});

function renderPretty({ data: tag }: Awaited<ReturnType<typeof runProjectTagView>>): string {
  return renderKeyValue([
    ['id', tag.id],
    ['name', tag.name],
    ['color', tag.color],
    ['groupId', tag.tagGroup?.id],
    ['groupName', tag.tagGroup?.name],
    ['groupRequired', tag.tagGroup?.mandatory],
    ['groupSingleSelect', tag.tagGroup?.selectOne],
  ]);
}
