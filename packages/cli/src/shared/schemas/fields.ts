import { z } from 'zod';

export const yesSchema = z.boolean().default(false).describe('Skip the confirmation prompt');

export const allSchema = z.boolean().optional().describe('Fetch every page at once (overrides --page/--size)');
