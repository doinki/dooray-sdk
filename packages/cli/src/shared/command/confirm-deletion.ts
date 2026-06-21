import { confirm } from '@clack/prompts';

import { cancelledError, confirmationRequiredError } from '../error/cli-errors';
import { assertInteractive, unwrapPrompt } from '../prompts/interactive';

export interface ConfirmDeletionOptions {
  json?: boolean;
  message: string;
  skip?: boolean;
  stdin?: { isTTY?: boolean };
}

/**
 * Guard a destructive action behind an interactive confirmation.
 *
 * - `skip` (the `--yes` flag) bypasses the prompt — the only way to delete non-interactively.
 * - Without `skip`, a non-TTY (or `--json`) invocation throws instead of silently deleting.
 * - Declining the prompt throws `cancelledError` (exit 130, no error output).
 */
export async function confirmDeletion(options: ConfirmDeletionOptions): Promise<void> {
  if (options.skip) return;

  assertInteractive(options, confirmationRequiredError);

  const answer = unwrapPrompt(await confirm({ initialValue: false, message: options.message }));
  if (!answer) throw cancelledError();
}
