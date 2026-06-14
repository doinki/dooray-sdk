import { isError } from './is-error';

export function extractMessage(error: unknown): string | undefined {
  if (isError(error)) return error.message;
  if (typeof error === 'string') return error;
}
