import { z } from 'zod';

export type ProjectScopedArgs<A> = { ref: string } & Omit<A, 'projectId'>;

export type TaskScopedArgs<A> = { ref: string } & Omit<A, 'id' | 'projectId' | 'taskId'>;

export type WikiScopedArgs<A> = { ref: string } & Omit<A, 'id' | 'projectId'>;

export const projectScopeShape = {
  ref: z
    .string()
    .describe(
      'The project — a 19-digit id, a `<projectId>/<id>` pair, or a Dooray URL (a task/drive/wiki URL resolves to its project).',
    ),
};

export const taskScopeShape = {
  ref: z.string().describe('The task — a 19-digit id, a `<projectId>/<taskId>` pair, or a Dooray task URL.'),
};

export const wikiScopeShape = {
  ref: z.string().describe('The wiki page — a 19-digit id, a `<projectId>/<pageId>` pair, or a Dooray wiki URL.'),
};
