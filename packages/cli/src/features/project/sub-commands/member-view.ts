import { runProjectMemberView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export const memberViewArgsSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe('Member id to look up — use the organizationMemberId values from `project member-list`'),
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
  meta: {
    description: 'Show a project member with its role (admin/member/postuser/leaver)',
    name: 'member-view',
  },
  async run({ api, args, formatter }) {
    await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMemberView,
      schema: memberViewArgsSchema,
    });
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberView>>): string {
  return renderKeyValue([
    ['ID', data.organizationMemberId],
    ['Role', data.role],
  ]);
}
