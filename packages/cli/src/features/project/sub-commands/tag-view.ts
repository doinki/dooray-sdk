import { runProjectTagView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  id: z.string().min(1).meta({ hint: 'tagId', positional: true }).describe('Tag id (from `tag-list`)'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
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
});

function renderPretty({ data: tag }: Awaited<ReturnType<typeof runProjectTagView>>): string {
  return renderKeyValue([
    ['ID', tag.id],
    ['Name', tag.name],
    ['Color', tag.color],
    ['Group ID', tag.tagGroup?.id],
    ['Group Name', tag.tagGroup?.name],
    ['Group Required', tag.tagGroup?.mandatory],
    ['Group Single-Select', tag.tagGroup?.selectOne],
  ]);
}
