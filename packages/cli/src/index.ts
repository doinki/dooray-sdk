import { defineCommand } from 'citty';

import packageJson from '../package.json';

export default defineCommand({
  meta: {
    description: packageJson.description,
    name: 'dooray',
    version: packageJson.version,
  },
  subCommands: {
    auth: () => import('./features/auth/sub-commands').then((m) => m.default),
    member: () => import('./features/member/sub-commands').then((m) => m.default),
    profile: () => import('./features/profile/sub-commands').then((m) => m.default),
    project: () => import('./features/project/sub-commands').then((m) => m.default),
    task: () => import('./features/task/sub-commands').then((m) => m.default),
    wiki: () => import('./features/wiki/sub-commands').then((m) => m.default),
  },
});
