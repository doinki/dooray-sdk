import { z } from 'zod';

export const datePatternSchema = z
  .string()
  .regex(
    /^(?:today|thisweek|prev-\d+d|next-\d+d|[^~]+~[^~]+)$/,
    'Must be one of `today`, `thisweek`, `prev-Nd`, `next-Nd`, or `<startISO>~<endISO>`.',
  );
