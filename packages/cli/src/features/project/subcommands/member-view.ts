import { runProjectMemberView } from '@dooray-sdk/core';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

const schema = globalArgsSchema.extend({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'memberId', positional: true })
    .describe('Member id to look up — use the organizationMemberId values from `project member-list`'),
});

export default defineSubcommand({
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
      schema,
    });
  },
  schema,
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberView>>): string {
  return renderKeyValue([
    ['id', data.organizationMemberId],
    ['role', data.role],
  ]);
}
