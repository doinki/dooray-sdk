import { createDoorayClient } from '@dooray-sdk/client';

import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { isJsonOutput } from '../../../shared/command/json-output';
import { DEFAULT_PROFILE_NAME } from '../../../shared/profile/profile-store';
import { runAuthLogin } from '../operations/auth-login';
import { AuthLoginPrompt } from '../prompts/auth-login-prompt';

export default defineSubcommand({
  globalArgs: ['verbose'],
  meta: { description: 'Select an environment and log in with a Personal API Token', name: 'login' },
  mode: 'local',
  async run({ args, formatter, profileStore }) {
    const prompt = new AuthLoginPrompt({ json: isJsonOutput(args.json) });

    const name = await prompt.readProfileName(DEFAULT_PROFILE_NAME);
    const env = await prompt.selectEnvironment();
    const token = await prompt.readToken();

    const api = createDoorayClient({ baseUrl: env.baseUrl, token });

    await runAuthLogin({
      api,
      args: { env, name, token },
      profileStore,
    });

    formatter.printInfo(`Saved as profile \`${name}\`.`);
  },
});
