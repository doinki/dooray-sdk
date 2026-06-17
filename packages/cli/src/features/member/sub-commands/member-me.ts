import { runMemberMe } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderKeyValue } from '../../../shared/formatter/output-formatter';

export default defineSubcommand({
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Show the member tied to the active profile token', name: 'me' },
  async run({ api, formatter }) {
    const result = await runMemberMe({ api });

    formatter.printData(result, renderPretty);
  },
});

function renderPretty({ data: member }: Awaited<ReturnType<typeof runMemberMe>>): string {
  return renderKeyValue([
    ['ID', member.id],
    ['Name', member.name],
    ['User Code', member.userCode],
    ['External Email', member.externalEmailAddress],
    ['Locale', member.locale],
    ['Timezone', member.timezoneName],
  ]);
}
