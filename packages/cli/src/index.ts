import { defineCommand } from 'citty';

export default defineCommand({
  meta: {
    description: 'Dooray CLI — terminal access to Dooray Project & Task',
    name: 'dooray',
    version: '0.0.0',
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
