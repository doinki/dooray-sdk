import { isRestResponseError } from '@dooray-sdk/client/lib';

import { RefError } from '../resolve/errors';
import { extractMessage } from '../utils/extract-message';
import { isNetworkError } from '../utils/is-network-error';
import { fromRestResponseError } from './rest';
import type { SurfaceError } from './surface';
import { DoorayError } from './surface';

export function toSurfaceError(error: unknown): SurfaceError {
  if (error instanceof DoorayError) {
    return {
      code: error.code,
      hint: error.hint,
      message: error.message,
    };
  }

  if (error instanceof RefError) {
    return {
      code: 'validation',
      hint: 'Pass a 19-digit id, `projectId/id`, or a Dooray URL.',
      message: error.message,
    };
  }

  if (isRestResponseError(error)) return fromRestResponseError(error);

  if (isNetworkError(error)) {
    return {
      code: 'network',
      hint: 'Check your network connection and try again.',
      message: 'Could not connect to the Dooray API.',
    };
  }

  return {
    code: 'server',
    hint: 'Try again. If it keeps failing, report the issue.',
    message: extractMessage(error) ?? 'An unexpected error occurred.',
  };
}
