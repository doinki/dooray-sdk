import { runMemberView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { argsFromSchema } from '../../../shared/schema/derive-args';
import { parseArgsOrThrow } from '../../../shared/schema/parse-args';
import { renderMember } from '../render';

export const memberViewArgsSchema = z.object({
  id: z.string().min(1).meta({ hint: 'memberId', positional: true }).describe('Dooray member id'),
});

export default defineSubcommand({
  args: argsFromSchema(memberViewArgsSchema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Show a tenant member by id', name: 'view' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(memberViewArgsSchema, args);

    const result = await runMemberView({ api, args: data });

    formatter.printData(result, renderMember);
  },
});
