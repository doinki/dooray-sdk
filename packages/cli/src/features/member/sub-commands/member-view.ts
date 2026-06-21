import type { MemberViewArgs } from '@dooray-sdk/core';
import { runMemberView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { argsFromSchema } from '../../../shared/utils/derive-args';
import { parseArgsOrThrow } from '../../../shared/utils/parse-args';
import { renderMember } from '../utils/render';

const schema = z.object({
  id: z
    .string()
    .trim()
    .min(1)
    .meta({ hint: 'memberId', positional: true })
    .describe('Member id (from `dooray member search`)'),
} satisfies Record<keyof MemberViewArgs, any>);

export default defineSubcommand({
  args: argsFromSchema(schema),
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Show a tenant member by id', name: 'view' },
  async run({ api, args, formatter }) {
    const data = parseArgsOrThrow(schema, args);

    const result = await runMemberView({ api, args: data });

    formatter.printData(result, renderMember);
  },
});
