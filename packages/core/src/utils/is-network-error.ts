import { isError } from './is-error';

const errorMessages = new Set([
  'network error',
  'NetworkError when attempting to fetch resource.',
  'The Internet connection appears to be offline.',
  'Network request failed',
  'fetch failed',
  'terminated',
  ' A network error occurred.',
  'Network connection lost',
]);

export function isNetworkError(error: unknown): boolean {
  if (!isError(error) || error.name !== 'TypeError' || typeof error.message !== 'string') return false;

  const { message, stack } = error;

  if (message === 'Load failed' || (message.startsWith('Load failed (') && message.endsWith(')')))
    return stack === undefined || '__sentry_captured__' in error;

  if (message.startsWith('error sending request for url')) return true;

  if (message === 'Failed to fetch' || (message.startsWith('Failed to fetch (') && message.endsWith(')'))) return true;

  return errorMessages.has(message);
}
