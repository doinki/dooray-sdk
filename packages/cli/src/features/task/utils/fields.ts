import { BODY_MIME_TYPES } from '@dooray-sdk/core/constants';
import { z } from 'zod';

const DEFAULT_DESCRIPTION = 'Body content type — text/x-markdown or text/html (default: text/x-markdown)';

/**
 * The optional `--mime-type` flag shared by every task command that accepts a body
 * (task/comment create, update, draft). Pass a custom description where the wording differs.
 */
export const mimeTypeField = (describe: string = DEFAULT_DESCRIPTION) =>
  z.enum(BODY_MIME_TYPES).optional().describe(describe);
