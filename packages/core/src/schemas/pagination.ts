import { z } from 'zod';

export const DEFAULT_PAGE = 0;
export const DEFAULT_SIZE = 50;
export const MAX_SIZE = 100;

export const pageSchema = z.coerce
  .number()
  .int()
  .nonnegative()
  .default(DEFAULT_PAGE)
  .describe('0-based page number (default: 0)');
export const sizeSchema = z.coerce
  .number()
  .int()
  .positive()
  .max(MAX_SIZE)
  .default(DEFAULT_SIZE)
  .describe('Page size (default: 50, max: 100)');
