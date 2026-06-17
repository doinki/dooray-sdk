import { defineCommand } from 'citty';

export default defineCommand({
  meta: {
    description: 'Browse and manage wiki pages and their comments, files, and shared links',
    name: 'wiki',
  },
  subCommands: {
    'comment-create': () => import('./wiki-comment-create').then((m) => m.default),
    'comment-delete': () => import('./wiki-comment-delete').then((m) => m.default),
    'comment-list': () => import('./wiki-comment-list').then((m) => m.default),
    'comment-update': () => import('./wiki-comment-update').then((m) => m.default),
    'comment-view': () => import('./wiki-comment-view').then((m) => m.default),
    create: () => import('./wiki-create').then((m) => m.default),
    delete: () => import('./wiki-delete').then((m) => m.default),
    'file-delete': () => import('./wiki-file-delete').then((m) => m.default),
    'file-download': () => import('./wiki-file-download').then((m) => m.default),
    'file-upload': () => import('./wiki-file-upload').then((m) => m.default),
    list: () => import('./wiki-list').then((m) => m.default),
    move: () => import('./wiki-move').then((m) => m.default),
    'project-file-download': () => import('./wiki-project-file-download').then((m) => m.default),
    'project-file-upload': () => import('./wiki-project-file-upload').then((m) => m.default),
    'project-list': () => import('./wiki-project-list').then((m) => m.default),
    'shared-link-list': () => import('./wiki-shared-link-list').then((m) => m.default),
    update: () => import('./wiki-update').then((m) => m.default),
    'update-body': () => import('./wiki-update-body').then((m) => m.default),
    'update-cc': () => import('./wiki-update-cc').then((m) => m.default),
    'update-title': () => import('./wiki-update-title').then((m) => m.default),
    view: () => import('./wiki-view').then((m) => m.default),
  },
});
