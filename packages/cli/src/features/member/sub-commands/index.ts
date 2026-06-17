import { defineCommand } from 'citty';

export default defineCommand({
  meta: { description: 'Look up tenant members', name: 'member' },
  subCommands: {
    me: () => import('./member-me').then((m) => m.default),
    search: () => import('./member-search').then((m) => m.default),
    view: () => import('./member-view').then((m) => m.default),
  },
});
