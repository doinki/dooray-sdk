import { confirm } from '@clack/prompts';

import { cancelledError, confirmationRequiredError } from '../error/cli-errors';
import { assertInteractive, unwrapPrompt } from '../prompts/interactive';
import { isJsonOutput } from './json-output';

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

interface ConfirmScope<A> {
  args: A;
  id?: string;
  projectId?: string;
}

/**
 * The `confirm` callback for `runWith*Scope`, wiring `--json`/`--yes` automatically —
 * pass only the message. Collapses the identical `confirmDeletion({ json, message, skip })`
 * closure repeated across every destructive command.
 */
export const confirmField =
  <A extends { json?: string; yes?: boolean }>(buildMessage: (scope: ConfirmScope<A>) => string) =>
  (scope: ConfirmScope<A>): Promise<void> =>
    confirmDeletion({ json: isJsonOutput(scope.args.json), message: buildMessage(scope), skip: scope.args.yes });
