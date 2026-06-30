import { runProjectMemberGroupView } from '@dooray-sdk/core';
import columnify from 'columnify';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'memberGroupId', positional: true })
    .describe('Member group id (from `member-group-list`)'),
});

export default defineSubcommand({
  meta: {
    description: 'Show a member group and its organization members',
    name: 'member-group-view',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMemberGroupView,
      schema,
    });
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberGroupView>>): string {
  const content = renderKeyValue([
    ['id', data.id],
    ['code', data.code],
    ['project', `${data.project.code} (${data.project.id})`],
    ['createdAt', data.createdAt],
    ['updatedAt', data.updatedAt],
  ]);

  const heading = `members (${String(data.members.length)})`;
  if (data.members.length === 0) return `${content}\n\n${heading}`;

  const sorted = data.members.toSorted((a, b) => a.name.localeCompare(b.name));
  const list = columnify(
    sorted.map((member, index) => ({
      id: member.id,
      name: member.name,
      no: String(index + 1),
    })),
    {
      columns: ['no', 'name', 'id'],
      columnSplitter: '  ',
      config: { no: { align: 'right' } },
      showHeaders: false,
    },
  );

  return `${content}\n\n${heading}\n${list}`;
}
