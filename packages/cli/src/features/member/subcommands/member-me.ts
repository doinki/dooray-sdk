import { runMemberMe } from '@dooray-sdk/core';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { globalArgsSchema } from '../../../shared/command/global-args';
import { renderMember } from '../utils/render';

const schema = globalArgsSchema.omit({ ref: true });

export default defineSubcommand({
  meta: { description: 'Show the authenticated member for the active profile', name: 'me' },
  async run({ api, formatter }) {
    const result = await runMemberMe({ api });

    formatter.printData(result, renderMember);
  },
  schema,
});
