import { z } from 'zod';

interface ScopeRefInput {
  id?: string;
  ref?: string;
}

const hasIdOrRef = (args: unknown): boolean => {
  const { id, ref } = args as ScopeRefInput;
  return id !== undefined || ref !== undefined;
};

/**
 * The shared task identity fields: a `<taskId>` positional plus a `--ref` fallback.
 * Spread into a command's `z.object({ ...taskRefShape, ... })`, then wrap with {@link requireTaskRef}.
 */
export const taskRefShape = {
  id: z
    .string()
    .optional()
    .meta({ hint: 'taskId', positional: true })
    .describe('Task ID (19-digit). Looked up across all accessible projects when given alone.'),
  ref: z
    .string()
    .optional()
    .describe('Task to target instead of <taskId>: a 19-digit task ID, `<projectId>/<id>`, or a Dooray task URL.'),
};

/** The shared wiki-page identity fields: a `<pageId>` positional plus a `--ref` fallback. */
export const wikiRefShape = {
  id: z
    .string()
    .optional()
    .meta({ hint: 'pageId', positional: true })
    .describe('Wiki page ID (19-digit). Looked up across all accessible wikis when given alone.'),
  ref: z
    .string()
    .optional()
    .describe('Wiki page to target instead of <pageId>: a 19-digit page ID, `<projectId>/<id>`, or a Dooray wiki URL.'),
};

/** Require that either the `<taskId>` positional or `--ref` was provided. */
export function requireTaskRef<T extends z.ZodObject>(schema: T): T {
  return schema.refine(hasIdOrRef, {
    message: 'Provide the task: pass <taskId> or --ref (task ID, `<projectId>/<id>`, or a Dooray task URL).',
    path: ['id'],
  }) as unknown as T;
}

/** Require that either the `<pageId>` positional or `--ref` was provided. */
export function requireWikiRef<T extends z.ZodObject>(schema: T): T {
  return schema.refine(hasIdOrRef, {
    message: 'Provide the wiki page: pass <pageId> or --ref (page ID, `<projectId>/<id>`, or a Dooray wiki URL).',
    path: ['id'],
  }) as unknown as T;
}

/** The standard `--yes` flag that skips a destructive command's confirmation prompt. */
export const confirmField = z.boolean().default(false).describe('Skip the confirmation prompt');

/** The standard `--all` flag for paginated lists: fetch every page at once. */
export const allField = z.boolean().optional().describe('Fetch every page at once (overrides --page/--size)');
