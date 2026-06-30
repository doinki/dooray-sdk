import { defineCommand } from 'citty';

import packageJson from '../package.json';

export default defineCommand({
  meta: {
    description: packageJson.description,
    name: 'dooray',
    version: packageJson.version,
  },
  subCommands: {
    auth: () => import('./features/auth/subcommands').then((m) => m.default),
    member: () => import('./features/member/subcommands').then((m) => m.default),
    profile: () => import('./features/profile/subcommands').then((m) => m.default),
    project: () => import('./features/project/subcommands').then((m) => m.default),
    task: () => import('./features/task/subcommands').then((m) => m.default),
    wiki: () => import('./features/wiki/subcommands').then((m) => m.default),
  },
});
