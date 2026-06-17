import { defineCommand } from 'citty';

export default defineCommand({
  meta: { description: 'Manage authentication', name: 'auth' },
  subCommands: {
    login: () => import('./auth-login').then((m) => m.default),
    logout: () => import('./auth-logout').then((m) => m.default),
    status: () => import('./auth-status').then((m) => m.default),
  },
});
