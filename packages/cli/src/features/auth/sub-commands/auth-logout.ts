import { defineSubcommand } from '../../../shared/command/define-subcommand';
import { runAuthLogout } from '../operations/auth-logout';

export default defineSubcommand({
  globalArgs: [],
  meta: { description: 'Log out the active profile (clears its stored token)', name: 'logout' },
  mode: 'local',
  run({ formatter, profileStore }) {
    const result = runAuthLogout({ profileStore });

    if (result) formatter.printInfo(`Logged out: ${result.name}`);
    else formatter.printInfo('Already logged out.');
  },
});
