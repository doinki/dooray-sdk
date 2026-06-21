import { runMemberMe } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { renderMember } from '../utils/render';

export default defineSubcommand({
  globalArgs: ['json', 'profile', 'verbose'],
  meta: { description: 'Show the authenticated member for the active profile', name: 'me' },
  async run({ api, formatter }) {
    const result = await runMemberMe({ api });

    formatter.printData(result, renderMember);
  },
});
