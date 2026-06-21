import { runMemberMe } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderMember } from '../render';

export default defineSubcommand({
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Show the member tied to the active profile token', name: 'me' },
  async run({ api, formatter }) {
    const result = await runMemberMe({ api });

    formatter.printData(result, renderMember);
  },
});
