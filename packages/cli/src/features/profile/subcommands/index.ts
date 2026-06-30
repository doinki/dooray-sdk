import { defineCommand } from 'citty';

export default defineCommand({
  meta: { description: 'Manage saved login profiles', name: 'profile' },
  subCommands: {
    add: () => import('./profile-add').then((m) => m.default),
    list: () => import('./profile-list').then((m) => m.default),
    remove: () => import('./profile-remove').then((m) => m.default),
    use: () => import('./profile-use').then((m) => m.default),
  },
});
