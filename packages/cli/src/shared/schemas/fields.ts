import { z } from 'zod';

/** The standard `--yes` flag that skips a destructive command's confirmation prompt. */
export const confirmField = z.boolean().default(false).describe('Skip the confirmation prompt');

/** The standard `--all` flag for paginated lists: fetch every page at once. */
export const allField = z.boolean().optional().describe('Fetch every page at once (overrides --page/--size)');
