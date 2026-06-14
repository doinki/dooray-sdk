import { z } from 'zod';

export type ProjectScopedArgs<A> = { ref: string } & Omit<A, 'projectId'>;

export type TaskScopedArgs<A> = { ref: string } & Omit<A, 'id' | 'projectId' | 'taskId'>;

export const projectScopeShape = {
  ref: z
    .string()
    .describe(
      'The project: a 19-digit project id (not a name), a `<projectId>/<id>` pair, or a Dooray URL — a task, drive, or wiki URL resolves to its owning project.',
    ),
};

export const taskScopeShape = {
  ref: z
    .string()
    .describe('The task: a 19-digit task id (not a name), a `<projectId>/<id>` pair, or a Dooray task URL.'),
};
