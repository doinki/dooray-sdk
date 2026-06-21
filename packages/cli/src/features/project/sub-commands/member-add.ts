import { runProjectMemberAdd } from '@dooray-sdk/core';
import { ASSIGNABLE_ROLES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runWithProjectScope } from '../../../shared/command/run-with-project-scope';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';
import { argsFromSchema } from '../../../shared/schemas/derive-args';

const schema = z.object({
  id: z
    .string()
    .min(1)
    .meta({ hint: 'memberId', positional: true })
    .describe(
      'Organization member id to add (look up via `dooray member search`). Must already belong to the project’s organization',
    ),
  role: z.enum(ASSIGNABLE_ROLES).describe('Role to assign — admin can manage the project, member can participate'),
});

export default defineSubcommand({
  args: argsFromSchema(schema),
  meta: { description: 'Add an existing organization member to the project', name: 'member-add' },
  async run({ api, args, formatter }) {
    const { data } = await runWithProjectScope({
      api,
      args,
      formatter,
      render: renderPretty,
      run: runProjectMemberAdd,
      schema,
    });

    formatter.printInfo(`Added member \`${data.id}\` as \`${data.role}\`.`);
  },
});

function renderPretty({ data }: Awaited<ReturnType<typeof runProjectMemberAdd>>): string {
  return renderKeyValue([['Role', data.role]]);
}
