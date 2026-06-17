import { DoorayError } from '@dooray-sdk/core/errors';

export function nonInteractiveError(): DoorayError {
  return new DoorayError({
    code: 'validation',
    hint: 'Interactive login requires a TTY. Run `dooray auth login` in an interactive terminal.',
    message: 'Interactive prompts only work in a TTY environment.',
  });
}

export function cancelledError(): DoorayError {
  return new DoorayError({
    code: 'cancelled',
    hint: '',
    message: 'User cancelled the prompt.',
  });
}

export function confirmationRequiredError(): DoorayError {
  return new DoorayError({
    code: 'validation',
    hint: 'Pass `--yes` to confirm without an interactive prompt.',
    message: 'This action needs confirmation, but no interactive terminal is available.',
  });
}

export function retryBudgetExceededError(waitMs: number): DoorayError {
  return new DoorayError({
    code: 'rate_limited',
    hint: 'Retry in a moment or reduce `--size`.',
    message: `Retry budget exceeded (required wait ${String(waitMs)}ms).`,
  });
}
