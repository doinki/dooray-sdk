import { defineCommand } from 'citty';

export default defineCommand({
  meta: { description: 'Create, view, update, and manage tasks and their comments and files', name: 'task' },
  subCommands: {
    close: () => import('./task-close').then((m) => m.default),
    'comment-create': () => import('./task-comment-create').then((m) => m.default),
    'comment-delete': () => import('./task-comment-delete').then((m) => m.default),
    'comment-list': () => import('./task-comment-list').then((m) => m.default),
    'comment-update': () => import('./task-comment-update').then((m) => m.default),
    'comment-view': () => import('./task-comment-view').then((m) => m.default),
    create: () => import('./task-create').then((m) => m.default),
    'file-delete': () => import('./task-file-delete').then((m) => m.default),
    'file-download': () => import('./task-file-download').then((m) => m.default),
    'file-list': () => import('./task-file-list').then((m) => m.default),
    'file-upload': () => import('./task-file-upload').then((m) => m.default),
    'file-view': () => import('./task-file-view').then((m) => m.default),
    list: () => import('./task-list').then((m) => m.default),
    move: () => import('./task-move').then((m) => m.default),
    'set-assignee-status': () => import('./task-set-assignee-status').then((m) => m.default),
    'set-parent': () => import('./task-set-parent').then((m) => m.default),
    'set-status': () => import('./task-set-status').then((m) => m.default),
    update: () => import('./task-update').then((m) => m.default),
    view: () => import('./task-view').then((m) => m.default),
  },
});
