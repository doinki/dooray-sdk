import { runMemberView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';

export const memberViewArgsSchema = z.object({
  id: z.string().min(1).describe('Dooray member id'),
});

export default defineSubcommand({
  args: {
    id: {
      description: memberViewArgsSchema.shape.id.description,
      required: true,
      type: 'positional',
      valueHint: 'memberId',
    },
  },
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Show a tenant member by id', name: 'view' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(memberViewArgsSchema, args);

    const result = await runMemberView({ api, args: data });

    formatter.printData(result, renderPretty);
  },
});

function renderPretty({ data: member }: Awaited<ReturnType<typeof runMemberView>>): string {
  return renderKeyValue([
    ['ID', member.id],
    ['Name', member.name],
    ['User Code', member.userCode],
    ['External Email', member.externalEmailAddress],
    ['Locale', member.locale],
    ['Timezone', member.timezoneName],
  ]);
}
