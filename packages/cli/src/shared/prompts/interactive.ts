import { isCancel } from '@clack/prompts';
import type { DoorayError } from '@dooray-sdk/core/errors';

import { cancelledError } from '../error/cli-errors';

export interface InteractiveContext {
  json?: boolean;
  stdin?: { isTTY?: boolean };
}

/**
 * Guard an interactive prompt: throws `onUnavailable()` when the session is
 * non-interactive (`--json` output or a non-TTY stdin).
 */
export function assertInteractive(context: InteractiveContext, onUnavailable: () => DoorayError): void {
  const stdin = context.stdin ?? process.stdin;
  if (context.json === true || stdin.isTTY !== true) throw onUnavailable();
}

/**
 * Unwrap a `@clack/prompts` result, throwing `cancelledError` when the user
 * cancels (Ctrl-C / Esc).
 */
export function unwrapPrompt<T>(value: symbol | T): T {
  if (isCancel(value)) throw cancelledError();
  return value;
}
